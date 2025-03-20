import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [filter, setFilter] = useState({
    caste: '',
    interests: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8081/api/matches')
      .then((response) => {
        setMatches(response.data);
        setFilteredMatches(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  const handleViewClick = (index) => {
    navigate(`/viewmatchlist/${index}`);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
            <option value="">All </option>
            <option value="OC">OC</option>
            <option value="SC">SC</option>
            <option value="BC">BC</option>
          </select>
        </div>
        <div>
          <label>Interests:</label>
          <select
            type="text"
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
            <img src={match.profilepicture} alt="Profile" />
            <h3>{match.name}</h3>
            <p>Age: {match.age}</p>
            <p>Caste: {match.caste}</p>
            <p>Interests: {match.interests}</p>
            <button className="btn" onClick={() => handleViewClick(index)}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchList;
