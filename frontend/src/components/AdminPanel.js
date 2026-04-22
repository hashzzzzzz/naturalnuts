import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { apiUrl } from '../api';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(apiUrl('/api/products'));
        setProducts(res.data);
        setError('');
      } catch {
        setError('Nuk mund te ngarkohen produktet.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`A je i sigurt qe don me fshi "${product.name}"?`);
    if (!confirmed) return;

    setDeletingId(product._id);
    try {
      await axios.delete(apiUrl(`/api/products/${product._id}`));
      setProducts((prev) => prev.filter((item) => item._id !== product._id));
    } catch {
      alert('Produkti nuk u fshi. Provo perseri.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <main className="admin-panel-page">
      <section className="admin-panel-header">
        <div>
          <h1>Produktet</h1>
          <p>Menaxho produktet sipas emrit, fotos dhe cmimit.</p>
        </div>
        <button
          type="button"
          className="admin-add-button"
          onClick={() => navigate('/admin/add-product')}
        >
          <FaPlus />
          Add New Product
        </button>
      </section>

      <section className="admin-products-panel">
        {loading ? (
          <p className="admin-state-message">Duke u ngarkuar...</p>
        ) : error ? (
          <p className="admin-state-message admin-error-message">{error}</p>
        ) : sortedProducts.length === 0 ? (
          <p className="admin-state-message">Nuk ka produkte ende.</p>
        ) : (
          <div className="admin-products-table">
            <div className="admin-table-head">
              <span>Foto</span>
              <span>Emri</span>
              <span>Cmimi</span>
              <span>Veprime</span>
            </div>

            {sortedProducts.map((product) => (
              <article className="admin-product-row" key={product._id}>
                <div className="admin-product-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                <div className="admin-product-name">
                  <strong>{product.name}</strong>
                  <small>ID: {product._id}</small>
                </div>

                <div className="admin-product-price">
                  EUR {Number(product.price || 0).toFixed(2)}
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    className="admin-icon-button admin-edit-button"
                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                    aria-label={`Update ${product.name}`}
                    title="Update"
                  >
                    <FaPen />
                  </button>
                  <button
                    type="button"
                    className="admin-icon-button admin-delete-button"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product._id}
                    aria-label={`Delete ${product.name}`}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
