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

// Route to check if the phone number already exists
app.get('/checkPhoneNumber/:phone', (req, res) => {
  const { phone } = req.params;

  const sql = "SELECT COUNT(*) AS count FROM users WHERE phone_number = ?";
  db.query(sql, [phone], (err, result) => {
    if (err) {
      console.error('Error checking phone number:', err);
      return res.status(500).json({ error: 'Failed to check phone number' });
    }

    if (result[0].count > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });

    }
  });
});


//Fetch register form data//
app.post('/register', (req, res) => {
    console.log('Requesting:', req.body.formData);
    
    // Ensure the table column names match your data fields
    const sql = `INSERT INTO users (
        username, email, phone_number, age, gender, interests, state, religion, caste,
        marital_status, height, weight, profile_picture, about_me, password, profile_visibility
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
        req.body.formData.profileVisibility,
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to insert user data' });
        }
        res.json(data);
    });
});


// fetch login page credentials
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

              res.status(200).json({
                  message: 'Admin login successful',
                  userId: adminResult[0].id,
                  role: 'admin',
                  username: adminResult[0].username
              });
          });
      } else {
          res.status(200).json({
              message: 'Login successful',
              userId: result[0].id,
              role: 'user',
              username: result[0].username
          });
      }
  });
});



//Fetch user registeration for admin
app.get('/admin/registrations', (req, res) => {
    const sql = "SELECT * FROM users";
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
  const { viewer } = req.query;

  const query = `
    SELECT 
      u.username AS name, 
      u.age, 
      u.caste, 
      u.interests, 
      u.height, 
      u.weight, 
      u.state, 
      u.Profile_Picture AS profilepicture, 
      u.phone_number,
      CASE 
        WHEN u.profile_visibility = 'public' 
          OR EXISTS (
            SELECT 1 FROM approved_viewers 
            WHERE viewer = ? AND private_user = u.username
          ) 
        THEN 'public'
        ELSE 'private'
      END AS profile_visibility
    FROM users u
    WHERE u.status = 'active'
  `;

  db.query(query, [viewer], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching matches' });
    } else {
      res.json(results);
    }
  });
});



// Endpoint to handle request to view a private profile

app.post('/api/request-view', (req, res) => {
  const { username, requested_by } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const insertQuery = `
    INSERT INTO view_requests (requested_user, requested_by, status)
    VALUES (?, ?, 'pending')
  `;

  db.query(insertQuery, [username, requested_by], (err, result) => {
    if (err) {
      console.error('DB insert error:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    const emailQuery = `SELECT email FROM users WHERE username = ?`;

    db.query(emailQuery, [username], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({ message: 'Could not fetch email' });
      }

      const userEmail = results[0].email;

      //  Insert notification into your `notifications` table
      const notifMessage = `Someone has requested to view your profile.`;
      const insertNotifQuery = `
        INSERT INTO notifications (recipient, message, created_at)
        VALUES (?, ?, NOW())
      `;

      db.query(insertNotifQuery, [username, notifMessage], (notifErr) => {
        if (notifErr) {
          console.error('Failed to insert notification:', notifErr);
        }
      });

      //  Email logic
      const approvalLink = `http://localhost:8081/api/approve-view?username=${encodeURIComponent(username)}`;
      const mailOptions = {
        from: 'yourgmail@gmail.com',
        to: userEmail,
        subject: 'Profile Picture View Request',
        html: `
          <p>Hello ${username},</p>
          <p>Someone has requested to view your Elite Matrimony profile.</p>
          <p><a href="${approvalLink}">Click here to approve</a></p>
        `
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error('Email sending failed:', err);
          return res.status(500).json({ message: 'Failed to send email' });
        }

        return res.status(200).json({ message: 'Request and notification sent successfully' });
      });
    });
  });
});

app.get('/api/notifications/:username', (req, res) => {
  const { username } = req.params;

  const query = `
    SELECT * FROM notifications 
    WHERE recipient = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch notifications' });
    }

    res.json(results);
  });
});

app.post('/api/notifications/delete', (req, res) => {
  const { id } = req.body;

  const query = `DELETE FROM notifications WHERE id = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete notification' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  });
});



app.get('/api/approve-view', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send('Invalid request');
  }

  const updateQuery = `
    UPDATE view_requests SET status = 'approved' WHERE requested_user = ?
  `;

  db.query(updateQuery, [username], (err, result) => {
    if (err) {
      return res.status(500).send('Failed to approve request');
    }

    // const updateProfile = `
    //   UPDATE users SET profile_visibility = 'public' WHERE username = ?
    // `;
    const insertViewerQuery = `
  INSERT INTO approved_viewers (private_user, viewer)
  VALUES (?, ?)
`;

    db.query(insertViewerQuery, [username, requester], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to insert approval' });
      res.send(`<h2>Request Approved</h2><p>Your profile picture is now visible.</p>`);
    });
  });
});


app.post('/api/notifications/accept', (req, res) => {
  const { id, username } = req.body;

  // 1. Get the requester from view_requests
  const getRequesterQuery = `
    SELECT requested_by FROM view_requests
    WHERE requested_user = ?
    ORDER BY requested_at DESC LIMIT 1
  `;

  db.query(getRequesterQuery, [username], (err, requesterResult) => {
    if (err || requesterResult.length === 0) {
      return res.status(500).json({ message: 'Failed to find requester' });
    }

    const requester = requesterResult[0].requested_by;

    // 2. Approve the view request
    const approveRequestQuery = `
      UPDATE view_requests
      SET status = 'approved'
      WHERE requested_user = ?
    `;
    console.log(`Approving for: ${username}, requester: ${requester}`);

    db.query(approveRequestQuery, [username], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update request' });

      // 3. Update user's profile visibility
      const insertApprovalQuery = `
  INSERT INTO approved_viewers (private_user, viewer, approved_at)
  VALUES (?, ?, NOW())
`;

db.query(insertApprovalQuery, [username, requester], (err) => {
  if (err) return res.status(500).json({ message: 'Failed to grant view access' });

  // Continue: Notify requester, delete original notification, etc.


        // 4. Notify the requester
        const notifMessage = `Your request to view ${username}'s profile has been approved.`;
        console.log("notification received:", notifMessage);
        const notifyRequesterQuery = `
          INSERT INTO notifications (recipient, message, created_at)
          VALUES (?, ?, NOW())
        `;

        db.query(notifyRequesterQuery, [requester, notifMessage], (notifErr) => {
          if (notifErr) console.error('Failed to notify requester:', notifErr);

          // 5. Delete the original notification
          const deleteNotifQuery = `
            DELETE FROM notifications
            WHERE id = ?
          `;

          db.query(deleteNotifQuery, [id], (err) => {
            if (err) return res.status(500).json({ message: 'Failed to delete notification' });

            res.status(200).json({ message: 'Profile access approved and requester notified' });
          });
        });
      });
    });
  });
});


app.post('/api/notifications/decline', (req, res) => {
  const { id, username } = req.body;

  const declineRequestQuery = `
    UPDATE view_requests
    SET status = 'declined'
    WHERE requested_user = ?
  `;

  const deleteNotifQuery = `
    DELETE FROM notifications
    WHERE id = ?
  `;

  db.query(declineRequestQuery, [username], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update request' });

    db.query(deleteNotifQuery, [id], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete notification' });

      res.status(200).json({ message: 'Profile access declined' });
    });
  });
});




// Endpoint to get user profile based on userId
app.post('/api/profile', (req, res) => {
  const { username, password } = req.body;  

  // Query to verify user credentials
  const query = `SELECT 
    username, 
    email, 
    phone_number, 
    age, 
    gender, 
    interests, 
    state, 
    religion, 
    caste, 
    marital_status, 
    height, 
    weight, 
    profile_picture, 
    about_me, 
    status 
    FROM users WHERE username = ? AND password = ?`;

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error fetching profile data' });
    } else {
      if (results.length > 0) {
        res.json(results[0]); 
      } else {
        res.status(404).send({ message: 'User not found or incorrect password' });
      }
    }
  });
});


// Endpoint to update user profile based on username and password
app.put('/api/profile', (req, res) => {
  const { username, password, email, phone_number, age, gender, interests, state, religion, caste, marital_status, height, weight, profile_picture, about_me, status } = req.body;

  // Query to update user profile
  const query = `UPDATE users 
                 SET email = ?, 
                     phone_number = ?, 
                     age = ?, 
                     gender = ?, 
                     interests = ?, 
                     state = ?, 
                     religion = ?, 
                     caste = ?, 
                     marital_status = ?, 
                     height = ?, 
                     weight = ?, 
                     profile_picture = ?, 
                     about_me = ?, 
                     status = ?
                 WHERE username = ? AND password = ?`;

  db.query(query, [email, phone_number, age, gender, interests, state, religion, caste, marital_status, height, weight, profile_picture, about_me, status, username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error updating profile data' });
    } else {
      if (results.affectedRows > 0) {
        res.json({ message: 'Profile updated successfully' });
      } else {
        res.status(404).send({ message: 'User not found or incorrect password' });
      }
    }
  });
});




// To Activate user
app.put('/admin/registrations/:id/activate', (req, res) => {
  const { id } = req.params;
  console.log("Activating UserId:", id);
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
  const { id } = req.params;
  console.log("Deactivating UserId:", id);
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
  },
  // port: 587,
  // host: 'smtp.gmail.com',
  // tls: {
  //   rejectUnauthorized: false,
  // },
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


function sendConfirmationEmailToUser(email, token) {
  const confirmationUrl = `http://localhost:8081/confirm-email?token=${token}`;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Email verification',
    text: `Click the link below to confirm your email address:\n\n${confirmationUrl}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
// Route to handle email confirmation request
app.post('/sendConfirmationEmail', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  // Step 1: Check if email is already verified in users or email_verification tables
  const checkEmailQuery = `
    (SELECT email, email_verified FROM users WHERE email = ? AND email_verified = 1)
    UNION
    (SELECT email, email_verified FROM email_verification WHERE email = ? AND email_verified = 1)
  `;

  db.query(checkEmailQuery, [email, email], (err, results) => {
    if (err) {
      console.log('Error checking email:', err);
      return res.status(500).send('Error checking email');
    }

    // Step 2: If the email is already verified in either table, return a message and don't send a new confirmation email
    if (results.length > 0) {
      return res.status(200).send('Email already verified');
    }

    // Step 3: Check if email exists in email_verification table but not verified (email_verified = 0)
    const checkEmailInVerificationTable = 'SELECT * FROM email_verification WHERE email = ? AND email_verified = 0';

    db.query(checkEmailInVerificationTable, [email], (err, verificationResults) => {
      if (err) {
        console.log('Error checking email in email_verification table:', err);
        return res.status(500).send('Error checking email');
      }

      console.log('Verification Results:', verificationResults); // Log verification results to ensure the data exists

      // Step 4: If the email exists and is unverified, send the confirmation link
      if (verificationResults.length > 0) {
        const user = verificationResults[0];

        console.log('User Record Found:', user); // Log user to see the actual values

        // Check if 'UserId' exists before proceeding
        if (!user.UserId) {
          console.log('No UserId found:', user); // This will show if the UserId is missing
          return res.status(400).send('User record not found or UserId is missing in email_verification table.');
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expirationTime = Date.now() + 3600000; // 1 hour expiration

        // Step 5: Ensure user record exists in email_verification and update token
        const updateTokenQuery = 'UPDATE email_verification SET verification_token = ?, verification_token_expiry = ? WHERE UserId = ?';

        db.query(updateTokenQuery, [token, expirationTime, user.UserId], (err, result) => {
          if (err) {
            console.log('Error updating token:', err);
            return res.status(500).send('Error updating token');
          }

          // Send the confirmation email
          sendConfirmationEmailToUser(email, token);

          return res.status(200).send('Confirmation email sent. Please check your inbox.');
        });
      } else {
        // Step 6: If the email is not found in the verification table, create a new entry with email_verified = 0
        const token = crypto.randomBytes(20).toString('hex');
        const expirationTime = Date.now() + 3600000; // 1 hour expiration

        const insertEmailQuery = 'INSERT INTO email_verification (email, verification_token, verification_token_expiry, email_verified) VALUES (?, ?, ?, 0)';

        db.query(insertEmailQuery, [email, token, expirationTime], (err, result) => {
          if (err) {
            console.log('Error inserting email:', err);
            return res.status(500).send('Error inserting email');
          }

          // Send the confirmation email
          sendConfirmationEmailToUser(email, token);

          return res.status(200).send('Confirmation email sent. Please check your inbox.');
        });
      }
    });
  });
});



// Route to handle email confirmation
app.get('/confirm-email', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Token is required');
  }

  const query = 'SELECT * FROM email_verification WHERE verification_token = ?';
  const currentTime = Date.now();

  db.query(query, [token], (err, results) => {
    if (err) {
      console.log('Error verifying token:', err);
      return res.status(500).send('Error verifying token');
    }

    if (results.length === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    const user = results[0];  // Accessing the first row of the result set
    console.log('Token:', token);
    console.log('Token Expiry:', user.verification_token_expiry);
    console.log('Current Time:', currentTime);

    // Check if the token is expired
    if (user.verification_token_expiry < currentTime) {
      console.log('Token has expired');
      return res.status(400).send('Token has expired');
    }

    // Update the email verification status
    const updateQuery = 'UPDATE email_verification SET email_verified = 1 WHERE UserId = ?';
    
    db.query(updateQuery, [user.UserId], (err, result) => {
      if (err) {
        console.log('Error updating email verification:', err);
        return res.status(500).send('Error updating email verification');
      }
    
      console.log('Update result:', result); // Log the result to see if the query affected any rows
      if (result.affectedRows === 0) {
        console.log('No rows were updated. Check if the UserId exists in the table.');
        return res.status(400).send('No matching record found for this email.');
      }
    
      console.log('Email successfully confirmed!');
      res.send('Email confirmed successfully!');
    });
    
  });
});


app.listen(8081, () => {
  console.log("Server listening on port 8081");
});
