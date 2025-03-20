import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentData, setCurrentData] = useState({
    username: '',
    Email: '',
    Phone_number: '',
    Age: '',
    Gender: '',
    State: '',
    Religion: '',
    Caste: '',
    Marital_Status: '',
    Height: '',
    Weight: '',
    Profile_Picture: '',
    Interests: '',
    About_Me: ''
  });
  
  const [filters, setFilters] = useState({
    Caste: '',
    Religion: '',
    Age: '',
    State: '',
    Status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    Caste: [],
    Religion: [],
    Age: [],
    State: [],
    Status: []
  });
  
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    axios.get('http://localhost:8081/admin/registrations')
      .then(response => {
        console.log('Fetched registrations:', response.data);
        setRegistrations(response.data);
        setFilteredRegistrations(response.data);
        
        const options = {
          Caste: [...new Set(response.data.map(item => item.Caste).filter(Boolean))],
          Religion: [...new Set(response.data.map(item => item.Religion).filter(Boolean))],
          Age: [...new Set(response.data.map(item => item.Age).filter(Boolean))].sort((a, b) => a - b),
          State: [...new Set(response.data.map(item => item.State).filter(Boolean))],
          Status: [...new Set(response.data.map(item => item.Status).filter(Boolean))]
        };
        setFilterOptions(options);
      })
      .catch(error => {
        console.error('Error fetching registrations:', error);
      });
  }, []);

  useEffect(() => {
    let result = [...registrations];
    
    if (filters.Caste) {
      result = result.filter(item => item.Caste === filters.Caste);
    }
    
    if (filters.Religion) {
      result = result.filter(item => item.Religion === filters.Religion);
    }
    
    if (filters.Age) {
      result = result.filter(item => item.Age === parseInt(filters.Age));
    }
    
    if (filters.State) {
      result = result.filter(item => item.State === filters.State);
    }
    
    if (filters.Status) {
      result = result.filter(item => item.Status === filters.Status);
    }
    
    setFilteredRegistrations(result);
  }, [filters, registrations]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      Caste: '',
      Religion: '',
      Age: '',
      State: '',
      Status: ''
    });
  };

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const headers = [
        'UserId', 'username', 'Email', 'Phone_number', 'Age', 'Gender', 
        'State', 'Religion', 'Caste', 'Marital_Status', 'Height', 'Weight', 
        'Interests', 'About_Me', 'Status'
      ];
      
      let csvContent = headers.join(',') + '\n';
        filteredRegistrations.forEach(user => {
        const row = headers.map(header => {
          const cellValue = user[header] !== null && user[header] !== undefined ? user[header].toString() : '';
          return cellValue.includes(',') ? `"${cellValue}"` : cellValue;
        });
        csvContent += row.join(',') + '\n';
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'user_registrations.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage('CSV exported successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setMessage('Failed to export CSV. Please try again.');
      setTimeout(() => setMessage(''), 2000);
    }
    
    setIsExporting(false);
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF('l', 'mm', 'a3'); 
      const headers = [
        'UserId', 'Username', 'Email', 'Phone', 'Age', 'Gender', 
        'State', 'Religion', 'Caste', 'Marital Status', 'Height', 'Weight', 
        'Interests', 'Status'
      ];
      
      const data = filteredRegistrations.map(user => [
        user.UserId,
        user.username,
        user.Email,
        user.Phone_number,
        user.Age,
        user.Gender,
        user.State,
        user.Religion,
        user.Caste,
        user.Marital_Status,
        user.Height,
        user.Weight,
        user.Interests,
        user.Status
      ]);
      
      doc.setFontSize(18);
      doc.text('User Registrations', 14, 15);
      doc.setFontSize(12);
      const today = new Date();
      doc.text(`Generated: ${today.toLocaleDateString()}`, 14, 22);
      
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 30,
        margin: { top: 30 },
        styles: { overflow: 'linebreak', cellWidth: 'auto', fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 20 },
          2: { cellWidth: 30 },
          13: { cellWidth: 15 },
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: 'bold'
        }
      });
      
      doc.save('user_registrations.pdf');
      setMessage('PDF exported successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setMessage('Failed to export PDF. Please try again.');
      setTimeout(() => setMessage(''), 2000);
    }
    
    setIsExporting(false);
  };

  const handleEdit = (registration) => {
    setCurrentData(registration);
    setEditing(true); 
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentData({
      ...currentData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentData.username) {
      alert("Username is required");
      return;
    }

    axios.put(`http://localhost:8081/admin/registrations/${currentData.UserId}`, currentData)
      .then(response => {
        console.log('Data updated successfully:', response.data);
        setEditing(false);
        
        const updatedRegistrations = registrations.map(registration => 
          registration.UserId === currentData.UserId ? currentData : registration
        );
        
        setRegistrations(updatedRegistrations);
        let result = [...updatedRegistrations];
        
        if (filters.Caste) {
          result = result.filter(item => item.Caste === filters.Caste);
        }
        
        if (filters.Religion) {
          result = result.filter(item => item.Religion === filters.Religion);
        }
        
        if (filters.Age) {
          result = result.filter(item => item.Age === parseInt(filters.Age));
        }
        
        if (filters.State) {
          result = result.filter(item => item.State === filters.State);
        }

        if (filters.Status) {
          result = result.filter(item => item.Status === filters.Status);
        }
        
        setFilteredRegistrations(result);
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleActivate = (userId) => {
    axios.put(`http://localhost:8081/admin/registrations/${userId}/activate`)
      .then(response => {
        console.log('User activated:', response.data);
        const updatedRegistrations = registrations.map(registration =>
          registration.UserId === userId ? { ...registration, Status: 'Active' } : registration
        );
        
        setRegistrations(updatedRegistrations);
        setFilteredRegistrations(filteredRegistrations.map(registration =>
          registration.UserId === userId ? { ...registration, Status: 'Active' } : registration
        ));

        setMessage('User profile activated successfully!');
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(error => {
        console.error('Error activating user:', error);
        setMessage('Error activating user.');
        setTimeout(() => setMessage(''), 2000);
      });
  };

  const handleDeactivate = (userId) => {
    axios.put(`http://localhost:8081/admin/registrations/${userId}/deactivate`)
      .then(response => {
        console.log('User deactivated:', response.data);
        const updatedRegistrations = registrations.map(registration =>
          registration.UserId === userId ? { ...registration, Status: 'Inactive' } : registration
        );
        
        setRegistrations(updatedRegistrations);
        setFilteredRegistrations(filteredRegistrations.map(registration =>
          registration.UserId === userId ? { ...registration, Status: 'Inactive' } : registration
        ));

        setMessage('User profile deactivated successfully!');
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(error => {
        console.error('Error deactivating user:', error);
        setMessage('Error deactivating user.');
        setTimeout(() => setMessage(''), 2000);
      });
  };

  return (
    <div className="admin-container">
      <h2 style={{ textAlign: 'left' }}>Welcome, Admin</h2>
      <h2>Registered Users</h2>
  
      {message && <div className="status-message">{message}</div>}
  
      <div className="top-controls">
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="filter-toggle-button"
        >
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          <span>{showFilters ? '▲' : '▼'}</span>
        </button>
  
        <div className="export-controls">
          <button 
            className="csv-button" 
            onClick={exportToCSV}
            disabled={isExporting || filteredRegistrations.length === 0}
          >
            {isExporting ? 'Exporting...' : 'Export as CSV'}
          </button>
          <button 
            className="pdf-button" 
            onClick={exportToPDF}
            disabled={isExporting || filteredRegistrations.length === 0}
          >
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </button>
          {filteredRegistrations.length === 0 && (
            <span className="no-data-message">No data available to export</span>
          )}
        </div>
      </div>
  
      {showFilters && (
        <div className="filter-container">
          <h3>Filter Users</h3>
          <div className="filter-options">
            <div className="filter-option">
              <label>Religion:</label>
              <select 
                name="Religion" 
                value={filters.Religion} 
                onChange={handleFilterChange}
              >
                <option value="">All Religions</option>
                {filterOptions.Religion.map((option, index) => (
                  <option key={`religion-${index}`} value={option}>{option}</option>
                ))}
              </select>
            </div>
  
            <div className="filter-option">
              <label>Caste:</label>
              <select 
                name="Caste" 
                value={filters.Caste} 
                onChange={handleFilterChange}
              >
                <option value="">All Castes</option>
                {filterOptions.Caste.map((option, index) => (
                  <option key={`caste-${index}`} value={option}>{option}</option>
                ))}
              </select>
            </div>
  
            <div className="filter-option">
              <label>Age:</label>
              <select 
                name="Age" 
                value={filters.Age} 
                onChange={handleFilterChange}
              >
                <option value="">All Ages</option>
                {filterOptions.Age.map((option, index) => (
                  <option key={`age-${index}`} value={option}>{option}</option>
                ))}
              </select>
            </div>
  
            <div className="filter-option">
              <label>State:</label>
              <select 
                name="State" 
                value={filters.State} 
                onChange={handleFilterChange}
              >
                <option value="">All States</option>
                {filterOptions.State.map((option, index) => (
                  <option key={`state-${index}`} value={option}>{option}</option>
                ))}
              </select>
            </div>
  
            <div className="filter-option">
              <label>Status:</label>
              <select 
                name="Status" 
                value={filters.Status} 
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                {filterOptions.Status.map((option, index) => (
                  <option key={`status-${index}`} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button onClick={resetFilters}>Reset Filters</button>
            <span className="filter-summary">
              Showing {filteredRegistrations.length} of {registrations.length} users
            </span>
          </div>
        </div>
      )}
  
      {editing && (
        <form onSubmit={handleSubmit} className="edit-form">
          <h3>Edit:</h3>
          <label>username:
            <input
              type="text"
              name="username"
              value={currentData.username}
              onChange={handleInputChange}
            />
          </label>
          <label>Email:
            <input
              type="email"
              name="Email"
              value={currentData.Email}
              onChange={handleInputChange}
            />
          </label>
          <label>Phone Number:
            <input
              type="text"
              name="Phone_number"
              value={currentData.Phone_number}
              onChange={handleInputChange}
            />
          </label>
          <label>Age:
            <input
              type="number"
              name="Age"
              value={currentData.Age}
              onChange={handleInputChange}
            />
          </label>
          <label>Gender:
            <input
              type="text"
              name="Gender"
              value={currentData.Gender}
              onChange={handleInputChange}
            />
          </label>
          <label>State:
            <input
              type="text"
              name="State"
              value={currentData.State}
              onChange={handleInputChange}
            />
          </label>
          <label>Religion:
            <input
              type="text"
              name="Religion"
              value={currentData.Religion}
              onChange={handleInputChange}
            />
          </label>
          <label>Caste:
            <input
              type="text"
              name="Caste"
              value={currentData.Caste}
              onChange={handleInputChange}
            />
          </label>
          <label>Marital Status:
            <input
              type="text"
              name="Marital_Status"
              value={currentData.Marital_Status}
              onChange={handleInputChange}
            />
          </label>
          <label>Height:
            <input
              type="text"
              name="Height"
              value={currentData.Height}
              onChange={handleInputChange}
            />
          </label>
          <label>Weight:
            <input
              type="text"
              name="Weight"
              value={currentData.Weight}
              onChange={handleInputChange}
            />
          </label>
          <label>Interests:
            <input
              type="text"
              name="Interests"
              value={currentData.Interests}
              onChange={handleInputChange}
            />
          </label>
          <label>About Me:
            <textarea
              name="About_Me"
              value={currentData.About_Me}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
  
      <table className="registration-table">
        <thead>
          <tr>
            <th>UserId</th>
            <th>username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Age</th>
            <th>Gender</th>
            <th>State</th>
            <th>Religion</th>
            <th>Caste</th>
            <th>Marital Status</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Profile Picture</th>
            <th>Interests</th>
            <th>About Me</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRegistrations.map((registration, index) => (
            <tr key={`${registration.UserId}-${index}`}>
              <td>{registration.UserId}</td>
              <td>{registration.username}</td>
              <td>{registration.Email}</td>
              <td>{registration.Phone_number}</td>
              <td>{registration.Age}</td>
              <td>{registration.Gender}</td>
              <td>{registration.State}</td>
              <td>{registration.Religion}</td>
              <td>{registration.Caste}</td>
              <td>{registration.Marital_Status}</td>
              <td>{registration.Height}</td>
              <td>{registration.Weight}</td>
              <td>
                {registration.Profile_Picture ? (
                  <img
                    src={`data:image/jpeg;base64,${registration.Profile_Picture}`}
                    alt="Profile"
                    className="profile-img"
                  />
                ) : (
                  'NA'
                )}
              </td>
              <td>{registration.Interests}</td>
              <td>{registration.About_Me}</td>
              <td>{registration.Status}</td>
              <td>
                <div className="button-container">
                  <button className="edit-button" onClick={() => handleEdit(registration)}>Edit</button>
                  <button className="activate-button" onClick={() => handleActivate(registration.UserId)}>Activate</button>
                  <button className="deactivate-button" onClick={() => handleDeactivate(registration.UserId)}>Deactivate</button>
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;