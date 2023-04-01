/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const express = require('express');
// eslint-disable-next-line no-undef
const dotenv = require('dotenv');
// eslint-disable-next-line no-undef
const process = require('process');
// eslint-disable-next-line no-undef
const request = require("request");

const port = 5000

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
  var scope = "streaming user-read-email user-read-private"

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: redirect_uri_back,
      state: state,
      headers: {
        'Access-Control-Allow-Origin' : '*',
        "Access-Control-Allow-Methods": "OPTIONS",
        "Access-Control-Allow-Headers": "Origin, Content-Type, Authorization"
      }
    })
  console.log(`redirecting`)
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
  })

app.get('/api/spotify/callback', (req, res) => {
  console.log('gotted')
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
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin' : '*',
      "Access-Control-Allow-Methods": "OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Authorization"
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body.expires_in)

      res.redirect(redirect_uri_front + `#access_token=${body.access_token}&refresh_token=${body.refresh_token}`)
    }
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

