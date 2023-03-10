const path = require('path');
const randomstring = require("randomstring");
const Buffer = require('buffer/').Buffer
const axios = require('axios');
const redirect_uri = 'https://stephens-spotify.onrender.com/callback';
// http://localhost:8888/
// Setup backend local Storage

// Set up ENV file and bring in data
require('dotenv').config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
// Access Token
let accessToken;

// Filepaths
const filePathMain = path.join(__dirname, '../','/dist'+'/index.html');
const filePathDashboard = path.join(__dirname, '../','/dist'+'/dashboard.html');
const filePathError = path.join(__dirname, '../','/dist'+'/error.html');


// Serve Log in Page
function getLoginPage(req, res)  {
  res.sendFile(filePathMain)  
}

// Redirect from login page to Spotify
function spotifyRedirect (req, res) {
    const state = randomstring.generate(16);
    const scope = 'user-read-private user-read-email user-library-modify user-library-read';
  
    const usp = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    })
    res.redirect('https://accounts.spotify.com/authorize?' + usp)
}


// Serve page after authorizaton. Store authorization code into a cookie for front end can access token
 function redirectAfterAuth(req, res, next) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  const usp = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect_uri
})

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: usp,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
  })
    .then(response => {
      if (response.status === 200) {
        accessToken = response.data.access_token
        res.setHeader('Set-Cookie', `spotifyToken=${response.data.access_token}`)
        res.sendFile(filePathDashboard);  
      } 
      else if (response.status === 403) {
        res.sendFile(filePathError)
      }
      else {
        res.send(response);
      }
    })
    .catch(error => {
      if(error.response.status === 400) {
        res.redirect('/login')
      } else if (error.response.status === 403){
        res.sendFile(filePathError);
      }
    });

    // res.sendFile(filePathDashboard)  
}

// Send Error file
function sendErrorFile(req, res) {
  res.status(403).sendFile(filePathError)
}



// Refresh token
function refreshToken(req, res) {
  const { refresh_token } = req.query;

  const usp = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token
})

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: usp,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
  })
    .then(response => {
      if (response.status === 200) {
        accessToken = response.data.access_token;
        res.setHeader('Set-Cookie', `spotifyToken=${response.data.access_token}`)
        res.sendFile(filePathDashboard);  
      } else {
        res.send(response);
      }
    })
    .catch(error => {
      res.send(error);
    });
};




module.exports =  { getLoginPage, spotifyRedirect, redirectAfterAuth, refreshToken, sendErrorFile, accessToken }