import { Link } from 'react-router-dom'; // Importa el componente Link

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Index = () => {
  return (
    <Navbar variant="dark" bg="dark" expand="lg">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <Nav>
            <NavDropdown
              id="nav-dropdown-dark-example"
              title="Dropdown"
              menuVariant="dark"
            >
              <NavDropdown.Item as={Link} to="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Otros elementos NavDropdown también pueden ser reemplazados por Link */}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Index;
