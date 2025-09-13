import React, { useContext } from 'react';
import AppContext from '../Contexts/Context';
import { Link } from 'react-router-dom';

const Home = () => {
  const { products, isError, addToCart } = useContext(AppContext);

  if (isError) {
    return (
      <div style={{
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        paddingBottom: "70px"
      }}>
        <h2 style={{ color: "red" }}>Something went wrong!</h2>
      </div>
    );
  }

  return (
    <div className='grid'>
      {products.map((product) => (
        <div className='card' key={product.id}>
          <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <img src={product.imageUrl} alt={product.name} className="card-image" />
            <div className='card-body'>
              <h5 className='card-title'>{product.name.toUpperCase()}</h5>
              <i className='card-brand'>{"by " + product.brand}</i>
              <h5 className='card-price'>{"$ " + product.price}</h5>
            </div>
          </Link>

          <button
            className={`${!product.available ? "home-disabled-btn" : "home-add-to-cart-btn"}`}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id);
            }}
            disabled={!product.available}
          >
            {product.available ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;