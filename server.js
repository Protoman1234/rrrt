#!/usr/bin/env node
'use strict';
const app = require('express')();
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const proxy = require('./src/proxy');
//const compression = require('compression');

//app.use(compression())

app.enable('trust proxy');
app.get('/', authenticate, params, proxy);
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(8080);
