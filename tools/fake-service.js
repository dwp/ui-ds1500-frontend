/**
 * Fake gateway service on `http://localhost:9013/`. Endpoints:
 *
 * POST /controller
 * POST /download
 * POST /downloadFee
 */

// Setup app middleware. Order is important.
var express = require('express');

var app = express();
app.use(express.urlencoded({ extended: false }));


app.post('/controller', function(req, res) {
  res.send({
    id: '0000-0000-FAKE-ID'
  });
});

app.post('/download', function(req, res) {
  res.download(__dirname + '/../test/test-pdfs/testDS1500.pdf');
});

app.post('/downloadFee', function(req, res) {
  res.download(__dirname + '/../test//test-pdfs/testFee.pdf');
});

// Start a server
var server = app.listen(process.env.FAKE_GATEWAY_PORT || 9013, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Fake gateway listening at http://%s:%s', host, port);
});
