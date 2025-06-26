import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [tools, setTools] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    description: '',
    imageUrl: '',
    pricePerDay: '',
    pricePerWeek: '',
    quantity: '',
    isAvailable: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const apiUrl = 'http://localhost:8080/api/tools';

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = () => {
    axios.get(`${apiUrl}/getTools`)
      .then(res => setTools(res.data))
      .catch(err => console.error('Fetch tools failed:', err));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      pricePerDay: parseFloat(formData.pricePerDay),
      pricePerWeek: parseFloat(formData.pricePerWeek),
      quantity: parseInt(formData.quantity),
    };

    if (isEditing) {
      axios.put(`${apiUrl}/update/${formData.id}`, data)
        .then(() => {
          alert("Tool updated successfully!");
          resetForm();
          fetchTools();
        })
        .catch(() => alert("Update failed"));
    } else {
      axios.post(`${apiUrl}/add`, data)
        .then(() => {
          alert("Tool added successfully!");
          resetForm();
          fetchTools();
        })
        .catch(() => alert("Add failed"));
    }
  };

  const handleEdit = (tool) => {
    setFormData(tool);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      axios.delete(`${apiUrl}/delete/${id}`)
        .then(() => fetchTools())
        .catch(() => alert("Delete failed"));
    }
  };

  const handleSearch = () => {
    if (searchKeyword.trim() === '') {
      fetchTools();
    } else {
      axios.get(`${apiUrl}/search?keyword=${searchKeyword}`)
        .then(res => setTools(res.data))
        .catch(() => alert("Search failed"));
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      category: '',
      description: '',
      imageUrl: '',
      pricePerDay: '',
      pricePerWeek: '',
      quantity: '',
      isAvailable: true
    });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Tool Management</h1>

      {/* Tool Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '500px', marginBottom: '30px' }}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
        <input name="pricePerDay" type="number" placeholder="Price per Day" value={formData.pricePerDay} onChange={handleChange} required />
        <input name="pricePerWeek" type="number" placeholder="Price per Week" value={formData.pricePerWeek} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
        <label>
          Available:
          <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
        </label>
        <button type="submit" style={{ backgroundColor: '#282c34', color: 'white', padding: '10px' }}>
          {isEditing ? 'Update Tool' : 'Add Tool'}
        </button>
        {isEditing && <button onClick={resetForm} type="button">Cancel Edit</button>}
      </form>

      {/* Search bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="Search tool name"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px' }}>Search</button>
      </div>

      {/* Tool List Table */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price/Day</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map(tool => (
            <tr key={tool.id}>
              <td>{tool.name}</td>
              <td>{tool.category}</td>
              <td>Rs. {tool.pricePerDay}</td>
              <td>{tool.quantity}</td>
              <td>{tool.isAvailable ? "Yes" : "No"}</td>
              <td><img src={tool.imageUrl} alt="tool" width="50" /></td>
              <td>
                <button onClick={() => handleEdit(tool)} style={{ marginRight: '5px' }}>Edit</button>
                <button onClick={() => handleDelete(tool.id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
