import { ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../lib/firebase';

export interface CakeProduct {
  id: string;
  name: string;
  price: number;
  size: string;
  description: string;
  images: string[];
  category: string;
  createdAt: number;
  featured: boolean;
}

// Admin authentication
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin123';

export const verifyAdminKey = (key: string): boolean => {
  return key === ADMIN_KEY;
};

// CRUD operations
export const getAllCakes = async (): Promise<CakeProduct[]> => {
  try {
    const snapshot = await get(ref(database, 'cakes'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching cakes:', error);
    return [];
  }
};

export const getCakeById = async (id: string): Promise<CakeProduct | null> => {
  try {
    const snapshot = await get(ref(database, `cakes/${id}`));
    return snapshot.exists() ? { id, ...snapshot.val() } : null;
  } catch (error) {
    console.error('Error fetching cake:', error);
    return null;
  }
};

export const addCake = async (cake: Omit<CakeProduct, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const newRef = push(ref(database, 'cakes'));
    const newCake = {
      ...cake,
      createdAt: Date.now()
    };
    await set(newRef, newCake);
    return newRef.key;
  } catch (error) {
    console.error('Error adding cake:', error);
    return null;
  }
};

export const updateCake = async (id: string, cake: Partial<CakeProduct>): Promise<boolean> => {
  try {
    await update(ref(database, `cakes/${id}`), cake);
    return true;
  } catch (error) {
    console.error('Error updating cake:', error);
    return false;
  }
};

export const deleteCake = async (id: string): Promise<boolean> => {
  try {
    await remove(ref(database, `cakes/${id}`));
    return true;
  } catch (error) {
    console.error('Error deleting cake:', error);
    return false;
  }
};

export const getFeaturedCakes = async (): Promise<CakeProduct[]> => {
  try {
    const allCakes = await getAllCakes();
    return allCakes.filter(cake => cake.featured).slice(0, 4);
  } catch (error) {
    console.error('Error fetching featured cakes:', error);
    return [];
  }
};