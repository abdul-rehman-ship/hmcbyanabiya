// components/admin/ProductList.jsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge, Container, Row, Col } from 'react-bootstrap';
import { BsPencil, BsTrash, BsStar, BsStarFill } from 'react-icons/bs';
import { getAllCakes, deleteCake, updateCakeFeatured } from '../../utils/firebaseUtils';
import EditProductModal from './EditProductModal';
import toast from 'react-hot-toast';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const cakes = await getAllCakes();
      setProducts(cakes);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this cake?')) {
      try {
        const result = await deleteCake(productId);
        if (result) {
          toast.success('Cake deleted successfully');
          loadProducts(); // Refresh the list
        } else {
          toast.error('Failed to delete cake');
        }
      } catch (error) {
        console.error('Error deleting cake:', error);
        toast.error('Error deleting cake');
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleToggleFeatured = async (product) => {
    try {
      const result = await updateCakeFeatured(product.id, !product.featured);
      if (result) {
        toast.success(`Cake ${!product.featured ? 'marked as featured' : 'removed from featured'}`);
        loadProducts(); // Refresh the list
      } else {
        toast.error('Failed to update featured status');
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Error updating featured status');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <Card.Body className="text-center py-5">
          <h5 className="text-white mb-3">No Products Yet</h5>
          <p className="text-gray-400">Start by adding your first cake product.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-white mb-0">Manage Products</h4>
          <Badge bg="primary" className="px-3 py-2">
            Total: {products.length} cakes
          </Badge>
        </div>

        <Row className="g-4">
          {products.map((product) => (
            <Col key={product.id} md={6} lg={4}>
              <Card className="border-0 shadow-lg h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product.images?.[0] || '/placeholder-cake.jpg'}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {product.featured && (
                    <Badge
                      className="position-absolute top-0 end-0 m-3"
                      style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
                    >
                      <BsStarFill className="me-1" size={12} />
                      Featured
                    </Badge>
                  )}
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="text-white mb-0">{product.name}</h5>
                    <Badge bg="info" className="ms-2">
                      {product.category}
                    </Badge>
                  </div>
                  <p className="text-gray-400 small mb-2">{product.size}</p>
                  <p className="text-white mb-3">
                    <strong>Rs. {product.price.toLocaleString()}</strong>
                  </p>
                  <p className="text-gray-400 small mb-3">
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description}
                  </p>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-grow-1"
                      style={{
                        borderColor: '#ec4899',
                        color: '#ec4899'
                      }}
                    >
                      <BsPencil className="me-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="flex-grow-1"
                    >
                      <BsTrash className="me-1" />
                      Delete
                    </Button>
                    <Button
                      variant={product.featured ? "warning" : "outline-warning"}
                      size="sm"
                      onClick={() => handleToggleFeatured(product)}
                      className="flex-grow-1"
                      style={{
                        ...(product.featured && { backgroundColor: '#f59e0b', borderColor: '#f59e0b' })
                      }}
                    >
                      {product.featured ? <BsStarFill /> : <BsStar />}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <EditProductModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onProductUpdated={loadProducts}
        />
      )}
    </>
  );
}
