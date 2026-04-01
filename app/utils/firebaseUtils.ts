// utils/firebaseUtils.js
import { db, storage } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

// Add this function to your existing firebaseUtils.js
export const updateCake = async (cakeId, cakeData) => {
  try {
    const cakeRef = doc(db, 'cakes', cakeId);
    
    // Remove removedImages from the data we send to Firestore
    const { removedImages, ...updateData } = cakeData;
    
    await updateDoc(cakeRef, updateData);
    
    // If there are removed images, delete them from Cloudinary/Storage
    // Note: You'll need to implement Cloudinary deletion logic here
    if (removedImages && removedImages.length > 0) {
      // Delete from Cloudinary (you'll need to implement this)
      // For now, we just log it
      console.log('Images to delete:', removedImages);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating cake:', error);
    return false;
  }
};

export const updateCakeFeatured = async (cakeId, featured) => {
  try {
    const cakeRef = doc(db, 'cakes', cakeId);
    await updateDoc(cakeRef, { featured });
    return true;
  } catch (error) {
    console.error('Error updating featured status:', error);
    return false;
  }
};

// Update your deleteCake function to also delete images from Cloudinary if needed
export const deleteCake = async (cakeId) => {
  try {
    const cakeRef = doc(db, 'cakes', cakeId);
    await deleteDoc(cakeRef);
    return true;
  } catch (error) {
    console.error('Error deleting cake:', error);
    return false;
  }
};

// Make sure getAllCakes is already in your file
export const getAllCakes = async () => {
  try {
    const cakesQuery = query(collection(db, 'cakes'), orderBy('name'));
    const querySnapshot = await getDocs(cakesQuery);
    const cakes = [];
    querySnapshot.forEach((doc) => {
      cakes.push({ id: doc.id, ...doc.data() });
    });
    return cakes;
  } catch (error) {
    console.error('Error fetching cakes:', error);
    return [];
  }
};

// Add this function to upload multiple images (if you don't have it)
export const uploadMultipleImages = async (files) => {
  // Your existing upload logic
  // ...
};

export const verifyAdminKey = (key: string): boolean => {
  // You should store this in environment variables
  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin123  ';
  
  // Simple comparison
  return key === ADMIN_KEY;
  
  // For more security, you might want to use a hash comparison:
  // return hash(key) === storedHash;
};
