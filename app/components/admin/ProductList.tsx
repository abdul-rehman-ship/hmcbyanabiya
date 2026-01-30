'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { BsEye, BsPencil, BsTrash, BsSearch, BsFilter } from 'react-icons/bs';
import { getAllCakes, deleteCake, CakeProduct } from '../../utils/firebaseUtils';
import { getOptimizedImageUrl } from '../../utils/cloudinaryUtils';
import toast from 'react-hot-toast';

export default function ProductList() {
  const [cakes, setCakes] = useState<CakeProduct[]>([]);
  const [filteredCakes, setFilteredCakes] = useState<CakeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cakeToDelete, setCakeToDelete] = useState<CakeProduct | null>(null);

  useEffect(() => {
    loadCakes();
  }, []);

  useEffect(() => {
    filterCakes();
  }, [cakes, searchTerm]);

  const loadCakes = async () => {
    try {
      const cakesData = await getAllCakes();
      setCakes(cakesData);
      setFilteredCakes(cakesData);
    } catch (error) {
      console.error('Error loading cakes:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterCakes = () => {
    if (!searchTerm.trim()) {
      setFilteredCakes(cakes);
      return;
    }

    const filtered = cakes.filter(cake =>
      cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cake.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cake.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCakes(filtered);
  };

  const handleDelete = async () => {
    if (!cakeToDelete) return;

    try {
      const success = await deleteCake(cakeToDelete.id);
      if (success) {
        toast.success(`"${cakeToDelete.name}" deleted successfully`);
        loadCakes();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Error deleting product');
    } finally {
      setShowDeleteModal(false);
      setCakeToDelete(null);
    }
  };

  const confirmDelete = (cake: CakeProduct) => {
    setCakeToDelete(cake);
    setShowDeleteModal(true);
  };

  return (
    <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
      <Card.Body className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold text-white mb-1">
              All Products
            </h4>
            <p className="text-gray-400 mb-0">
              {cakes.length} total cakes
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-secondary">
              <BsSearch className="text-gray-400" />
            </span>
            <Form.Control
              type="text"
              placeholder="Search cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-gray-400 mt-3">Loading products...</p>
          </div>
        ) : filteredCakes.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0" style={{ color: '#fff' }}>
              <thead>
                <tr style={{ borderColor: '#475569' }}>
                  <th style={{ borderColor: '#475569' }}>Product</th>
                  <th style={{ borderColor: '#475569' }}>Category</th>
                  <th style={{ borderColor: '#475569' }}>Price</th>
                  <th style={{ borderColor: '#475569' }}>Size</th>
                  <th style={{ borderColor: '#475569' }}>Status</th>
                  <th style={{ borderColor: '#475569' }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCakes.map((cake) => (
                  <tr key={cake.id} style={{ borderColor: '#475569' }}>
                    <td style={{ borderColor: '#475569' }}>
                      <div className="d-flex align-items-center">
                        <img
                          src={getOptimizedImageUrl(cake.images[0], 100)}
                          alt={cake.name}
                          className="rounded me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-medium text-white">{cake.name}</div>
                          <div className="text-gray-400 small" style={{ fontSize: '0.85rem' }}>
                            {cake.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ borderColor: '#475569' }}>
                      <Badge bg="secondary" className="px-3 py-2">
                        {cake.category}
                      </Badge>
                    </td>
                    <td style={{ borderColor: '#475569' }}>
                      <div className="fw-bold text-primary">${cake.price}</div>
                    </td>
                    <td style={{ borderColor: '#475569' }}>
                      <span className="text-gray-300">{cake.size.split('(')[0]}</span>
                    </td>
                    <td style={{ borderColor: '#475569' }}>
                      {cake.featured ? (
                        <Badge bg="success" className="px-3 py-2">
                          Featured
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="px-3 py-2">
                          Regular
                        </Badge>
                      )}
                    </td>
                    <td style={{ borderColor: '#475569' }} className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          href={`/cakes/${cake.id}`}
                          target="_blank"
                          className="d-flex align-items-center"
                        >
                          <BsEye className="me-1" />
                          View
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => toast('Edit feature coming soon!')}
                          className="d-flex align-items-center"
                        >
                          <BsPencil className="me-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => confirmDelete(cake)}
                          className="d-flex align-items-center"
                        >
                          <BsTrash className="me-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="p-5 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <BsSearch size={48} className="text-gray-500 mb-3" />
              <p className="text-gray-400 mb-0">
                {searchTerm ? 'No cakes found matching your search' : 'No cakes available yet'}
              </p>
            </div>
          </div>
        )}
      </Card.Body>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0" style={{ backgroundColor: 'var(--card-bg)' }}>
          <Modal.Title className="text-white">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--card-bg)' }}>
          <p className="text-gray-300">
            Are you sure you want to delete "{cakeToDelete?.name}"? This action cannot be undone.
          </p>
          {cakeToDelete && (
            <div className="d-flex align-items-center mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <img
                src={getOptimizedImageUrl(cakeToDelete.images[0], 100)}
                alt={cakeToDelete.name}
                className="rounded me-3"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <div>
                <div className="text-white">{cakeToDelete.name}</div>
                <div className="text-gray-400 small">${cakeToDelete.price} • {cakeToDelete.category}</div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0" style={{ backgroundColor: 'var(--card-bg)' }}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}