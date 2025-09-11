import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Home = () => {

  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
        console.log(products);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setIsError(true);
      }
    }
    fetchData();
  }, [])

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
        {products.map((product) => (
          <div className='card'>
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
              <button className='btn-hover color-9'>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Home