const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();

const PORT = 5000;

app.use(express.json());
app.use(passport.initialize());

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);    
})