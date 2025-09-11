import React, { useEffect, useState } from 'react'

const Navbar = () => {

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  }
  
  const [theme, setTheme] = useState(getInitialTheme());

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  useEffect(() => {
    document.body.className = theme;
  }, [theme])

  return (
    <>
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <nav className='navbar'>
          <div className='nav-links'>
            <a className='navbar-brand' href="https://github.com/JitheshKrishnan">JKShadow</a>
            <a href="/">Home</a>
            <a href="/add_product">Add Product</a>
            <a href="/">Categories</a>
          </div>
          <div className='cart-search-bar'>
            <span className='cart'>🛒 Cart</span>
            <input className='search' type="search" placeholder='Search' aria-label='Search'/>
            <button onClick={toggleTheme} className='theme-btn'>{theme === "dark-theme" ? "🌙" : "☀️"}</button>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar