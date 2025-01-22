# Google Calendar Events Viewer

## Introduction

This project is a web application that allows users to log in with Google and view a tabulated list of events they have scheduled in their Google Calendar. The backend is built using Node.js and Express.js, while the frontend is developed with React (Vite), TypeScript, and Material-UI. The application uses Google OAuth 2.0 for Single Sign-On (SSO) and fetches calendar events using the Google Calendar API.

## SSO Flow in this App

1. **User Initiates Login**: The user clicks the "Login with Google" button on the frontend.
2. **Redirect to Google OAuth**: The frontend redirects the user to the backend endpoint `/auth/google`, which initiates the Google OAuth 2.0 flow.
3. **Google Authentication**: Google prompts the user to log in and consent to the requested permissions (profile, email, and calendar events).
4. **Callback to Backend**: After authentication, Google redirects the user to the `/auth/google/callback` endpoint with an authorization code.
5. **Token Exchange**: The backend exchanges the authorization code for an access token and refresh token.
6. **Set Cookies**: The backend sets the access token and refresh token in HTTP-only, secure cookies.
7. **Redirect to Frontend**: The user is redirected back to the frontend with the tokens stored in cookies.
8. **Fetch Events**: The frontend fetches the user's calendar events by making a request to the `/events` endpoint, including the access token in the cookies.
9. **Display Events**: The frontend displays the events in a tabulated format.

## Instructions to Setup and Run Locally

### Prerequisites

- Node.js
- npm
- Google OAuth 2.0 credentials (For Client ID and Client Secret)

### Backend Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/google-calendar-events-viewer.git
   cd google-calendar-events-viewer/server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `server` directory and add the following:
   ```env
   CLIENT_ID=your-google-client-id
   CLIENT_SECRET=your-google-client-secret
   ```

4. **Run the Backend**:
   ```bash
   npm start
   ```
   The backend will start on `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the Frontend Directory**:
   ```bash
   cd ../client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `client` directory and add the following:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Run the Frontend**:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

### Google OAuth 2.0 Setup

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project.

2. **Enable the Google Calendar API**:
   - Navigate to the "API & Services" dashboard.
   - Enable the "Google Calendar API".

3. **Create OAuth 2.0 Credentials**:
   - Go to the "Credentials" tab.
   - Click "Create Credentials" and select "OAuth 2.0 Client ID".
   - Set the "Authorized JavaScript origins" to `http://localhost:5173`.
   - Set the "Authorized redirect URIs" to `http://localhost:5000/auth/google/callback`.
   - Note down the Client ID and Client Secret.

4. **Update Environment Variables**:
   - Update the `.env` file in the `server` directory with the Client ID and Client Secret obtained from the Google Cloud Console.

### Running the Application

1. **Start the Backend**:
   ```bash
   cd server
   npm start
   ```

2. **Start the Frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173`.
   - Click "Login with Google" to authenticate and view your calendar events.
