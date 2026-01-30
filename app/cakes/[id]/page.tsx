'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavigationBar from '../../components/Navbar';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { BsWhatsapp, BsChevronLeft } from 'react-icons/bs';
import { getCakeById, CakeProduct } from '../../utils/firebaseUtils';
import { getOptimizedImageUrl } from '../../utils/cloudinaryUtils';
import { openWhatsAppOrder } from '../../utils/whatsappUtils';
import Link from 'next/link';

export default function CakeDetailPage() {
  const params = useParams();
  const cakeId = params.id as string;
  
  const [cake, setCake] = useState<CakeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadCake();
  }, [cakeId]);

  const loadCake = async () => {
    try {
      const cakeData = await getCakeById(cakeId);
      setCake(cakeData);
    } catch (error) {
      console.error('Error loading cake:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (cake && cake.images) {
      setCurrentImageIndex((prev) => (prev + 1) % cake.images.length);
    }
  };

  const prevImage = () => {
    if (cake && cake.images) {
      setCurrentImageIndex((prev) => (prev - 1 + cake.images.length) % cake.images.length);
    }
  };

  const handleOrderClick = () => {
    if (cake) {
      openWhatsAppOrder({
        name: cake.name,
        price: cake.price,
        size: cake.size,
        description: cake.description,
      });
    }
  };

  if (loading) {
    return (
      <>
        <NavigationBar />
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-custom-muted mt-4">Loading cake details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!cake) {
    return (
      <>
        <NavigationBar />
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="h2 fw-bold mb-4 text-custom-primary">Cake not found</h2>
            <Link href="/cakes" className="text-primary hover:underline">
              Back to cakes
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      
      <div className="pt-24 pb-12 bg-dark">
        <Container className="py-5">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/cakes" className="text-custom-secondary hover:text-primary d-flex align-items-center">
              <BsChevronLeft className="me-2" />
              Back to Cakes
            </Link>
          </div>

          <Row className="g-5">
            {/* Image Gallery */}
            <Col lg={6}>
              <div className="position-relative rounded-3 overflow-hidden mb-4">
                <img
                  src={getOptimizedImageUrl(cake.images[currentImageIndex], 800)}
                  alt={cake.name}
                  className="w-100 rounded-3"
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                
                {/* Navigation Arrows */}
                {cake.images.length > 1 && (
                  <>
                    <Button
                      variant="light"
                      onClick={prevImage}
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle"
                      style={{ opacity: 0.8 }}
                    >
                      ←
                    </Button>
                    <Button
                      variant="light"
                      onClick={nextImage}
                      className="position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle"
                      style={{ opacity: 0.8 }}
                    >
                      →
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {cake.images.length > 1 && (
                <div className="row g-2">
                  {cake.images.map((image, index) => (
                    <div key={index} className="col-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-100 p-0 border-2 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                        style={{ borderRadius: '8px', overflow: 'hidden' }}
                      >
                        <img
                          src={getOptimizedImageUrl(image, 200)}
                          alt={`${cake.name} ${index + 1}`}
                          className="w-100"
                          style={{ height: '80px', objectFit: 'cover' }}
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Col>

            {/* Product Details */}
            <Col lg={6}>
              <div className="mb-6">
                <div className="d-inline-block px-3 py-1 rounded-pill mb-3"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                  <span className="small text-white">{cake.category}</span>
                </div>
                <h1 className="h1 fw-bold mb-3 text-custom-primary">{cake.name}</h1>
                <div className="d-flex align-items-center gap-4 mb-4">
                  <span className="h2 fw-bold text-primary">${cake.price}</span>
                  <span className="px-3 py-1 rounded-pill text-custom-light"
                    style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}>
                    {cake.size.split('(')[0]}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="h4 fw-semibold mb-3 text-custom-primary">Description</h3>
                <p className="text-custom-secondary" style={{ lineHeight: '1.8' }}>{cake.description}</p>
              </div>

              <div className="mb-6 p-4 rounded-3" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h3 className="h4 fw-semibold mb-4 text-custom-primary">Order Information</h3>
                <ul className="list-unstyled text-custom-secondary">
                  <li className="d-flex align-items-center mb-3">
                    <span className="w-2 h-2 bg-primary rounded-circle me-3"></span>
                    <span>Custom designs available upon request</span>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <span className="w-2 h-2 bg-primary rounded-circle me-3"></span>
                    <span>Delivery available in selected areas</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <span className="w-2 h-2 bg-primary rounded-circle me-3"></span>
                    <span>24-48 hours advance order required</span>
                  </li>
                </ul>
              </div>

              {/* Order Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button
                  variant="primary"
                  className="flex-1 py-3 shine-effect"
                  onClick={handleOrderClick}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    border: 'none',
                    borderRadius: '10px'
                  }}
                >
                  <BsWhatsapp className="me-2" />
                  Order on WhatsApp
                </Button>
                
                {/* <Button
                  variant="outline-primary"
                  className="flex-1 py-3"
                  onClick={handleOrderClick}
                  style={{
                    borderColor: '#ec4899',
                    color: '#ec4899',
                    borderRadius: '10px'
                  }}
                >
                  Order Now
                </Button> */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="py-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
        <Container>
          <div className="text-center text-custom-muted small">
            <p className="mb-0">© {new Date().getFullYear()} Sweet Cakes. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </>
  );
}