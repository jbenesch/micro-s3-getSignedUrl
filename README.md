# micro-s3-getSignedUrl
AWS S3 signed url micro service for https://github.com/zeit/micro

## Getting Started
1. Clone this repo
2. Create a .env file which contains the following variables:
```
AWS_ACCESS_KEY=YOUR_ACCESS_KEY
AWS_SECRET_KEY=YOUR_SECRET_KEY
AWS_S3_BUCKET=YOUR_BUCKET_NAME
AWS_REGION=us-east-1
JWT_PRIVATE_KEY=CREATE_PRIVATE_KEY
```
3. Install dependencies: `yarn`
4. Generate an auth token: `yarn run token`
5. Start the micro service: `yarn start`

Now to generate a signed url:
`curl -H 'Authorization: Bearer TOKEN_CREATED_IN_STEP_4' http://localhost:3000/?key=mypicture.png`
