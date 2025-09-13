import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Contexts/Context';
import { useParams, useNavigate } from 'react-router-dom';

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, isError, addToCart, deleteProduct } = useContext(AppContext);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const prod = products.find((p) => p.id.toString() === id);
        setProduct(prod || null);
    }, [products, id]);

    if (!product) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                paddingBottom: "70px"
            }}>
                <h2 style={{ color: "white" }}>Loading...</h2>
            </div>
        );
    }

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

    const handleUpdate = () => {
        navigate(`/update_product/${product.id}`);
    };

    const handleDelete = async () => {
        // Create custom confirmation dialog
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
        );

        if (confirmDelete) {
            try {
                const response = await deleteProduct(product.id);
                alert('Product deleted successfully!\nmessage: ', response.data);
                navigate('/'); // Navigate back to home page
            } catch (error) {
                alert('Failed to delete product. Please try again.');
                console.error('Delete error:', error);
            }
        }
        // If user clicks cancel, nothing happens
    };

    return (
        <div className='containers' style={{ display: 'flex', gap: '2rem' }}>
            {/* Left column for image */}
            <div className='left-column' style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                    src={product.imageUrl || 'placeholder-image-url'} 
                    alt={product.name} 
                    style={{
                        height: '70vh',
                        maxWidth: '600px',
                        borderRadius: '0.5rem',
                        objectFit: 'cover',
                        border: '1px solid #d1d5db'
                    }}
                />
            </div>

            {/* Right column for product info */}
            <div className='right-column' style={{ flex: '1' }}>
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
                        onClick={() => addToCart(product.id)}
                        disabled={!product.available}
                    >
                        {product.available ? "Add to cart" : "Out of stock"}
                    </button>
                    <h6>Stock available:
                        <i>{product.quantity}</i>
                    </h6>
                    <p className='release-date'>
                        Product listed on: <i>{new Date(product.releaseDate).toLocaleDateString('en-GB')}</i>
                    </p>
                </div>
                <div className='update-delete-btn'>
                    <button className='update-btn' onClick={handleUpdate}>Update</button>
                    <button className='delete-btn' onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default Product;
