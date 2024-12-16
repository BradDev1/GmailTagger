// Import the Google APIs client library
const { google } = require('googleapis');
// Load environment variables from a .env file
require('dotenv').config();

// Initialize the OAuth2 client with credentials from environment variables
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,      // Client ID from Google Cloud Console
    process.env.CLIENT_SECRET,  // Client Secret from Google Cloud Console
    process.env.REDIRECT_URI    // Redirect URI configured in Google Cloud Console
);

// Generate code in url #ONE
const scopes = ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.readonly'];
const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
});
console.log('Autorisation URL:', url);

// The authorization code retrieved after the user authorizes the app #ONE
const code = process.env.CODE;


// #ONE
async function getToken() {
    try {
        // Exchange the authorization code for access and refresh tokens
        const { tokens } = await oauth2Client.getToken(code);
        // Set the tokens in the OAuth2 client for future requests
        oauth2Client.setCredentials(tokens);

        // Output the tokens for debugging or manual use
        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token);
    } catch (error) {
        console.error('Error while retrieving tokens:', error);
    }
}

// Set the credentials directly if tokens are already available
oauth2Client.setCredentials({
    access_token: process.env.ACCESS_TOKEN,   // Existing access token
    refresh_token: process.env.REFRESH_TOKEN // Existing refresh token
});

// Retrieve the access token (refreshing it if necessary)
oauth2Client.getAccessToken((err, token) => {
    if (err) {
        console.error('Authentication error:', err);
    } else {
        console.log('Access Token:', token);
    }
});

// Call the function to retrieve and set the tokens #ONE
getToken();

// Export the OAuth2 client for use in other parts of the application
module.exports = oauth2Client;
