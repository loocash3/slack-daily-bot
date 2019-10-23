require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const articlesService = require('./articles.service');
const healthcheck = require('./healthcheck.service');

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.get('/', healthcheck.send);
app.post('/command', articlesService.send);
app.post('/actions', articlesService.send);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
