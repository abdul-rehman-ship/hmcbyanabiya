// components/admin/EditProductModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Button, Badge } from 'react-bootstrap';
import { BsUpload, BsX, BsImage } from 'react-icons/bs';
import { uploadMultipleImages } from '../../utils/cloudinaryUtils';
import { updateCake } from '../../utils/firebaseUtils';
import toast from 'react-hot-toast';

const categories: string[] = ['Birthday', 'Wedding', 'Anniversary', 'Custom', 'Special', 'Cupcakes'];
const sizes: string[] = ['Small (Half pound - 1 pound, Serves 2-3 )', 'Standard (1 pound - 2 pound, Serves 3-5)', 'Medium (2 pound - 4 pound, Serves 5-8)', 'Large (Above 4 pound, Serves 10-14)'];

interface EditProductModalProps {
  show: boolean;
  onHide: () => void;
  product: any;
  onProductUpdated: () => void;
}

interface FormData {
  name: string;
  price: string;
  size: string;
  description: string;
  category: string;
  featured: boolean;
}

export default function EditProductModal({ show, onHide, product, onProductUpdated }: EditProductModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    size: sizes[0],
    description: '',
    category: categories[0],
    featured: false,
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        size: product.size || sizes[0],
        description: product.description || '',
        category: product.category || categories[0],
        featured: product.featured || false,
      });
      setExistingImages(product.images || []);
      setNewImages([]);
      setNewImagePreviews([]);
      setRemovedImages([]);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImagesList = [...newImages, ...files];
    setNewImages(newImagesList);
    
    const newPreviews = newImagesList.map(file => URL.createObjectURL(file));
    setNewImagePreviews(newPreviews);
  };

  const removeExistingImage = (index: number) => {
    const removed = existingImages[index];
    setRemovedImages([...removedImages, removed]);
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
  };

  const removeNewImage = (index: number) => {
    const newImagesList = newImages.filter((_, i) => i !== index);
    const newPreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImages(newImagesList);
    setNewImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter cake name');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setUploading(true);
    
    try {
      let updatedImageUrls: string[] = [...existingImages];
      
      // Upload new images if any
      if (newImages.length > 0) {
        toast.loading('Uploading new images...');
        const newImageUrls = await uploadMultipleImages(newImages);
        updatedImageUrls = [...updatedImageUrls, ...newImageUrls];
      }

      // Prepare cake data
      const cakeData: any = {
        name: formData.name,
        price: parseFloat(formData.price),
        size: formData.size,
        description: formData.description,
        images: updatedImageUrls,
        category: formData.category,
        featured: formData.featured,
        removedImages: removedImages // Pass removed images for cleanup
      };

      // Update in Firebase
      toast.loading('Updating cake details...');
      const result = await updateCake(product.id, cakeData);
      
      if (result) {
        toast.dismiss();
        toast.success('🎉 Cake updated successfully!');
        onProductUpdated();
        onHide();
      } else {
        toast.dismiss();
        toast.error('Failed to update cake');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Error updating cake');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <Modal.Title className="text-white">Edit Cake</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'var(--card-bg)' }}>
        <Form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-6">
              <Form.Group className="mb-4">
                <Form.Label className="text-white mb-2">
                  Cake Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Chocolate Delight Cake"
                  className="py-3 text-white border-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    borderRadius: '10px'
                  }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-white mb-2">
                  Price (pkr) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g., 29.99"
                  className="py-3 border-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    borderRadius: '10px'
                  }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-white mb-2">
                  Size <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.size}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, size: e.target.value})}
                  className="py-3 border-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    borderRadius: '10px'
                  }}
                >
                  {sizes.map((size: string) => (
                    <option key={size} value={size} style={{ backgroundColor: '#1e293b' }}>
                      {size}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            {/* Right Column */}
            <div className="col-lg-6">
              <Form.Group className="mb-4">
                <Form.Label className="text-white mb-2">
                  Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, category: e.target.value})}
                  className="py-3 border-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    borderRadius: '10px'
                  }}
                >
                  {categories.map((category: string) => (
                    <option key={category} value={category} style={{ backgroundColor: '#1e293b' }}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-white mb-2">
                  Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your cake..."
                  className="py-3 text-white border-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    borderRadius: '10px'
                  }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="featured-check"
                  label="Mark as Featured Product"
                  checked={formData.featured}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, featured: e.target.checked})}
                  className="text-white"
                />
              </Form.Group>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-5">
            <Form.Label className="text-white mb-2">
              Cake Images <span className="text-danger">*</span>
            </Form.Label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-white mb-3">Current Images</p>
                <div className="row g-2">
                  {existingImages.map((image: string, index: number) => (
                    <div key={index} className="col-3">
                      <div className="position-relative">
                        <img
                          src={image}
                          alt={`Existing ${index + 1}`}
                          className="w-100 h-100 object-cover rounded-lg"
                          style={{ height: '100px', objectFit: 'cover' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeExistingImage(index)}
                          className="position-absolute top-0 end-0 translate-middle rounded-circle p-1"
                          style={{ width: '28px', height: '28px' }}
                        >
                          <BsX size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div 
              className="border-dashed rounded-lg p-5 text-center cursor-pointer"
              style={{
                border: '2px dashed #475569',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}
              onClick={() => document.getElementById('edit-image-input')?.click()}
            >
              <input
                type="file"
                id="edit-image-input"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="d-none"
              />
              <BsImage className="mb-3" size={40} style={{ color: '#64748b' }} />
              <p className="text-white mb-1">Click to add more images</p>
              <p className="text-gray-500 small">PNG, JPG, WEBP up to 5MB each</p>
            </div>

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-white mb-3">New Images ({newImages.length})</p>
                <div className="row g-2">
                  {newImagePreviews.map((preview: string, index: number) => (
                    <div key={index} className="col-3">
                      <div className="position-relative">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-100 h-100 object-cover rounded-lg"
                          style={{ height: '100px', objectFit: 'cover' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeNewImage(index)}
                          className="position-absolute top-0 end-0 translate-middle rounded-circle p-1"
                          style={{ width: '28px', height: '28px' }}
                        >
                          <BsX size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="d-grid gap-2">
            <Button
              type="submit"
              disabled={uploading}
              className="py-3"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                border: 'none',
                borderRadius: '10px'
              }}
            >
              {uploading ? (
                <span className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Updating Cake...
                </span>
              ) : (
                <span className="d-flex align-items-center justify-content-center">
                  <BsUpload className="me-2" />
                  Update Cake
                </span>
              )}
            </Button>
            <Button variant="outline-secondary" onClick={onHide} className="py-2">
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
