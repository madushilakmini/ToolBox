import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTools();
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (search.trim() === '' && filteredTools.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % filteredTools.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [filteredTools, search]);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const fetchAllTools = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tools/getTools');
      setTools(response.data);
      setFilteredTools(response.data);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const handleSearchChange = async (e) => {
    const keyword = e.target.value;
    setSearch(keyword);

    if (keyword.trim() === '') {
      setFilteredTools(tools);
    } else {
      try {
        const response = await axios.get(`http://localhost:8080/api/tools/search?keyword=${keyword}`);
        setFilteredTools(response.data);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  const handleRentClick = (id) => {
    if (!isLoggedIn) {
      alert('Please log in to rent tools.');
      navigate('/login');
    } else {
      navigate(`/rent/${id}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Search Bar */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
      </div>

      {/* Slider Banner */}
      {search.trim() === '' && filteredTools.length > 0 && (
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <img
            src={filteredTools[current]?.imageUrl}
            alt={filteredTools[current]?.name}
            style={{ width: '400px', height: '350px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <h2 style={{ marginTop: '10px' }}>{filteredTools[current]?.name}</h2>
        </div>
      )}

      {/* Tool List */}
      <h3>{search.trim() === '' ? 'Rent Tools' : 'Search Results'}</h3>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 0' }}>
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div
              key={tool.id}
              style={{
                minWidth: '200px',
                marginRight: '50px',
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={tool.imageUrl}
                alt={tool.name}
                style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '5px' }}
              />
              <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{tool.name}</p>
              <button
                onClick={() => handleRentClick(tool.id)}
                style={{
                  padding: '10px',
                  backgroundColor: '#282c34',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '10px',
                  cursor: 'pointer',
                }}
              >
                Rent Now
              </button>
            </div>
          ))
        ) : (
          <p style={{ paddingLeft: '10px' }}>No tools found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
