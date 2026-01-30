'use client';

import { useState, useRef } from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { BsUpload, BsX, BsImage, BsArrowRight } from 'react-icons/bs';
import { uploadMultipleImages } from '../../utils/cloudinaryUtils';
import { addCake } from '../../utils/firebaseUtils';
import toast from 'react-hot-toast';

const categories = ['Birthday', 'Wedding', 'Anniversary', 'Custom', 'Special', 'Cupcakes'];
const sizes = ['Small (Serves 10-15)', 'Medium (Serves 20-25)', 'Large (Serves 30-40)', 'X-Large (Serves 50+)'];

export default function ProductUploadForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    size: sizes[0],
    description: '',
    category: categories[0],
    featured: false,
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);
    
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter cake name');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setUploading(true);
    
    try {
      // Upload images to Cloudinary
      toast.loading('Uploading images...');
      const imageUrls = await uploadMultipleImages(images);
      
      // Prepare cake data
      const cakeData = {
        name: formData.name,
        price: parseFloat(formData.price),
        size: formData.size,
        description: formData.description,
        images: imageUrls,
        category: formData.category,
        featured: formData.featured,
      };

      // Save to Firebase
      toast.loading('Saving cake details...');
      const result = await addCake(cakeData);
      
      if (result) {
        toast.dismiss();
        toast.success('🎉 Cake added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          size: sizes[0],
          description: '',
          category: categories[0],
          featured: false,
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        toast.dismiss();
        toast.error('Failed to add cake');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Error adding cake');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
      <Card.Body className="p-5">
        <div className="text-center mb-5">
          <h3 className="fw-bold text-white mb-2">
            Add New Cake
          </h3>
          <p className="text-white">
            Fill in the details to add a new cake to your store
          </p>
        </div>

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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                  Price ($) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  className="py-3 border-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    borderRadius: '10px'
                  }}
                >
                  {sizes.map((size) => (
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
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="py-3 border-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    borderRadius: '10px'
                  }}
                >
                  {categories.map((category) => (
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
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
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
            
            <div 
              className="border-dashed rounded-lg p-5 text-center cursor-pointer"
              style={{
                border: '2px dashed #475569',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="d-none"
              />
              <BsImage className="mb-3" size={40} style={{ color: '#64748b' }} />
              <p className="text-white mb-1">Click to upload images</p>
              <p className="text-gray-500 small">PNG, JPG, WEBP up to 5MB each</p>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="text-white mb-0">
                    Selected Images ({images.length})
                  </p>
                  <Badge bg="primary" className="px-3 py-2">
                    {images.length} files
                  </Badge>
                </div>
                <div className="row g-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="col-3">
                      <div className="position-relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-100 h-100 object-cover rounded-lg"
                          style={{ height: '100px' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeImage(index)}
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
          <div className="d-grid">
            <Button
              type="submit"
              disabled={uploading}
              className="py-3 shine-effect"
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
                  Adding Cake...
                </span>
              ) : (
                <span className="d-flex align-items-center justify-content-center">
                  <BsUpload className="me-2" />
                  Add Cake to Store
                  <BsArrowRight className="ms-2" />
                </span>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}