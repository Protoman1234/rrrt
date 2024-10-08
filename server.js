#!/usr/bin/env node
'use strict';
const app = require('express')();
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const proxy = require('./src/proxy');
const PORT = process.env.PORT || 8080;
const hostname = "0.0.0.0";


app.get('/', authenticate, params, proxy);
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(PORT, hostname, () => console.log(`Listening on ${hostname}:${PORT}`));
