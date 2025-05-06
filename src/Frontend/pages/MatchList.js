import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { useSelector } from 'react-redux';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [filter, setFilter] = useState({
    caste: '',
    interests: '',
  });
  const username = useSelector((state)=> state.auth.username);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = () => {
      setLoading(true);
      axios
        .get(`http://localhost:8081/api/matches?viewer=${username}`)
        .then((response) => {
          setMatches(response.data);
          setFilteredMatches(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch data');
          setLoading(false);
        });
    };
  
    fetchMatches();
  
    const interval = setInterval(() => {
      fetchMatches();
    }, 10000);
  
    return () => clearInterval(interval);
  }, [username]);
  
  const handleViewClick = (match) => {
    navigate(`/viewmatchlist/${match.name}`, { state: { match } });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = matches;

    if (filter.caste) {
      filtered = filtered.filter((match) => match.caste === filter.caste);
    }

    if (filter.interests) {
      filtered = filtered.filter((match) =>
        match.interests.toLowerCase().includes(filter.interests.toLowerCase())
      );
    }

    setFilteredMatches(filtered);
  };

  const handleRequestView = (match) => {
    axios.post('http://localhost:8081/api/request-view', {
      username: match.name,
      requested_by: username,
    })
    .then(() => {
      alert(`Request to view ${match.name}'s profile has been sent.`);
    })
    .catch(() => {
      alert('Failed to send request.');
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="Welcome-msg">
        <h2>Welcome User,</h2>
        <p>Find your matches here</p>
      </div>

      <div className="filter-section">
        <h3>Filter Matches</h3>
        <div>
          <label>Caste:</label>
          <select
            name="caste"
            value={filter.caste}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="OC">OC</option>
            <option value="SC">SC</option>
            <option value="BC">BC</option>
          </select>
        </div>
        <div>
          <label>Interests:</label>
          <select
            name="interests"
            value={filter.interests}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Music">Music</option>
            <option value="Yoga">Yoga</option>
            <option value="Travel">Travel</option>
            <option value="Reading">Reading</option>
            <option value="Cooking">Cooking</option>
            <option value="Gym">Gym</option>
            <option value="Photography">Photography</option>
            <option value="Movies">Movies</option>
          </select>
        </div>
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div className="d-flex flex-wrap">
        {filteredMatches.map((match, index) => (
          <div className="match-card" key={index}>
          <div className="card-content">
            {match.profile_visibility === 'public' ? (
              <img src={match.profilepicture} alt="Profile" />
            ) : (
              <div className="private-profile">
                <p> <strong>This account is private account.</strong></p>
              </div>
            )}
        
            <h3>{match.name}</h3>
            <p>Age: {match.age}</p>
            <p>Caste: {match.caste}</p>
            <p>Interests: {match.interests}</p>
        
            <div className="card-buttons">
              {match.profile_visibility === 'public' ? (
                <button className="btn" onClick={() => handleViewClick(match)}>
                  View
                </button>
              ) : (
                <button className="btn request-btn" onClick={() => handleRequestView(match)}>
                  Request to View
                </button>
              )}
            </div>
          </div>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default MatchList;
