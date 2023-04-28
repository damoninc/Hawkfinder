/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const express = require('express');
// eslint-disable-next-line no-undef
const dotenv = require('dotenv');
// eslint-disable-next-line no-undef
const process = require('process');
// eslint-disable-next-line no-undef
const request = require("request");
// eslint-disable-next-line no-undef
const functions = require("firebase-functions");

const port = 5001

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET
var redirect_uri_front = process.env.SPOTIFY_REDIRECT_URI_FRONT_END
var redirect_uri_back = process.env.SPOTIFY_REDIRECT_URI_BACK_END
var app = express();

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get('/api/spotify', (req, res) => {
  var scope = "streaming user-read-currently-playing user-top-read user-follow-read user-read-recently-played"
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: redirect_uri_back,
    state: state,
    headers: {
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Authorization"
    }
  })
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.get('/api/spotify/callback', (req, res) => {
  var code = req.query.code;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri_back,
      grant_type: 'authorization_code'
    },
    headers: {
      // eslint-disable-next-line no-undef
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Authorization"
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.redirect(redirect_uri_front + `#access_token=${body.access_token}&refresh_token=${body.refresh_token}`)
    }
  });
});

export const spotifyRefresh = functions.https.onRequest(function (req, res) {

  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    // eslint-disable-next-line no-undef
    headers: { 'Authorization': 'Basic ' + (new Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
    else if (response.statusCode === 400) {
      res.send({
        'access_token': "null"
      })
    }
  });
});

// eslint-disable-next-line no-undef
exports.spotifyAuth = functions.https.onRequest(app);