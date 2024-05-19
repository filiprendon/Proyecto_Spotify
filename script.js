var client_id = '3f1100a54f2549dcb2451025697915cd';
var client_secret = '497bf12bd91d46e6bd57233a08cb6b61';

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var token = body.access_token;
  }
});