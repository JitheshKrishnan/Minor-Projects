import axios from 'axios';
import React, {createContext, useState, useEffect, useCallback} from 'react'


const AppContext = createContext({
    data: [],
    cart: [],
    product: null,
    productsWithImageUrl: [],
    isError: null,
    selectedCategory: "",
    clearCart: () => {},
    refreshData: () => {},
    fetchProductById: (id) => {},
    fetchImageByProductId: (product) => {},
    addProduct: (productData, imageFile) => {},
    addToCart: (product) => {},
    decreaseQuantityFromCart: (product) => {},
    removeFromCart: (productId) => {},
    handleCategorySelect: (category) => {},
})

export const AppProvider = ({children}) => {
    const [data, setData] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [product, setProduct] = useState(null);
    const [productsWithImageUrl, setProductsWithImageUrl] = useState([]);
    const [isError, setIsError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    const refreshData = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/products");
            setData(response.data);
            console.log("data refreshed");
            setIsError(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    }, [])

    const fetchProductById = useCallback(async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/product/${id}`);
            setProduct(response.data);
            setIsError(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    }, [])

    const fetchImageByProductId = useCallback(async (product) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
            );
            if(response.data && response.data.size > 0){
                const imageUrl = URL.createObjectURL(response.data);
                return { ...product, imageUrl };
            }
        } catch (error) {
            console.error("Error fetching product image of id: ", product.id, error);
            return { ...product, imageUrl: "placeholder-image-url"}
        }
    }, [])

    const addProduct = useCallback(async (productData, imageFile) => {
        try {
            setIsError(false);
            const formData = new FormData();
            const productBlob = new Blob([JSON.stringify(productData)], {
                type: 'application/json'
            });
            
            formData.append('product', productBlob);
            formData.append('imageFile', imageFile);

            const response = await axios.post("http://localhost:8080/api/product", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("product added successfully: ", response.data);
            alert("Product Added Successfully!");
            await refreshData();
            return response.data;
        } catch (error) {
            console.error("Error adding product: ", error);
            setIsError(true);
            throw error;
        }
    }, [refreshData])

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

    const decreaseQuantityFromCart = (product) => {
        // const existingProduct = cart.find(item => item.id === product.id);
        if(product.quantity > 1){
            const updatedCart = cart.map((item) => 
                item.id === product.id
                    ? {...item, quantity: item.quantity - 1}
                    : item
            );
            setCart(updatedCart);
        }
        else{
            removeFromCart(product.id);
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
        const fetchProductsWithImages = async () => {
            if(data && data.length > 0){
                try{
                    const updatedProducts = await Promise.all(
                        data.map(async (product) => {
                            return await fetchImageByProductId(product);
                        })
                    );
                    setProductsWithImageUrl(updatedProducts);
                    console.log("Products with image updated!");
                } catch(error){
                    console.log("Error updating products with image URLs: ", error);
                    setProductsWithImageUrl([]);
                }
            }
        };

        fetchProductsWithImages();
    }, [data, fetchImageByProductId])
    
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart]);

    useEffect(() => {
        refreshData()
    }, [refreshData]);

    return (
        <AppContext.Provider value={{
            data, 
            cart, 
            product, 
            isError, 
            selectedCategory, 
            productsWithImageUrl, 
            clearCart, 
            refreshData, 
            addProduct, 
            addToCart, 
            decreaseQuantityFromCart, 
            removeFromCart, 
            handleCategorySelect, 
            fetchProductById, 
            fetchImageByProductId 
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext;