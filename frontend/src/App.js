import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './components/Navbar';
import Main from './components/Main';
import ProductList from './components/ProductList';
import PurchaseGuide from './components/PurchaseGuide';
import Footer from './components/Footer';
import ContactUs from './components/ContactUs';
import Ribon from './components/Ribon';

import AdminPanel from './components/AdminPanel';
import AddProductForm from './components/AddProductForm';
import EditProduct from './components/EditProduct';
import DeleteProduct from './components/DeleteProduct';
import Login from './components/Login';  // <-- New Login component (create it)
import EditProductIDInput from './components/EditProductId';

// Add this to make the backend URL dynamic
const API_BASE_URL = 'https://naturalnuts.onrender.com'; // live backend

function ProtectedRoute({ loggedIn, children }) {
  if (!loggedIn) {
    return <Navigate to="/adminlogin" replace />;
  }
  return children;
}

// ✅ HomePage now accepts searchQuery from props
function HomePage({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  axios.get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  // ✅ Filter products here based on searchQuery
const filteredProducts = searchQuery
  ? products.filter(p =>
      p.name.toLowerCase().split(' ')[0].startsWith(searchQuery.toLowerCase().trim())
    )
  : products; 

  return (
    <>
      <Main />
      <div id="product-list" className="scroll-target">
        {/* ✅ pass filtered products to ProductList */}
        <ProductList products={filteredProducts} />
        <Ribon />
      </div>
      <div id="purchase-guide" className="scroll-target">
        <PurchaseGuide />
      </div>
      <Footer />
    </>
  );
}

function ContactPage() {
  return (
    <>
      <ContactUs />
      <Footer />
    </>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // ✅ add search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('loggedIn');
    if (stored === 'true') setLoggedIn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn ? 'true' : 'false');
  }, [loggedIn]);

  return (
    <div className="app-container">
      <Router>
        {/* ✅ Pass onSearch to Navbar */}
        <Navbar
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          onSearch={setSearchQuery}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/contactus" element={<ContactPage />} />
          <Route path="/adminlogin" element={<Login setLoggedIn={setLoggedIn} />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <AddProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-product"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <EditProductIDInput />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-product/:id"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/delete-product"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <DeleteProduct />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
