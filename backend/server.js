const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/login');
const checkRoutes = require('./routes/check');
const editRoutes = require('./routes/edit');
const adminRoutes = require('./routes/admin');
const editContentRoutes = require('./routes/editContent');
const contentRoutes = require('./routes/content');
const payRoutes = require('./routes/payment.js')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [process.env.frontend, process.env.api],
    credentials: true
}));

app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/check', checkRoutes)
app.use('/edit', editRoutes)
app.use('/admin', adminRoutes)
app.use('/editContent', editContentRoutes)
app.use('/content', contentRoutes)
app.use('/pay', payRoutes)

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
