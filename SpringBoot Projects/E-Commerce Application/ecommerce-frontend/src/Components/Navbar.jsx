import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../Contexts/Context';
import Product from './Product';

const Navbar = () => {

  const { products, setProducts, refreshProducts } = useContext(AppContext);

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  }

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults,setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState(products); 

  const categories = [
    'Electronics', 'Computers', 'Audio', 'Accessories', 'Wearables',
    'Storage', 'Photography', 'Furniture', 'Gaming', 'Mobile'
  ];

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search?keyword=${value}`
      );
      const productsWithImages = await Promise.all(
          response.data.map(async (product) => {
              try {
                  const imgResponse = await axios.get(
                      `http://localhost:8080/api/product/${product.id}/image`,
                      { responseType: 'blob' }
                  );
                  const imageUrl = imgResponse.data.size
                      ? URL.createObjectURL(imgResponse.data)
                      : 'placeholder-image-url';

                  return { ...product, imageUrl };
              } catch {
                  return { ...product, imageUrl: 'placeholder-image-url' };
              }
          })
      );
      setNoResults(response.data.length === 0);
      setProducts(productsWithImages);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
    } else {
      setShowSearchResults(false);
      setNoResults(false);
      refreshProducts();
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === 'All Products') {
        setProducts(allProducts);  // Show all products
    } else {
        const filteredProducts = allProducts.filter(
            (product) => product.category === category
        );
        setProducts(filteredProducts);
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme])

  useEffect(() => {
    const loadProducts = async () => {
      const fullProducts = await refreshProducts();
      setAllProducts(fullProducts);
    }
    loadProducts();
  }, [refreshProducts])

  return (
    <>
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <nav className='navbar'>
          <div className="nav-links">
            <a href="https://github.com/JitheshKrishnan" className='navbar-brand'>JKShadow</a>
            <a href="/">Home</a>
            <a href="/add_product">Add Product</a>
            {/* <a href="/">Categories</a> */}
            <div>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  outline: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#fff'
                }}
              >
                <option value="All Products">All Products</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='cart-search-bar'>
            <a href='/cart' className='cart-btn'>🛒 Cart</a>
            <input className='search' type="search" placeholder='Search' aria-label='Search' value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  />
            <button onClick={toggleTheme} className='theme-btn'>{theme === "dark-theme" ? "🌙" : "☀️"}</button>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar