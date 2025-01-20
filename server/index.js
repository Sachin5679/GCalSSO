const express = require('express');
const { OAuth2 } = require('google-auth-library');
const passport = require('passport');
const { google } = require('googleapis');
const cors = require('cors');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
// app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,clientSecret:process.env.CLIENT_SECRET,callbackURL:'/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null,{accessToken, profile});
}
));

app.get('/auth/google', passport.authenticate('google',{scope:['profile','email','https://www.googleapis.com/auth/calendar.events.readonly']}));

app.get('/auth/google/callback', passport.authenticate('google',{session:false}),
(req,res)=>{
    const { accessToken, profile } = req.user;
    res.redirect(`http://localhost:5174?token=${accessToken}`)
});

app.get('/events', async(req,res)=>{
    const { token }=req.query;
    if (!token) {
        return res.status(400).json({ error: 'Access token is required' });
    }
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        const events=response.data.items;
        res.json(events);
    }catch(err){
        console.error('Error fetching events:', err);
        res.status(500).json({error:'Failed to fetch events'});
    }
});

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);    
})