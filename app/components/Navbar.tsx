'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { BsCake2 } from 'react-icons/bs';

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`py-3 transition-smooth ${scrolled ? 'glass-effect shadow' : 'bg-transparent'}`}
      variant="dark"
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <BsCake2 className="me-2" style={{ color: '#ec4899', fontSize: '28px' }} />
          <span className="fw-bold fs-4 gradient-text">
            HMC by Anabiya
          </span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navigation Links - Simplified */}
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            <Nav.Link 
              href="/" 
              className={`mx-3 fw-medium ${pathname === '/' ? 'text-primary' : 'text-custom-light'}`}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              href="/cakes" 
              className={`mx-3 fw-medium ${pathname === '/cakes' ? 'text-primary' : 'text-custom-light'}`}
            >
              All Cakes
            </Nav.Link>
            
            {/* Admin Button */}
            <Button 
              variant="outline-primary" 
              href="/admin"
              className="ms-3 d-flex align-items-center px-4"
              style={{
                borderColor: '#ec4899',
                color: '#ec4899'
              }}
            >
              Admin
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}