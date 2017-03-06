#!/usr/bin/env node
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { JWT_PRIVATE_KEY } = process.env;

console.log(jwt.sign({}, JWT_PRIVATE_KEY));
