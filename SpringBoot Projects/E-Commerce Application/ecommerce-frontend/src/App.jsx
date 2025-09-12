import './App.css'
import React from 'react'
import Cart from './Components/Cart'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import Product from './Components/Product'
import AddProduct from './Components/AddProduct'
import { AppProvider } from './Contexts/Context'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add_product' element={<AddProduct />} />
          <Route path='/product/:id' element={<Product />}/>
          <Route path='/cart' element={<Cart />}/>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App