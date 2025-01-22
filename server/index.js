const express = require('express');
const { OAuth2 } = require('google-auth-library');
const passport = require('passport');
const { google } = require('googleapis');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const app = express();

const PORT = 5000;

// CORS Configuration
app.use(
  cors({
    origin: 'https://g-cal-sso.vercel.app', 
    credentials: true, 
  })
);
app.options('*', cors()); // Handle preflight requests for all routes

app.use(express.json());
app.use(cookieParser());

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://g-cal-sso-backend.vercel.app/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { accessToken, refreshToken, profile });
}));

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events.readonly'],
  accessType: 'offline',
  prompt: 'consent',
}));

app.get('/auth/google/callback', passport.authenticate('google', { session: false }),
  (req, res) => {
    const { accessToken, refreshToken, profile } = req.user;
    res.cookie('token', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.redirect(`https://g-cal-sso.vercel.app`);
});

app.get('/events', async (req, res) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token, refresh_token: refreshToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = response.data.items;
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    res.cookie('token', credentials.access_token, { httpOnly: true, secure: true });
    res.json({ accessToken: credentials.access_token });
  } catch (err) {
    console.error('Error refreshing access token:', err);
    res.status(500).json({ error: 'Failed to refresh access token' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});