'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsBoxSeam, BsPlusCircle, BsArrowRight, BsLock } from 'react-icons/bs';
import AdminLogin from '../components/AdminLogin';
import ProductUploadForm from '../components/admin/ProductUploadForm';
import ProductList from '../components/admin/ProductList';
import { getAllCakes } from '../utils/firebaseUtils';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const cakes = await getAllCakes();
      setStats({
        totalProducts: cakes.length,
        featuredProducts: cakes.filter(cake => cake.featured).length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success('Welcome to Admin Dashboard!');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    toast.success('Logged out successfully');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Admin Header */}
      <div className="glass-effect border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center py-4">
            <div>
              <h1 className="h3 fw-bold mb-1 text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mb-0">
                Manage your cake products and orders
              </p>
            </div>
            <Button 
              variant="outline-danger"
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <BsLock className="me-2" />
              Logout
            </Button>
          </div>
        </Container>
      </div>

      {/* Admin Navigation */}
      <div className="py-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <Container>
          <div className="d-flex gap-2">
            <Button
              variant={activeTab === 'dashboard' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('dashboard')}
              className="d-flex align-items-center"
              style={{
                borderRadius: '8px',
                ...(activeTab !== 'dashboard' && {
                  borderColor: '#ec4899',
                  color: '#ec4899'
                })
              }}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'add' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('add')}
              className="d-flex align-items-center"
              style={{
                borderRadius: '8px',
                ...(activeTab !== 'add' && {
                  borderColor: '#ec4899',
                  color: '#ec4899'
                })
              }}
            >
              <BsPlusCircle className="me-2" />
              Add Product
            </Button>
            <Button
              variant={activeTab === 'manage' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('manage')}
              className="d-flex align-items-center"
              style={{
                borderRadius: '8px',
                ...(activeTab !== 'manage' && {
                  borderColor: '#ec4899',
                  color: '#ec4899'
                })
              }}
            >
              <BsBoxSeam className="me-2" />
              Manage Products
            </Button>
          </div>
        </Container>
      </div>

      {/* Content Area */}
      <Container className="py-5">
        {activeTab === 'dashboard' ? (
          <Row className="g-4">
            {/* Stats Cards */}
            <Col md={6}>
              <Card className="border-0 shadow-lg h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                      <BsBoxSeam size={24} className="text-white" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-white mb-0">Total Products</h6>
                      <h3 className="fw-bold text-white mb-0">{stats.totalProducts}</h3>
                    </div>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setActiveTab('manage')}
                    className="w-100 d-flex align-items-center justify-content-center mt-3"
                  >
                    View All Products
                    <BsArrowRight className="ms-2" />
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 shadow-lg h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
                      <BsBoxSeam size={24} className="text-white" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-white mb-0">Featured Products</h6>
                      <h3 className="fw-bold text-white mb-0">{stats.featuredProducts}</h3>
                    </div>
                  </div>
                  <Button 
                    variant="primary"
                    onClick={() => setActiveTab('add')}
                    className="w-100 d-flex align-items-center justify-content-center mt-3"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      border: 'none'
                    }}
                  >
                    <BsPlusCircle className="me-2" />
                    Add New Product
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Quick Actions */}
            <Col md={12}>
              <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
                <Card.Body className="p-4">
                  <h5 className="fw-bold text-white mb-4">Quick Actions</h5>
                  <Row className="g-3">
                    <Col md={4}>
                      <Button 
                        variant="outline-primary"
                        onClick={() => setActiveTab('add')}
                        className="w-100 py-3 d-flex flex-column align-items-center"
                        style={{
                          borderColor: '#ec4899',
                          color: '#ec4899',
                          borderRadius: '10px'
                        }}
                      >
                        <BsPlusCircle size={24} className="mb-2" />
                        Add Cake
                      </Button>
                    </Col>
                    <Col md={4}>
                      <Button 
                        variant="outline-primary"
                        onClick={() => setActiveTab('manage')}
                        className="w-100 py-3 d-flex flex-column align-items-center"
                        style={{
                          borderColor: '#ec4899',
                          color: '#ec4899',
                          borderRadius: '10px'
                        }}
                      >
                        <BsBoxSeam size={24} className="mb-2" />
                        Manage Cakes
                      </Button>
                    </Col>
                    {/* <Col md={4}>
                      <Button 
                        variant="outline-primary"
                        href="/"
                        target="_blank"
                        className="w-100 py-3 d-flex flex-column align-items-center"
                        style={{
                          borderColor: '#ec4899',
                          color: '#ec4899',
                          borderRadius: '10px'
                        }}
                      >
                        <BsArrowRight size={24} className="mb-2" />
                        View Store
                      </Button>
                    </Col> */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : activeTab === 'add' ? (
          <ProductUploadForm />
        ) : (
          <ProductList />
        )}
      </Container>

      {/* Footer */}
      <div className="py-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
        <Container>
          <div className="text-center text-gray-500 small">
            <p className="mb-0">© {new Date().getFullYear()} Sweet Cakes Admin Panel</p>
          </div>
        </Container>
      </div>
    </div>
  );
}