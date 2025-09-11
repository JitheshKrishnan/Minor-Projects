import React from 'react'
import "./App.css"
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import AddProduct from './Components/AddProduct'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/add_product' element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App