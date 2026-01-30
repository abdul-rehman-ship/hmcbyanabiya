import NavigationBar from './components/Navbar';
import Banner from './components/Banner';
import CakeCard from './components/CakeCard';
import { Container, Row, Col } from 'react-bootstrap';
import { getAllCakes } from './utils/firebaseUtils';

export default async function Home() {
  // This will get ALL cakes from Firebase
  const cakes = await getAllCakes();
  
  

  return (
    <>
      <NavigationBar />
      <Banner />
      
      {/* Products Section - Shows ALL cakes */}
      <section className="py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3 text-custom-primary">
              All Our Cakes ({cakes.length})
            </h2>
            <p className="lead mb-4 text-custom-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Browse our complete collection of delicious cakes
            </p>
          </div>
          
          {cakes.length > 0 ? (
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
              {cakes.map((cake) => (
                <Col key={cake.id}>
                  <CakeCard cake={cake} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <div className="glass-effect rounded p-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <p className="text-custom-muted mb-0">No cakes available yet. Add some from the admin panel!</p>
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
    </>
  );
}