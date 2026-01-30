'use client';

import { Container, Button } from 'react-bootstrap';
import { BsArrowRight } from 'react-icons/bs';

export default function Banner() {
  return (
    <div 
      className="position-relative overflow-hidden"
      style={{
        height: '70vh',
        marginTop: '76px', // To account for fixed navbar
        background: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2789&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container className="h-100 d-flex align-items-center">
        <div className="animate-fade-in-up">
          <h1 className="display-3 fw-bold mb-4 text-custom-primary">
            Delicious Cakes <br />
            <span className="gradient-text">Made with Love</span>
          </h1>
          <p className="lead fs-4 mb-4 text-custom-secondary" style={{ maxWidth: '500px' }}>
            Freshly baked custom cakes for every special occasion. 
            Order now and taste the difference!
          </p>
          <div className="d-flex gap-3">
            <Button 
              href="/cakes"
              className="shine-effect d-flex align-items-center px-5 py-3"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff'
              }}
            >
              Order Now
              <BsArrowRight className="ms-2" size={20} />
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}