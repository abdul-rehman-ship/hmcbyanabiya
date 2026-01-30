'use client';

import { useState, useEffect } from 'react';
import NavigationBar from '../components/Navbar';
import CakeCard from '../components/CakeCard';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { getAllCakes, CakeProduct } from '../utils/firebaseUtils';

export default function CakesPage() {
  const [cakes, setCakes] = useState<CakeProduct[]>([]);
  const [filteredCakes, setFilteredCakes] = useState<CakeProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-dark">
      <NavigationBar />
      
      {/* Hero Section */}
      <div 
        className="pt-5"
        style={{
          paddingTop: '80px',
          background: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=2787&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container className="py-5 text-center">
          <h1 className="display-4 fw-bold mb-3 text-custom-primary">
            All Cakes Collection
          </h1>
          <p className="lead mb-4 text-custom-secondary">
            Discover our complete range of delicious cakes
          </p>
        </Container>
      </div>

      {/* Search Section */}
      <div className="py-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)' }}>
        <Container>
          <div className="d-flex justify-content-center">
            <div style={{ maxWidth: '500px', width: '100%' }}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search cakes by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 text-white"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px 0 0 8px'
                  }}
                />
                <Button 
                  variant="primary"
                  className="d-flex align-items-center"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    border: 'none',
                    borderRadius: '0 8px 8px 0',
                    color: '#fff'
                  }}
                >
                  <BsSearch />
                </Button>
              </InputGroup>
            </div>
          </div>
        </Container>
      </div>

      {/* Cakes Grid */}
      <section className="py-5">
        <Container className="py-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-custom-muted mt-3">Loading cakes...</p>
            </div>
          ) : filteredCakes.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-custom-muted">
                  Showing {filteredCakes.length} of {cakes.length} cakes
                </p>
              </div>
              <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                {filteredCakes.map((cake) => (
                  <Col key={cake.id}>
                    <CakeCard cake={cake} />
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="glass-effect rounded p-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <p className="text-custom-muted mb-0">
                  {searchTerm ? 'No cakes found matching your search' : 'No cakes available yet'}
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
        <Container>
          <div className="text-center text-custom-muted small">
            <p className="mb-0">© {new Date().getFullYear()} Sweet Cakes. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}