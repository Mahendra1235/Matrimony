const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql2.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root@123',
    database: 'my_database',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err.stack);
        return;
    }
    console.log('Connected to the database');
});

//Fetch register form data//
app.post('/register', (req, res) => {
    console.log('Requesting:', req.body.formData);
    
    // Ensure the table column names match your data fields
    const sql = `INSERT INTO users (
        username, email, phone_number, age, gender, interests, state, religion, caste,
        marital_status, height, weight, profile_picture, about_me, password
    ) VALUES (?)`;
    
    const values = [
        req.body.formData.name,
        req.body.formData.email,
        req.body.formData.phone,
        req.body.formData.age,
        req.body.formData.gender,
        req.body.formData.interests,
        req.body.formData.state,
        req.body.formData.religion,
        req.body.formData.caste,
        req.body.formData.maritalStatus,
        req.body.formData.height,
        req.body.formData.weight,
        req.body.formData.profilePicture, 
        req.body.formData.aboutMe,
        req.body.formData.password,
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to insert user data' });
        }
        res.json(data);
    });
});


//fetch login page credentials//
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const userSql = "SELECT * FROM users WHERE username = ?";
    db.query(userSql, [username], (err, result) => {
        if (err || result.length === 0 || result[0].password !== password) {
            const adminSql = "SELECT * FROM admin WHERE username = ?";
            db.query(adminSql, [username], (err, adminResult) => {
                if (err || adminResult.length === 0 || adminResult[0].password !== password) {
                    return res.status(400).json({ message: 'Incorrect credentials' });
                }

                res.status(200).json({ message: 'Admin login successful', userId: adminResult[0].id, role: 'admin' });
            });
        } else {
            res.status(200).json({ message: 'Login successful', userId: result[0].id, role: 'user' });
        }
    });
});


//Fetch user registeration for admin
app.get('/admin/registrations', (req, res) => {
    const sql = "SELECT * FROM users";  // Changed from 'register' to 'users'
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching registrations:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        result = result.map(row => {
            if (row.Profile_Picture) {
                row.Profile_Picture = Buffer.from(row.Profile_Picture).toString('base64');
            }
            return row;
        });
        res.json(result);
    });
});

//Fetch registerm form data//
app.put('/admin/registrations/:id', (req, res) => {
    const { id } = req.params;
    const {
        username, Email, Phone_number, Age, Gender, State, Religion, Caste,
        Marital_Status, Height, Weight, Profile_Picture, Interests, About_Me
    } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
  }

    const sql = `
      UPDATE users
      SET username = ?, Email = ?, Phone_number = ?, Age = ?, Gender = ?, State = ?, Religion = ?, Caste = ?,
          Marital_Status = ?, Height = ?, Weight = ?, Profile_Picture = ?, Interests = ?, About_Me = ?
      WHERE UserID = ?
    `;

    const values = [
        username, Email, Phone_number, Age, Gender, State, Religion, Caste,
        Marital_Status, Height, Weight, Profile_Picture, Interests, About_Me, id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: 'Failed to update user data' });
        }
        res.json({ message: 'User data updated successfully' });
    });
});

// To fetch match data
app.get('/api/matches', (req, res) => {
    const query = 'SELECT name, age, caste, interests, profilepicture FROM matches';
    db.query(query, (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching matches' });
    } else {
      res.json(results);
    }
  });
});


// To Activate user
app.put('/admin/registrations/:id/activate', (req, res) => {
  const { id } = req.params;  // This is expected to be the correct UserID
  console.log("Activating UserId:", id);  // Debugging log
  const sql = 'UPDATE users SET Status = ? WHERE UserId = ?';
  const values = ['Active', id];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error activating user:', err);
          return res.status(500).json({ error: 'Failed to activate user' });
      }
      res.json({ message: 'User activated successfully' });
  });
});

// To Deactivate user
app.put('/admin/registrations/:id/deactivate', (req, res) => {
  const { id } = req.params;  // This is expected to be the correct UserID
  console.log("Deactivating UserId:", id);  // Debugging log
  const sql = 'UPDATE users SET Status = ? WHERE UserId = ?';
  const values = ['Inactive', id];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error deactivating user:', err);
          return res.status(500).json({ error: 'Failed to deactivate user' });
      }
      res.json({ message: 'User deactivated successfully' });
  });
});


//password-reset//

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'maheshrock.4550@gmail.com',
    pass: 'rkqs dgav tase ayky',  
  }
});
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex')
}
// POST route to handle password reset email request
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const resetToken = generateResetToken();
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  // Store the reset token in the database with an expiry time (e.g., 1 hour)
  const expiryTime = Date.now() + 3600000; // 1 hour from now
  const sql = 'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?';
  db.query(sql, [resetToken, expiryTime, email], (err, result) => {
    if (err) {
      console.log('Error storing reset token:', err);
      return res.status(500).json({ message: 'Error processing reset request' });
    }

    // Send the password reset email
    transporter.sendMail({
      from: 'maheshrock.4550@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`,
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending reset email' });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({ message: 'Password reset email sent successfully' });
      }
    });
  });
});


app.post('/reset-password', (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({ message: 'Username or password is missing.' });
  }

  // Directly save the password without hashing
  const updateSql = 'UPDATE users SET password = ? WHERE username = ?';
  db.query(updateSql, [newPassword, username], (err, result) => {
    if (err) {
      console.error('Error updating password:', err);
      return res.status(500).json({ message: 'Error resetting password.' });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password reset successfully.' });
  });
});



// Sample user data (you would get this from your database after registration)
// let users = [
//   { email: 'maheshrock.4550@gmail.com', name: 'Mahe' },
// ];

// // Route to send confirmation email
// app.post('/send-confirmation-email', (req, res) => {
//   const { email } = req.body;
  
//   // Generate a confirmation token
//   const token = crypto.randomBytes(16).toString('hex');
  
//   // Compose the confirmation email
//   const mailOptions = {
//     from: 'maheshrock.4550@gmail.com', 
//     to: email, 
//     subject: 'Email Confirmation',
//     text: `Hello, please confirm your email address by clicking the following link: 
//     http://localhost:8081/confirm-email?token=${token}`,
//   };

//   // Send the email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('error sending email:' , error);
//     }
//     console.log('Email sent: ' + info.response);
//   });
// });

// // Route to handle email confirmation
// app.get('/confirm-email', (req, res) => {
//   const { token } = req.query;
//   res.send('Email confirmed!');
// });


// Route to send confirmation email
app.post('/send-confirmation-email', (req, res) => {
  const { email } = req.body;

  // Query the database to check if the email exists
  db.execute('SELECT * FROM users WHERE Email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error fetching user from database:', err);
      return res.status(500).send('Error fetching user data');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    // Check if the email has already been confirmed
    if (results[0].isEmailConfirmed) {
      return res.status(400).send('Email already confirmed');
    }

    // Generate a confirmation token
    const token = crypto.randomBytes(16).toString('hex');

    // Store the token in the database for later confirmation check
    db.execute('UPDATE users SET confirmationToken = ? WHERE Email = ?', [token, email], (err, result) => {
      if (err) {
        console.error('Error storing confirmation token:', err);
        return res.status(500).send('Error storing token');
      }
    });

    // Compose the confirmation email
    const mailOptions = {
      from: 'test@gmail.com',
      to: email,
      subject: 'Email Confirmation',
      text: `Hello, please confirm your email address by clicking the following link:
      http://localhost:8081/confirm-email?token=${token}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).send('Error sending confirmation email');
      }

      console.log('Email sent: ' + info.response);
      res.send('Confirmation email sent!');
    });
  });
});

// Route to handle email confirmation
app.get('/confirm-email', (req, res) => {
  const { token } = req.query;

  // Query to check if the token matches a user in the database
  db.execute('SELECT * FROM users WHERE confirmationToken = ?', [token], (err, results) => {
    if (err) {
      console.error('Error fetching user by token:', err);
      return res.status(500).send('Error confirming email');
    }

    if (results.length === 0) {
      return res.status(404).send('Invalid token');
    }

    // Update the user to mark email as confirmed and remove the token
    db.execute('UPDATE users SET isEmailConfirmed = 1, confirmationToken = NULL WHERE confirmationToken = ?', [token], (err, result) => {
      if (err) {
        console.error('Error updating email confirmation status:', err);
        return res.status(500).send('Error confirming email');
      }

      res.send('Email confirmed!');
    });
  });
});

// Route to store user data in the database (after email confirmation)
app.post('/register', (req, res) => {
  const { formData } = req.body;

  if (!formData.email || !formData.password) {
    return res.status(400).send('Email and password are required.');
  }

  // Check if the email is confirmed
  db.execute('SELECT * FROM users WHERE Email = ?', [formData.email], (err, results) => {
    if (err) {
      console.error('Error fetching user from database:', err);
      return res.status(500).send('Error fetching user data');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    // Check if email is confirmed
    if (!results[0].isEmailConfirmed) {
      return res.status(400).send('Email is not confirmed. Please confirm your email before proceeding.');
    }

    // Store the user data in the database
    db.execute('INSERT INTO users SET ?', formData, (err, result) => {
      if (err) {
        console.error('Error storing user data:', err);
        return res.status(500).send('Error storing user data');
      }

      res.send('User registered successfully!');
    });
  });
});



app.listen(8081, () => {
    console.log("Server listening on port 8081");
});
