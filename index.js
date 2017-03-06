require('dotenv').config();
const cors = require('micro-cors')();
const { handleErrors, createError } = require('micro-boom');
const jwtAuth = require('micro-jwt-auth');
const { parse } = require('url');
const aws = require('aws-sdk');

const {
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_S3_BUCKET,
  AWS_REGION,
  JWT_PRIVATE_KEY
} = process.env;

const REGION = AWS_REGION || 'us-east-1';

if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_S3_BUCKET || !JWT_PRIVATE_KEY) {
  throw new Error(400, 'Incorrect Configuration', {
    reason: 'An AWS Access Key, AWS Secret Key, AWS S3 Bucket Name, and a JWT PRIVATE KEY are all required to run this micro service.'
  });
}

const s3 = new aws.S3({
  apiVersion: '2006-03-01',
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: REGION,
});

const getSignedUrl = async (req, res) => {
  const { query } = parse(req.url, true);

  if (!query.name || !query.type) {
    throw createError(400, 'Incorrect Configuration', {
      reason: 'File name and type (`?name=fileName.jpg&type=image/jpeg`) are required to run this micro service.'
    });
  }

  const url = await s3.getSignedUrl('putObject', {
    Bucket: AWS_S3_BUCKET,
    Key: query.name,
    Expires: 60,
    ContentType: query.type,
    ACL: 'public-read'
  });

  return { url };
};

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

module.exports = compose(
  handleErrors,
  cors,
  jwtAuth(JWT_PRIVATE_KEY)
)(getSignedUrl);
