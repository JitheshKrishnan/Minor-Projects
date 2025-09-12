import axios from 'axios';
import React, {createContext, useState, useEffect, useCallback} from 'react'


const AppContext = createContext({
    data: [],
    cart: [],
    product: null,
    isError: null,
    selectedCategory: "",
    clearCart: () => {},
    refreshData: () => {},
    fetchProductById: (id) => {},
    addToCart: (product) => {},
    removeFromCart: (productId) => {},
    handleCategorySelect: (category) => {},
})

export const AppProvider = ({children}) => {
    const [data, setData] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [product, setProduct] = useState(null);
    const [isError, setIsError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    const refreshData = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/products");
            setData(response.data);
            console.log("data refreshed")
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    }, [])

    const fetchProductById = useCallback(async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/product/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    }, [])

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    }

    const addToCart = (product) => {
        const existingProductIndex = cart.findIndex((item) => item.id === product.id)
        if(existingProductIndex !== -1){
            const updatedCart = cart.map((item, index) =>
                index === existingProductIndex
                ? {...item, quantity: item.quantity + 1}
                : item
            );
            setCart(updatedCart);
        }
        else{
            const updatedCart = [...cart, {...product, quantity: 1}];
            setCart(updatedCart);
        }
    }

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
    }

    const clearCart = () => {
        setCart([]);
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart]);

    useEffect(() => {
        refreshData()
    }, []);

    return (
        <AppContext.Provider value={{ data, cart, product, isError, selectedCategory, clearCart, refreshData, addToCart, removeFromCart, handleCategorySelect, fetchProductById }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext;