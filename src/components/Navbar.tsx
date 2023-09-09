import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './Navbar.scss';

function Home() {
  const { pathname } = useLocation();
  const links = [{
    url: '/',
    text: 'Form Builder',
    active: pathname === '/' || pathname.includes('/forms'),
  }];

  return (
    <div className="d-flex justify-content-center app-navbar">
      <Navbar>
        <Navbar.Brand>
          <Link to="/">
            <img
              src="/logo.svg" // Replace with your logo path
              alt="Logo"
              className="d-inline-block align-top logo"
            />
          </Link>
        </Navbar.Brand>
        <Nav className="me-auto">
          {links.map(link => (
            <Nav.Link key={link.text} as={Link} to={link.url} active={link.active}>
              {link.text}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar>
    </div>
  );
}

export default Home;