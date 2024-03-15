const express = require('express');
const users = require('./data'); // Assuming this is your user data module
const path = require('path');

const app = express();
const idFilter = req => member => member.id === parseInt(req.params.id);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Get all users
app.get('/api/data', (req, res) => res.json(users));

// Get specific user based on ID
app.get('/api/data/:id', (req, res) => {
    const found = users.some(idFilter(req));
    if (found) {
        res.json(users.filter(idFilter(req)));
    } else {
        res.status(404).json({ msg: `No member with the id of ${req.params.id}` });
    }
});

// Create a new user
app.post('/api/data', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ msg: 'Name and email must be provided' });
    }
    const newMember = {
        id: users.length + 1,
        name,
        email,
        status: 'guest'
    };
    users.push(newMember);
    res.json(users);
});

// Delete user based on ID

app.delete('/api/data/:id', (req, res) => {
    const found = users.some(idFilter(req));
    if (found) {
        const filteredUsers = users.filter(member => member.id !== parseInt(req.params.id));
        res.json({ msg: 'Deleted', members: filteredUsers });
    } else {
        res.status(404).json({ msg: `No member with the id of ${req.params.id}` });
    }
});


// Update user details
app.put('/api/data/:id', (req, res) => {
    const found = users.some(member => member.id === parseInt(req.params.id));
    if (found) {
        const updMember = req.body;
        users.forEach(member => {
            if (member.id === parseInt(req.params.id)) {
                member.name = updMember.name ? updMember.name : member.name;
                member.email = updMember.email ? updMember.email : member.email;
            }
        });
        res.json({ msg: 'Updated details', member: users.find(member => member.id === parseInt(req.params.id)) });
    } else {
        res.status(404).json({ msg: `No user found with id ${req.params.id}` });
    }
});