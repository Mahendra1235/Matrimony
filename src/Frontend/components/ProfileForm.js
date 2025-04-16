import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [isEmailConfirmed, setIsEmailConfirmed] = useState('');
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

  const religionCasteOptions = {
    hindu: ["OC", "BC", "SC", "Brahmin", "Others"],
    christian: ["SC", "ST", "OBC", "Forward caste", "Others"],
    muslim: ["Muslim-Ansari", "Muslim-Arain", "Muslim-Awan", "Muslim-Bohra", "Muslim-Syed", "Muslim-Sheik", "Muslim-Siddiqui", "Muslim-Shafi", "Muslim-Mohammed"],
    others: ["No caste"],
  };

  const handleReligionChange = (e) => {
    const selectedReligion = e.target.value;
    setFormData({ ...formData, religion: selectedReligion, caste: '' });
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/;
    return nameRegex.test(name);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[789]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
  return emailRegex.test(email);
};

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@./]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key === 'Tab') {
      console.log("Tab key pressed, checking phone number...");
      if (formData.phone) {
        checkPhoneNumberExistence(formData.phone);
      }
    }
  };
  
  const handlePhoneBlur = () => {
    console.log("Phone blur triggered for:", formData.phone); 
    if (formData.phone) {
      checkPhoneNumberExistence(formData.phone);
    }
  };

useEffect(() => {
  if (formData.phone) {
    checkPhoneNumberExistence(formData.phone);
  }
}, [formData.phone]);

const checkPhoneNumberExistence = (phone) => {
  // console.log("Checking phone number:", phone);
  axios
    .get(`http://localhost:8081/checkPhoneNumber/${phone}`)
    .then((response) => {
      // console.log('Response from backend:', response.data);
      if (response.data.exists) {
        setPhoneError('Phone number already registered.');
      } else {
        setPhoneError('');
      }
    })
    .catch((error) => {
      console.error('Error checking phone number:', error);
      setPhoneError('There was an error checking the phone number.');
    });
};
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      const limitedValue = numericValue.slice(0, 10);
      
      setFormData({
        ...formData,
        [name]: limitedValue
      });

      if (!validatePhoneNumber(limitedValue)) {
        setPhoneError('Please enter a valid 10-digit phone number starting with 7, 8, or 9.');
      } else {
        setPhoneError('');
      }
      
      return;
    }

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
      if (value < 18 || value > 40) {
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
        setIsSubmitted(true);
        window.location.reload();
      })
      .catch(err => {
        console.log("Error during registration:", err);
        setIsSubmitted(false);

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

  const sendConfirmationEmail = (email) => {
  if (validateEmail(email)) {
    axios
      .post('http://localhost:8081/sendConfirmationEmail', { email })
      .then((response) => {
        console.log("email response:", response);
        console.log("verified response:", response.data === 'Email already verified');
        if (response.data === 'Email already verified'){
          setIsEmailConfirmed(true);
          alert('Email already verified');
        } else {
          alert(response.data);
          setIsEmailConfirmed(false);
        }
      })
      .catch((error) => {
        console.error('Error sending confirmation email:', error);
        setEmailError(error.response?.data || 'Error sending confirmation email');
      });
  } else {
    setEmailError('Invalid email address.');
  }
};


  const clearForm = () => {
    setFormData({
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
    setValue([]);
    setIsSubmitted(false);
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setAgeError('');
    setIsEditingProfilePic(false);

    const formElement = document.querySelector('form');
    if (formElement) formElement.reset();
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

          <Email
          email={formData.email}
          onChange={handleChange}
          emailError={emailError}
          onTabPress={sendConfirmationEmail}
          isEmailConfirmed={isEmailConfirmed}
          setIsEmailConfirmed={setIsEmailConfirmed}
        />

          <Password value={formData.password} onChange={handleChange}/>
            {passwordError && <p className="error">{passwordError}</p>}

          <Phone value={formData.phone} onChange={handleChange} onBlur={handlePhoneBlur} onKeydown={handlePhoneKeyDown}/>
            {phoneError && <p className="error">{phoneError}</p>}
          
          
          <Age value={formData.age} onChange={handleChange}/>
          {ageError && <p className="error">{ageError}</p>}
          
          <Gender value={formData.gender} onChange={handleChange} />
          
          <State value={formData.state} onChange={handleChange} />
        </div>

        <div className="form-middle">
          <div className="form-group">
            <MaritalStatus value={formData.maritalStatus} onChange={handleChange} />
            
            <Religion value={formData.religion} onChange={handleReligionChange} />
            <Caste value={formData.caste} onChange={handleChange} options={religionCasteOptions[formData.religion]} />

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
          <button type='button' onClick={clearForm}>Reset</button>
        </div>

      </form>

      {isSubmitted && !phoneError && !emailError && !passwordError && (
        <div className="success-message">Profile Submitted!!</div>
      )}
      
    </div>
  );
};

export default ProfileForm;