# micro-s3-getSignedUrl
AWS S3 signed url micro service for https://github.com/zeit/micro

## Getting Started
1. Clone this repo
2. Create a .env file: `touch .env` (see next section for contents)
3. Install dependencies: `yarn`
4. Generate an auth token: `yarn run token` (make sure to also add this to .env file)
5. Start the micro service: `yarn start`

Now to generate a signed url:
`curl -H 'Authorization: Bearer TOKEN_CREATED_IN_STEP_4' http://localhost:3000/?name=fileName.jpg&type=image/jpeg`

## Environment Variables Needed
```
AWS_ACCESS_KEY=YOUR_ACCESS_KEY
AWS_SECRET_KEY=YOUR_SECRET_KEY
AWS_S3_BUCKET=YOUR_BUCKET_NAME
AWS_REGION=us-east-1
JWT_PRIVATE_KEY=CREATE_PRIVATE_KEY
```

## Launching Micro Service With Now
1. Add all of your environment variables to now secrets: (see below)
2. Deploy!

```
now secrets add aws_access_key "YOUR_ACCESS_KEY"
now secrets add aws_secret_key "YOUR_SECRET_KEY"
now secrets add aws_s3_bucket "YOUR_BUCKET_NAME"
now secrets add jwt_private_key "CREATE_PRIVATE_KEY"
```
`now -e AWS_ACCESS_KEY=@aws_access_key -e AWS_SECRET_KEY=@aws_secret_key -e AWS_S3_BUCKET=@aws_s3_bucket -e JWT_PRIVATE_KEY=@jwt_private_key`

## Example React Component
```
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { NOW_URL, JWT_TOKEN } from '../env';

class App extends Component {
   onDrop = (acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      fetch(`${NOW_URL}/?name=${file.name}&type=${file.type}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_TOKEN}`
        }
      })
      .then(res => res.json())
      .then(signed => fetch(signed.url, {
        method: 'PUT',
        body: file
      }));
    });
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onDrop}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      </div>
    );
  }
}

export default App;
```