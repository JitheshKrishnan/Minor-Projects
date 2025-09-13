import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../Contexts/Context';

const AddProduct = () => {
    const navigate = useNavigate();
    const { addProduct, isError } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        price: '',
        category: '',
        releaseDate: '',
        available: true,
        quantity: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Electronics', 'Computers', 'Audio', 'Accessories', 'Wearables',
        'Storage', 'Photography', 'Furniture', 'Gaming', 'Mobile'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            alert('Please select an image');
            return;
        }

        setIsSubmitting(true);
        try {
            // Pass formData and imageFile to context's addProduct
            await addProduct(formData, imageFile);
            navigate('/'); // Redirect to home after successful add
        } catch (err) {
            console.error('Failed to add product:', err);
            alert('Failed to add product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            description: '',
            brand: '',
            price: '',
            category: '',
            releaseDate: '',
            available: true,
            quantity: ''
        });
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div style={{
            marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem',
            paddingRight: '1rem', paddingTop: '2rem', paddingBottom: '2rem'
        }}>
            <div style={{
                maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto',
                backgroundColor: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                borderRadius: '0.5rem', padding: '1.5rem'
            }}>
                <h1 style={{
                    fontSize: '1.875rem', fontWeight: '700', color: '#1f2937',
                    marginBottom: '1.5rem', textAlign: 'center'
                }}>Add New Product</h1>

                {isError && (
                    <div style={{
                        backgroundColor: '#fee2e2', border: '1px solid #f87171',
                        color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '0.25rem',
                        marginBottom: '1rem'
                    }}>
                        Error occurred while adding product. Please try again.
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Name */}
                    <div>
                        <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter product name"
                            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows="4"
                            placeholder="Enter product description"
                            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none', resize: 'vertical', minHeight: '100px' }}
                        />
                    </div>

                    {/* Brand and Category */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                            <label htmlFor="brand" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Brand *</label>
                            <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleInputChange} required placeholder="Enter brand name"
                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="category" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Category *</label>
                            <select id="category" name="category" value={formData.category} onChange={handleInputChange} required
                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}>
                                <option value="">Select a category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Price and Quantity */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                            <label htmlFor="price" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Price ($) *</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01"
                                placeholder="0.00"
                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="quantity" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Quantity *</label>
                            <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="0"
                                placeholder="0"
                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Release Date */}
                    <div>
                        <label htmlFor="releaseDate" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Release Date *</label>
                        <input type="date" id="releaseDate" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required
                            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    {/* Available */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="checkbox" id="available" name="available" checked={formData.available} onChange={handleInputChange}
                            style={{ height: '1rem', width: '1rem', borderRadius: '0.25rem', cursor: 'pointer' }} />
                        <label htmlFor="available" style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#111827', cursor: 'pointer' }}>
                            Product is available for purchase
                        </label>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Product Image *</label>
                        <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" required
                            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer' }} />
                        {imagePreview && <div style={{ marginTop: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>Preview:</p>
                            <img src={imagePreview} alt="Preview" style={{ width: '8rem', height: '8rem', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                        </div>}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem' }}>
                        <button type="submit" disabled={isSubmitting} style={{
                            flex: '1', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '500', fontSize: '1rem',
                            border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb', color: '#fff', transition: 'all 0.15s ease-in-out'
                        }}>
                            {isSubmitting ? 'Adding Product...' : 'Add Product'}
                        </button>

                        <button type="button" onClick={handleReset} disabled={isSubmitting} style={{
                            flex: '1', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '500', fontSize: '1rem',
                            border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            backgroundColor: '#6b7280', color: '#fff', transition: 'all 0.15s ease-in-out',
                            opacity: isSubmitting ? '0.5' : '1'
                        }}>
                            Reset Form
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
