

import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy
} from 'firebase/firestore';

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
  createdAt?: Date;
  updatedAt?: Date;
}

// Get all cakes
export const getAllCakes = async (): Promise<CakeProduct[]> => {
  try {
    const cakesCollection = collection(db, 'cakes');
    const q = query(cakesCollection, orderBy('createdAt', 'desc'));
    const cakeSnapshot = await getDocs(q);
    
    return cakeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CakeProduct));
  } catch (error) {
    console.error('Error getting all cakes:', error);
    throw error;
  }
};

// Get a single cake by ID
export const getCakeById = async (id: string): Promise<CakeProduct | null> => {
  try {
    const cakeDoc = await getDoc(doc(db, 'cakes', id));
    
    if (cakeDoc.exists()) {
      return {
        id: cakeDoc.id,
        ...cakeDoc.data()
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
    const cakesCollection = collection(db, 'cakes');
    const q = query(cakesCollection, where('category', '==', category));
    const cakeSnapshot = await getDocs(q);
    
    return cakeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CakeProduct));
  } catch (error) {
    console.error('Error getting cakes by category:', error);
    throw error;
  }
};

// Add a new cake
export const addCake = async (cakeData: Omit<CakeProduct, 'id'>): Promise<string> => {
  try {
    const cakesCollection = collection(db, 'cakes');
    const docRef = await addDoc(cakesCollection, {
      ...cakeData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding cake:', error);
    throw error;
  }
};

// Update a cake
export const updateCake = async (id: string, cakeData: Partial<CakeProduct>): Promise<void> => {
  try {
    const cakeDoc = doc(db, 'cakes', id);
    await updateDoc(cakeDoc, {
      ...cakeData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating cake:', error);
    throw error;
  }
};

// Update cake featured status
export const updateCakeFeatured = async (id: string, featured: boolean): Promise<void> => {
  try {
    const cakeDoc = doc(db, 'cakes', id);
    await updateDoc(cakeDoc, {
      featured: featured,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating cake featured status:', error);
    throw error;
  }
};

// Delete a cake
export const deleteCake = async (id: string): Promise<void> => {
  try {
    const cakeDoc = doc(db, 'cakes', id);
    await deleteDoc(cakeDoc);
  } catch (error) {
    console.error('Error deleting cake:', error);
    throw error;
  }
};

// Get featured cakes
export const getFeaturedCakes = async (): Promise<CakeProduct[]> => {
  try {
    const cakesCollection = collection(db, 'cakes');
    const q = query(cakesCollection, where('featured', '==', true));
    const cakeSnapshot = await getDocs(q);
    
    return cakeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CakeProduct));
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
