import React, { useState } from 'react';
import axios from 'axios';
// import Select from 'react-select';
import State from '../Profileform/State';
import MaritalStatus from '../Profileform/MaritalStatus';
import Religion from '../Profileform/Religion';
import Gender from '../Profileform/Gender';
import ProfilePicture from '../Profileform/ProfilePicture';
import Caste from '../Profileform/Caste';
import Weight from '../Profileform/Weight';
import Height from '../Profileform/Height';
import Age from '../Profileform/Age';
import Phone from '../Profileform/Phone';
import Password from '../Profileform/Password';
import Email from '../Profileform/Email';
import Name from '../Profileform/Name';
import Interests from '../Profileform/Interests';

const ProfileForm = () => {
  const storedUserId = localStorage.getItem('userId');
  const [userId, setUserId] = useState(storedUserId ? parseInt(storedUserId) : 1068);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    state: '',
    maritalStatus: '',
    religion: '',
    caste: '',
    height: '',
    weight: '',
    profilePicture: '',
    interests: '',
    aboutMe: '',
    password: '',
  });

  const [value, setValue] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);

  const options = [
    { value: "Reading", label: "Reading" },
    { value: "Yoga", label: "Yoga" },
    { value: "Sports", label: "Sports" },
    { value: "Travelling", label: "Travelling" },
    { value: "Gym", label: "Gym" },
    { value: "Cooking", label: "Cooking" },
    { value: "Photography", label: "Photography" },
    { value: "Gaming", label: "Gaming" },
  ];

  const validateName = (name) => {
    const nameRegex = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/;
    return nameRegex.test(name);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[789]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@./]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'name') {
      if (!validateName(value)) {
        setNameError('Name must start with a capital letter, and cannot contain ,|.| spaces, hyphens, or apostrophes.');
      } else {
        setNameError('');
      }
    }

    if (name === 'phone') {
      if (!validatePhoneNumber(value)) {
        setPhoneError('Please enter a valid phone number.');
      } else {
        setPhoneError('');
      }
    }

    if (name === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Invalid email address.');
      } else {
        setEmailError('');
      }
    }

    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('Password must be at least 8 characters and contain both letters and numbers.');
      } else {
        setPasswordError('');
      }
    }

    if (name === 'age') {
      if (value < 18 || value >40) {
        setAgeError('Only age between [18-40].');
      } else {
        setAgeError('');
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0]
    });
    setIsEditingProfilePic(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nameError || phoneError || emailError || passwordError || ageError) {
      return;
    }

    axios.post('http://localhost:8081/register', { formData })
      .then(res => {
        console.log("Registered successfully!");
        const newUserId = userId + 1;
        setUserId(newUserId);
        localStorage.setItem('userId', newUserId);

        setIsSubmitted(true);
        window.location.reload();
      })
      .catch(err => {
        console.log("Error during registration:", err);
        setIsSubmitted(false);
      });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-flex">
        <div className="form-left">
          <h4 style={{ textAlign: "center", color: "red" }}> *Indicates mandatory fields</h4>
          <div className="form-group">
            <strong>User ID: {userId}</strong>
          </div>
          <Name value={formData.name} onChange={handleChange}/>
            {nameError && <p className="error">{nameError}</p>}

          <Email value={formData.email} onChange={handleChange}/>
            {emailError && <p className="error">{emailError}</p>}

          <Password value= {formData.password} onChange={handleChange}/>
            {passwordError && <p className="error">{passwordError}</p>}

          <Phone value={formData.phone} onChange={handleChange}/>
            {phoneError && <p className="error">{phoneError}</p>}
          
          <Age value={formData.age} onChange={handleChange}/>
          {ageError && <p className="error">{ageError}</p>}
          
          <Gender value={formData.gender} onChange={handleChange} />
          
          <State value={formData.state} onChange={handleChange} />
        </div>

        <div className="form-middle">
          <div className="form-group">
            <MaritalStatus value={formData.maritalStatus} onChange={handleChange} />
            
            <Religion value={formData.religion} onChange={handleChange} />
            
            <Caste value={formData.caste} onChange={handleChange}/>

            <Height value={formData.height} onChange={handleChange} />

            <Weight value={formData.weight} onChange={handleChange} />
          
            <Interests value={value} onChange={setValue} options={options}/>
          
        </div>
          <div className="form-group">
            <label>About Me</label>
            <textarea
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          </div>
       
        <div className="form-right">
          <ProfilePicture
            profilePicture={formData.profilePicture}
            onFileChange={handleFileChange}
            isEditing={isEditingProfilePic}
            onEditClick={() => setIsEditingProfilePic(true)} 
          />
        </div>

        <div className="form-group">
          <input type="submit" value="Create Profile" />
        </div>

      </form>

      {isSubmitted && !phoneError && !emailError && !passwordError && (
        <div className="success-message">Profile Submitted!!</div>
      )}
      
    </div>
  );
};

export default ProfileForm;
