import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../Contexts/Context';

const Cart = () => {
    const { cart, products, addToCart, decreaseQuantityFromCart, removeFromCart, clearCart } = useContext(AppContext);
    const navigate = useNavigate();

    // Calculate total price
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return product ? total + product.price * item.quantity : total;
        }, 0).toFixed(2);
    };

    // Calculate total items
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Handle quantity increase
    const increaseQuantity = (productId) => {
        addToCart(productId);
    };

    // Handle quantity decrease
    const decreaseQuantity = (productId) => {
        decreaseQuantityFromCart(productId);
    };

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '2rem auto',
            padding: '2rem',
            backgroundColor: 'var(--body_background)',
            minHeight: '80vh'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--navbar_text)'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 1rem 0',
            color: 'var(--navbar_text)'
        },
        itemCount: {
            fontSize: '1.2rem',
            color: 'var(--navbar_text)',
            opacity: '0.8'
        },
        emptyCart: {
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--card-bg-clr)',
            borderRadius: '1rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        },
        emptyTitle: {
            fontSize: '2rem',
            color: 'var(--navbar_text)',
            marginBottom: '1rem'
        },
        emptyText: {
            fontSize: '1.1rem',
            color: 'var(--navbar_text)',
            opacity: '0.7',
            marginBottom: '2rem'
        },
        shopButton: {
            padding: '12px 24px',
            backgroundColor: 'var(--btn-clr)',
            color: 'white',
            border: 'none',
            borderRadius: '2rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        },
        cartContent: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '2rem',
            alignItems: 'flex-start'
        },
        cartItems: {
            backgroundColor: 'var(--card-bg-clr)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        },
        itemsHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid var(--hr_line_card)'
        },
        itemsTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--navbar_text)'
        },
        clearButton: {
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '1rem',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        },
        cartItem: {
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto',
            gap: '1rem',
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid var(--hr_line_card)'
        },
        itemImage: {
            width: '80px',
            height: '80px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            color: '#666'
        },
        itemDetails: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        },
        itemName: {
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'var(--navbar_text)',
            margin: 0
        },
        itemBrand: {
            fontSize: '0.9rem',
            color: 'var(--navbar_text)',
            opacity: '0.7',
            margin: 0
        },
        itemPrice: {
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--btn-clr)',
            margin: 0
        },
        itemControls: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
        },
        quantityControls: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--body_background)',
            borderRadius: '2rem',
            padding: '0.25rem'
        },
        quantityButton: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'var(--btn-clr)',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s ease'
        },
        quantity: {
            minWidth: '40px',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'var(--navbar_text)'
        },
        removeButton: {
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '1rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        },
        sidebar: {
            backgroundColor: 'var(--card-bg-clr)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            height: 'fit-content'
        },
        summaryTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--navbar_text)',
            marginBottom: '1.5rem',
            textAlign: 'center'
        },
        summaryRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            fontSize: '1.1rem',
            color: 'var(--navbar_text)'
        },
        summaryDivider: {
            height: '2px',
            backgroundColor: 'var(--hr_line_card)',
            margin: '1.5rem 0'
        },
        totalRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: 'var(--navbar_text)',
            marginBottom: '2rem'
        },
        checkoutButton: {
            width: '100%',
            padding: '15px',
            backgroundColor: 'var(--btn-clr)',
            color: 'white',
            border: 'none',
            borderRadius: '2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginBottom: '1rem'
        },
        continueButton: {
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: 'var(--btn-clr)',
            border: '2px solid var(--btn-clr)',
            borderRadius: '2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        '@media (max-width: 768px)': {
            cartContent: {
                gridTemplateColumns: '1fr',
                gap: '1rem'
            },
            cartItem: {
                gridTemplateColumns: '60px 1fr',
                gap: '0.75rem'
            },
            itemControls: {
                gridColumn: 'span 2',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '1rem'
            }
        }
    };

    if (cart.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyCart}>
                    <h1 style={styles.emptyTitle}>Your Cart is Empty</h1>
                    <p style={styles.emptyText}>
                        Looks like you haven't added any items to your cart yet.
                        <br />
                        Start shopping to fill it up!
                    </p>
                    <button
                        style={styles.shopButton}
                        onClick={() => navigate('/')}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--btn-clr-hover)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--btn-clr)'}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Shopping Cart</h1>
                <p style={styles.itemCount}>
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            <div style={styles.cartContent}>
                <div style={styles.cartItems}>
                    <div style={styles.itemsHeader}>
                        <h2 style={styles.itemsTitle}>Cart Items</h2>
                        <button
                            style={styles.clearButton}
                            onClick={clearCart}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                        >
                            Clear Cart
                        </button>
                    </div>

                    {cart.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return null; // Skip if product data not loaded yet
                        return (
                            <div key={item.productId} style={styles.cartItem}>
                                <div style={styles.itemImage}>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{ width: '100%', borderRadius: '8px' }}
                                    />
                                </div>

                                <div style={styles.itemDetails}>
                                    <h3 style={styles.itemName}>{product.name}</h3>
                                    <p style={styles.itemBrand}>{product.brand}</p>
                                    <p style={styles.itemPrice}>${product.price}</p>
                                </div>

                                <div style={styles.itemControls}>
                                    <div style={styles.quantityControls}>
                                        <button
                                            style={styles.quantityButton}
                                            onClick={() => decreaseQuantity(product.id)}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--btn-clr-hover)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--btn-clr)'}
                                        >
                                            −
                                        </button>
                                        <span style={styles.quantity}>{item.quantity}</span>
                                        <button
                                            style={styles.quantityButton}
                                            onClick={() => increaseQuantity(product.id)}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--btn-clr-hover)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--btn-clr)'}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        style={styles.removeButton}
                                        onClick={() => removeFromCart(product.id)}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={styles.sidebar}>
                    <h2 style={styles.summaryTitle}>Order Summary</h2>

                    <div style={styles.summaryRow}>
                        <span>Subtotal ({getTotalItems()} items):</span>
                        <span>${calculateTotal()}</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span>Tax:</span>
                        <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                    </div>

                    <div style={styles.summaryDivider}></div>

                    <div style={styles.totalRow}>
                        <span>Total:</span>
                        <span>${(parseFloat(calculateTotal()) + parseFloat(calculateTotal()) * 0.08).toFixed(2)}</span>
                    </div>

                    <button
                        style={styles.checkoutButton}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--btn-clr-hover)')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--btn-clr)')}
                        onClick={() => alert('Checkout functionality coming soon!')}
                    >
                        Proceed to Checkout
                    </button>

                    <button
                        style={styles.continueButton}
                        onClick={() => navigate('/')}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--btn-clr)';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'var(--btn-clr)';
                        }}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;