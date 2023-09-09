import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import FormTesterPage from './pages/FormTesterPage';
import FormsListPage from './pages/FormsListPage';
import FormPage from './pages/FormPage';
import './App.scss';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Navbar />

        <div className="mb-4">
          <Routes>
            <Route path="/" element={<FormsListPage />} />
            <Route path="/forms" element={<FormsListPage />} />
            <Route path="/forms/edit/:id" element={<FormPage />} />
            <Route path="/forms/test/:id" element={<FormTesterPage />} />
          </Routes>
        </div>
      </Container>
    </BrowserRouter>
  );
}

export default App;
