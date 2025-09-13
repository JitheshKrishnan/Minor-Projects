import axios from 'axios';
import React, { createContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [isError, setIsError] = useState(false);

    const refreshProducts = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/products");
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
            setProducts(productsWithImages);
            setIsError(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setIsError(true);
        }
    }, []);

    const addProduct = useCallback(async (productData, imageFile) => {
        try {
            const formData = new FormData();
            const productBlob = new Blob([JSON.stringify(productData)], {
                type: 'application/json'
            });

            formData.append('product', productBlob);
            formData.append('imageFile', imageFile);

            const response = await axios.post(
                "http://localhost:8080/api/product",
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            await refreshProducts();
            setIsError(false);
            return response.data;
        } catch (error) {
            console.error('Error adding product:', error);
            setIsError(true);
            throw error;
        }
    }, [refreshProducts]);

    const updateProduct = useCallback(async (id, productData, imageFile) => {
        try {
            const formData = new FormData();
            const productBlob = new Blob([JSON.stringify(productData)], {
                type: 'application/json'
            });

            formData.append('product', productBlob);
            if (imageFile) {
                formData.append('imageFile', imageFile);
            }

            //TODO: get string from response
            const response = await axios.put(
                `http://localhost:8080/api/product/${id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            await refreshProducts();
            setIsError(false);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            setIsError(true);
            throw error;
        }
    }, [refreshProducts]);

    const deleteProduct = useCallback(async (id) => {
        try {
            //TODO: get string from response
            await axios.delete(`http://localhost:8080/api/product/${id}`);
            await refreshProducts();
            setIsError(false);
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            setIsError(true);
            throw error;
        }
    }, [refreshProducts]);

    const addToCart = (productId) => {
        const existingItem = cart.find((item) => item.productId === productId);
        const updatedCart = existingItem
            ? cart.map((item) =>
                  item.productId === productId
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
              )
            : [...cart, { productId, quantity: 1 }];
        setCart(updatedCart);
    };

    const decreaseQuantityFromCart = (productId) => {
        const existingItem = cart.find((item) => item.productId === productId);
        if (existingItem && existingItem.quantity > 1) {
            setCart(
                cart.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            );
        } else {
            removeFromCart(productId);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.productId !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    return (
        <AppContext.Provider
            value={{
                products,
                cart,
                isError,
                addProduct,
                updateProduct,
                deleteProduct,
                addToCart,
                decreaseQuantityFromCart,
                removeFromCart,
                clearCart,
                refreshProducts
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;