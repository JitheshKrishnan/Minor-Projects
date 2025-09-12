import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import AppContext from '../Contexts/Context';
import { Link } from 'react-router-dom';

const Home = () => {

  const { data, isError, addToCart, refreshData } = useContext(AppContext);

  useEffect(() => {
    refreshData();
  }, [refreshData])

  if(isError){
    return (
      <>
        <div style={{
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh", 
          paddingBottom: "70px"}}>
          <h2 style={{color: "red"}}>Something went wrong!</h2>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='grid'>
        {data.map((product) => (
          <div className='card' key={product.id}>
            <Link to={`/product/${product.id}`} style={{textDecoration: "none", color: "inherit"}}>
              <div className='card-body'>
                <div>
                  <h5 className='card-title'>{product.name.toUpperCase()}</h5>
                  <i className='card-brand'>{"by " + product.brand}</i>
                </div>
                <hr className='hr-line'/>
                <div className='home-card-price'>
                  <h5 className='card-text'>
                    <i className='bi bi-currency-rupee'>{product.price}</i>
                  </h5>
                </div>
                <button className='add-to-cart-btn' onClick={(e) => {e.preventDefault(); addToCart(product);}}>Add to cart</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default Home