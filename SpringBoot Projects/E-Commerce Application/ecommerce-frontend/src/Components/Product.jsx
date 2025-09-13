import React, { useContext, useEffect } from 'react'
import AppContext from '../Contexts/Context'
import { useParams } from 'react-router-dom';

const Product = () => {

    const { id } = useParams();
    const { product, isError, fetchProductById, addToCart } = useContext(AppContext);

    useEffect(() => {
        fetchProductById(id);
    }, [id, fetchProductById]);

    if(!product){
        return (
            <>
                <div style={{
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    height: "100vh", 
                    paddingBottom: "70px"}}>
                    <h2 style={{color: "white"}}>Loading...</h2>
                </div>
            </>
        )
    }

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
            <div className='containers'>
                <div className='right-column'>
                    <div className='product-description'>
                        <span>{product.category}</span>
                        <h1>{product.name}</h1>
                        <h5>{product.brand}</h5>
                        <p>{product.description}</p>
                    </div>
                    <div className='product-price'>
                        <span>{"$ " + product.price}</span>
                        <button 
                        className={`${!product.available ? "disabled-btn" : "add-to-cart-btn"}`}
                        onClick={() => addToCart(product)}
                        disabled={!product.available}>
                            {product.available ? "Add to cart" : "Out of stock"}
                        </button>
                        <h6>Stock available: 
                            <i>{product.quantity}</i>
                        </h6>
                        <p className='release-date'>
                            <h6>Product listed on: </h6>
                            <i>{new Date(product.releaseDate).toLocaleDateString('en-GB')}</i>
                        </p>
                    </div>
                    <div className='update-delete-btn'>
                        <button className='update-btn'>Update</button>
                        <button className='delete-btn'>Delete</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product