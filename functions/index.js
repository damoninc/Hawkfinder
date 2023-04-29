/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const dotenv = require('dotenv');
const process = require('process');
const request = require("request");
const functions = require("firebase-functions");
const needle = require("needle");



dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET
var redirect_uri_front = process.env.SPOTIFY_REDIRECT_URI_FRONT_END
var redirect_uri_back = process.env.SPOTIFY_REDIRECT_URI_BACK_END

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// eslint-disable-next-line no-undef
exports.spotifyAuth = functions.https.onCall( (req, res) => {

  var scope = "streaming user-read-currently-playing user-top-read user-follow-read user-read-recently-played"
  var state = generateRandomString(16);
  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: redirect_uri_back,
    state: state,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Authorization",
    }
  })
  return ({url: 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString()});
})

// eslint-disable-next-line no-undef
exports.spotifyCallback = functions.https.onRequest((req, res) => {
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


// eslint-disable-next-line no-undef
exports.spotifyRefresh = functions.https.onCall( (req, res) => {
  var refresh_token = req.refresh_token;
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

  return needle("post", authOptions.url, authOptions.form, {headers: authOptions.headers}).then((resp) => {
    console.log(resp.body.access_token)
    return ({access_token: resp.body.access_token})
  })
});
