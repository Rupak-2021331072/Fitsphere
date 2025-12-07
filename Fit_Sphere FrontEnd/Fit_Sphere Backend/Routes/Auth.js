const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rahatazmain@gmail.com',
        pass: 'leoesygcqgalobwn',
    },
});

// Helper function to structure responses
function createResponse(ok, message, data = null) {
    return { ok, message, data };
}


router.get('/test', async (req, res) => {
    res.json({ message: 'Auth API is working' });
});

router.post('/register', async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            weightInKg,
            heightInCm,
            gender,
            dob,
            goal,
            activityLevel,
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json(createResponse(false, 'Email already exists'));
        }
        const date = new Date(dob);
        const newUser = new User({
            name,
            email,
            password, // ✅ Pass plain password - schema will hash it
            weight: [
                {
                    weight: weightInKg,
                    unit: 'kg',
                    date: Date.now(),
                },
            ],
            height: [
                {
                    height: heightInCm,
                    unit: 'cm',
                    date: Date.now(),
                },
            ],
            gender,
            dob: date.toString(),
            goal,
            activityLevel,
        });

        const response = await newUser.save();
        if(!response){
            console.log("Failed to upload to db");
            res.status(400).json(createResponse(false,"Internal Server Error. Failed to Register"));
        }

        res.status(201).json(createResponse(true, 'User registered successfully'));
    } catch (err) {
        next(err);
    }
});

// ✅ Login route - ALSO REMOVE TRIM()
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log("email: ", email, "password: ", password);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json(createResponse(false, 'NO user found by this email'));
        }
        console.log("password from database", user.password);

        // ✅ REMOVE .trim() - it can cause comparison issues
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }

        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '50m',
        });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: '100m',
        });

        res.cookie('authToken', authToken, {
            httpOnly: true,
            sameSite: 'Lax',
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'Lax',
        });

        res.status(200).json(
            createResponse(true, 'Login successful', {
                authToken,
                refreshToken,
            })
        );
    } catch (err) {
        next(err);
    }
});

// ✅ Check login route
router.post('/checklogin', authTokenHandler, (req, res) => {
    res.json(createResponse(true, 'User authenticated successfully'));
});

// ✅ Logout route (clears cookies)
router.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json(createResponse(true, 'Logout successful'));
});

// ✅ Get user profile route
router.get('/profile', authTokenHandler, async (req, res, next) => {
    try {
        const userId = req.user.userId; // From the authTokenHandler middleware
        const user = await User.findById(userId).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json(createResponse(false, 'User not found'));
        }
        
        res.status(200).json(createResponse(true, 'User profile fetched successfully', user));
    } catch (err) {
        next(err);
    }
});

// ✅ Send OTP route
router.post('/sendotp', async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);

        const mailOptions = {
            from: 'rahatazmain@gmail.com',
            to: email,
            subject: 'OTP for verification',
            text: `Your OTP is ${otp}`,
        };

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.log(err);
                res.status(500).json(createResponse(false, err.message));
            } else {
                res.json(createResponse(true, 'OTP sent successfully', { otp }));
            }
        });
    } catch (err) {
        res.status(500).json(createResponse(false, 'Failed to send OTP'));
    }
});

// ✅ Attach error middleware at end
router.use(errorHandler);

module.exports = router;
