'use client';

import { Card, Button } from 'react-bootstrap';
import { BsCart3, BsWhatsapp } from 'react-icons/bs';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';
import { openWhatsAppOrder } from '../utils/whatsappUtils';

interface CakeCardProps {
  cake: {
    id: string;
    name: string;
    price: number;
    size: string;
    images: string[];
    description: string;
    category: string;
  };
}

export default function CakeCard({ cake }: CakeCardProps) {
  const mainImage = cake.images?.[0] || '';

  const handleWhatsAppOrder = () => {
    openWhatsAppOrder({
      name: cake.name,
      price: cake.price,
      size: cake.size,
      description: cake.description,
    });
  };

  return (
    <Card 
      className="border-0 shadow-lg transition-smooth h-100"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '15px',
        overflow: 'hidden'
      }}
    >
      {/* Card Image */}
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <Card.Img 
          variant="top" 
          src={getOptimizedImageUrl(mainImage, 400)} 
          alt={cake.name}
          className="w-100 h-100 object-fit-cover transition-smooth"
          style={{ filter: 'brightness(0.9)' }}
        />
        <div 
          className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            fontSize: '0.8rem',
            fontWeight: '500',
            color: '#fff'
          }}
        >
          ${cake.price}
        </div>
      </div>
      
      <Card.Body className="p-4 d-flex flex-column">
        <div className="mb-3">
          <Card.Title className="fw-bold mb-2 text-white" style={{ fontSize: '1.2rem' }}>
            {cake.name}
          </Card.Title>
          <Card.Text className="mb-3 small text-white" style={{ lineHeight: '1.5' }}>
            {cake.description.length > 80 
              ? `${cake.description.substring(0, 80)}...` 
              : cake.description}
          </Card.Text>
        </div>
        
        <div className="mt-auto">
          {/* Cake Info */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <span className="text-primary me-2">📏</span>
              <span className="small text-white">{cake.size.split('(')[0]}</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="text-primary me-2">🎂</span>
              <span className="small text-white">{cake.category}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <Button 
              variant="primary"
              className="d-flex align-items-center justify-content-center py-2 transition-smooth"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
              onClick={handleWhatsAppOrder}
            >
              <BsWhatsapp className="me-2" />
              Order on WhatsApp
            </Button>
            <Button 
              href={`/cakes/${cake.id}`}
              variant="outline-primary"
              className="d-flex align-items-center justify-content-center py-2 transition-smooth"
              style={{
                borderColor: '#ec4899',
                color: '#ec4899',
                borderRadius: '8px'
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}