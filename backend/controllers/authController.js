const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerSchema, loginSchema } = require('../zod/authSchema')

const register = async (req, res) => {
    try {
        const { success } = registerSchema.safeParse(req.body)
        if (!success) {
            return res.status(400).json({
                message: 'Invalid Input'
            })
        }
        const { name, email, password } = req.body

        // check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        if (user) {
            // generate token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            })

            // set HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            })

            res.status(200).json({
                message: 'user created successfully',
                _id: user._id,
                name: user.name,
                email: user.email,
                token
            })
        }
        else {
            res.status(400).json({
                message: "invalid user data"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Server Error while registration"
        })
    }
}

const login = async (req, res) => {
    try {
        const { success } = loginSchema.safeParse(req.body)
        if (!success) {
            res.status(400).json({
                message: "invalid input"
            })
        }

        const { email, password } = req.body


        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })

        res.status(200).json({
            message: "login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        })


    } catch (error) {
        res.status(500).json({
            message: "Server Error while login"
        })
    }
}

const logout = async (req, res) => {
    res.clearCookie('token')

    res.status(200).json({ message: 'Logged out successfully' })

}

const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.status(200).json({
            message: 'User found',
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate token' });
    }

}

module.exports = { register, login, logout, getCurrentUser }