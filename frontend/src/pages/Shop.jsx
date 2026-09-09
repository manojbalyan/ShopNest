import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search parameters from URL (e.g. /shop?search=phone)
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';

  // Local state for search, category filter, and sorting
  const [search, setSearch] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Keep local search input synced if URL search param changes
  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Extract unique categories from loaded products
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter products by search keyword and category
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'All' ||
        (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.ratings || 0) - (a.ratings || 0);
      return 0; // Default: 'featured'
    });

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h2>Explore Products</h2>
        <p className="shop-subtitle">Find the best deals across top quality items</p>
      </div>

      {/* Search Input Bar */}
      <div className="shop-search-wrapper">
        <input
          type="text"
          placeholder="Search products by title or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        {search && (
          <button onClick={() => setSearch('')} className="clear-search-btn" title="Clear search">
            ✕
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="category-pills-container">
        <span className="pills-label">Categories:</span>
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting & Results Bar */}
      <div className="shop-toolbar">
        <span className="results-count">
          Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
          {selectedCategory !== 'All' && <span> in <em>{selectedCategory}</em></span>}
        </span>

        <div className="sort-container">
          <label htmlFor="shop-sort">Sort By:</label>
          <select
            id="shop-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#f97316' }}>Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-products-box">
          <p style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#fff' }}>No products found</p>
          <p style={{ color: '#a1a1aa', marginBottom: '20px' }}>Try adjusting your search terms or category filters.</p>
          <button onClick={handleClearFilters} className="btn">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
