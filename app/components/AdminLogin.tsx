'use client';

import { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { BsLock, BsArrowRight } from 'react-icons/bs';
import { verifyAdminKey } from '../utils/firebaseUtils';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = verifyAdminKey(key);
      if (isValid) {
        localStorage.setItem('adminLoggedIn', 'true');
        onLogin();
      } else {
        toast.error('Invalid admin key. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=2865&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
              <Card.Body className="p-5">
                {/* Logo and Header */}
                <div className="text-center mb-5">
                  <div className="mb-4">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center p-4"
                      style={{
                        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                      }}
                    >
                      <BsLock size={32} className="text-white" />
                    </div>
                  </div>
                  <h2 className="fw-bold text-white mb-2">
                    Admin Login
                  </h2>
                  <p className="text-white">
                    Enter admin key to access dashboard
                  </p>
                </div>

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white mb-2">
                      Admin Key
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter your admin key"
                      className="py-3 border-0"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#fff',
                        borderRadius: '10px'
                      }}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100 py-3 shine-effect"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      border: 'none',
                      borderRadius: '10px'
                    }}
                  >
                    {loading ? (
                      <span className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Authenticating...
                      </span>
                    ) : (
                      <span className="d-flex align-items-center justify-content-center">
                        Login to Dashboard
                        <BsArrowRight className="ms-2" />
                      </span>
                    )}
                  </Button>
                </Form>

                {/* Info */}
                <div className="mt-4 text-center">
                  <p className="text-gray-500 small mb-0">
                    Contact system administrator if you've forgotten your key
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}