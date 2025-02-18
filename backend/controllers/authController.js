const nano = require('nano')(process.env.COUCHDB_URL);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminDb = nano.db.use('inventory_admin');
const userDb = nano.db.use('inventory_users');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User Signup
exports.signup = async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the username is the fixed admin account
        let role = 'user';  // Default role for normal users

        if (username === process.env.FIXED_ADMIN_USERNAME) {
            const existingAdmin = await adminDb.find({ selector: { username } });
            if (existingAdmin.docs.length > 0) {
                return res.status(400).json({ message: 'Admin account already exists' });
            }
            role = 'admin';
        }

        const db = role === 'admin' ? adminDb : userDb;

        // Ensure username uniqueness
        await db.createIndex({ index: { fields: ['username'] } });
        const existingUser = await db.find({ selector: { username } });
        if (existingUser.docs.length > 0) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Create the user document
        const newUser = { 
            username, 
            password: role === 'admin' 
                        ? await bcrypt.hash(process.env.FIXED_ADMIN_PASSWORD, 10) // Use fixed password for admin
                        : hashedPassword, 
            role 
        };
        const response = await db.insert(newUser);

        res.status(201).json({ message: 'User registered successfully', id: response.id, role });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};


// User Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Check both admin and user databases
        let user = await adminDb.find({ selector: { username } });
        let role = 'admin';


        if (username === process.env.FIXED_ADMIN_USERNAME) {
            user = await adminDb.find({ selector: { username } });
            role = 'admin';

            if (user.docs.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // ✅ Compare the entered password with the fixed admin password
            const validPassword = password === process.env.FIXED_ADMIN_PASSWORD;
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            user = await userDb.find({ selector: { username } });
            role = 'user';

            if (user.docs.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // ✅ Compare hashed password for normal users
            const validPassword = await bcrypt.compare(password, user.docs[0].password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        const token = generateToken(user.docs[0]._id, role);
        res.json({ message: 'Login successful', token, role });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
