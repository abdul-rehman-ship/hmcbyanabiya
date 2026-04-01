// utils/firebaseUtils.ts
import { database } from '../lib/firebase';
import { 
  ref, 
  get, 
  set, 
  update, 
  remove, 
  push, 
  query, 
  orderByChild, 
  equalTo,
  onValue,
  off
} from 'firebase/database';

// Define the CakeProduct interface
export interface CakeProduct {
  id: string;
  name: string;
  price: number;
  size: string;
  category: string;
  description: string;
  images: string[];
  featured?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

// Get all cakes
export const getAllCakes = async (): Promise<CakeProduct[]> => {
  try {
    const cakesRef = ref(database, 'cakes');
    const snapshot = await get(cakesRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object to array with ids
      const cakes = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      } as CakeProduct));
      
      // Sort by createdAt descending
      return cakes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting all cakes:', error);
    throw error;
  }
};

// Get a single cake by ID
export const getCakeById = async (id: string): Promise<CakeProduct | null> => {
  try {
    const cakeRef = ref(database, `cakes/${id}`);
    const snapshot = await get(cakeRef);
    
    if (snapshot.exists()) {
      return {
        id: id,
        ...snapshot.val()
      } as CakeProduct;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cake by ID:', error);
    throw error;
  }
};

// Get cakes by category
export const getCakesByCategory = async (category: string): Promise<CakeProduct[]> => {
  try {
    const cakesRef = ref(database, 'cakes');
    const snapshot = await get(cakesRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const cakes = Object.keys(data)
        .filter(key => data[key].category === category)
        .map(key => ({
          id: key,
          ...data[key]
        } as CakeProduct));
      
      return cakes;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting cakes by category:', error);
    throw error;
  }
};

// Add a new cake
export const addCake = async (cakeData: Omit<CakeProduct, 'id'>): Promise<string> => {
  try {
    const cakesRef = ref(database, 'cakes');
    const newCakeRef = push(cakesRef);
    const cakeId = newCakeRef.key as string;
    
    await set(newCakeRef, {
      ...cakeData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    return cakeId;
  } catch (error) {
    console.error('Error adding cake:', error);
    throw error;
  }
};

// Update a cake
export const updateCake = async (id: string, cakeData: Partial<CakeProduct>): Promise<void> => {
  try {
    const cakeRef = ref(database, `cakes/${id}`);
    const updates: any = {
      ...cakeData,
      updatedAt: Date.now()
    };
    
    // Remove id from updates if it exists
    delete updates.id;
    
    await update(cakeRef, updates);
  } catch (error) {
    console.error('Error updating cake:', error);
    throw error;
  }
};

// Update cake featured status
export const updateCakeFeatured = async (id: string, featured: boolean): Promise<void> => {
  try {
    const cakeRef = ref(database, `cakes/${id}`);
    await update(cakeRef, {
      featured: featured,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error updating cake featured status:', error);
    throw error;
  }
};

// Delete a cake
export const deleteCake = async (id: string): Promise<void> => {
  try {
    const cakeRef = ref(database, `cakes/${id}`);
    await remove(cakeRef);
  } catch (error) {
    console.error('Error deleting cake:', error);
    throw error;
  }
};

// Get featured cakes
export const getFeaturedCakes = async (): Promise<CakeProduct[]> => {
  try {
    const cakesRef = ref(database, 'cakes');
    const snapshot = await get(cakesRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const cakes = Object.keys(data)
        .filter(key => data[key].featured === true)
        .map(key => ({
          id: key,
          ...data[key]
        } as CakeProduct));
      
      return cakes;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting featured cakes:', error);
    throw error;
  }
};

// Admin key verification
export const verifyAdminKey = (key: string): boolean => {
  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'your-secure-admin-key';
  return key === ADMIN_KEY;
};

// Real-time listener for cakes (if needed)
export const subscribeToCakes = (
  callback: (cakes: CakeProduct[]) => void,
  onError?: (error: Error) => void
) => {
  const cakesRef = ref(database, 'cakes');
  
  const listener = onValue(cakesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const cakes = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      } as CakeProduct));
      callback(cakes);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Error listening to cakes:', error);
    if (onError) onError(error);
  });
  
  // Return unsubscribe function
  return () => off(cakesRef, 'value', listener);
};
