import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../Contexts/Context';

const Navbar = () => {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults,setShowSearchResults] = useState(false)

  const { data } = useContext(AppContext);
  
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  }

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
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme])



  return (
    <>
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <nav className='navbar'>
          <div className='nav-links'>
            <a href="https://github.com/JitheshKrishnan" className='navbar-brand'>JKShadow</a>
            <a href="/">Home</a>
            <a href="/add_product">Add Product</a>
            <a href="/">Categories</a>
          </div>
          <div className='cart-search-bar'>
            <a href='/cart' className='cart-btn'>🛒 Cart</a>
            <input className='search' type="search" placeholder='Search' aria-label='Search' value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  />{showSearchResults && (
                  <ul className="list-group">
                    {searchResults.length > 0 ? (  
                        searchResults.map((result) => (
                          <li key={result.id} className="list-group-item">
                            <a href={`/product/${result.id}`} className="search-result-link">
                            <span>{result.name}</span>
                            </a>
                          </li>
                        ))
                    ) : (
                      noResults && (
                        <p className="no-results-message">
                          No Product with such Name
                        </p>
                      )
                    )}
                  </ul>
                )}
            <button onClick={toggleTheme} className='theme-btn'>{theme === "dark-theme" ? "🌙" : "☀️"}</button>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar