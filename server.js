const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002; // Port number

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the current directory

// Ensure the data.json file exists
const ensureDataFileExists = () => {
    if (!fs.existsSync('data.json')) {
        fs.writeFileSync('data.json', JSON.stringify([])); // Create an empty array if file doesn't exist
    }
};

// Ensure the file exists when the server starts
ensureDataFileExists();

// Data Management Endpoints
app.get('/data.json', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        res.status(200).json(JSON.parse(data)); // Send the data as a response
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send({ message: 'Error reading data file' });
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.email === email && u.password === password);
        
        // Log the login attempt
        console.log('Login attempt for:', email);

        if (user) {
            console.log('Login successful for:', user.email);
            // Log user data after successful login
            console.log('User data:', user); // Log user data after successful login
            res.status(200).json({ message: 'Login successful', user });
        } else {
            console.log('Login failed for:', email);
            res.status(401).send({ message: 'Invalid email or password' });

            // Write new user data to data.json if the user is not found
            const newUserData = { email, password }; // Adjust as necessary
            users.push(newUserData);
            fs.writeFile('data.json', JSON.stringify(users), (err) => {
                if (err) {
                    console.error('Error writing to data file:', err);
                }
            });
        }
    });
});

app.put('/update-user', (req, res) => {
    const { email, newData } = req.body;
    fs.readFile('data.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        const users = JSON.parse(data);
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...newData };
            fs.writeFile('data.json', JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).send('Error writing to data file');
                }
                console.log('User updated successfully:', email);
                res.status(200).send({ message: 'User updated successfully' });
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    });
});

app.delete('/delete-user', (req, res) => {
    const { email } = req.body;
    fs.readFile('data.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        let users = JSON.parse(data);
        users = users.filter(u => u.email !== email);
        fs.writeFile('data.json', JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).send('Error writing to data file');
            }
            console.log('User deleted successfully:', email);
            res.status(200).send({ message: 'User deleted successfully' });
        });
    });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    fs.readFile('data.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        const users = JSON.parse(data);
        const existingUser = users.find(u => u.email === email);
        
        // Log registration attempt
        if (existingUser) {
            console.log('Registration failed: Email already registered');
            return res.status(400).send({ message: 'Email already registered' });
        }
        const newUser = { name, email, password };
        users.push(newUser);
        fs.writeFile('data.json', JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).send('Error writing to data file');
            }
            res.status(201).send({ message: 'User registered successfully' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
