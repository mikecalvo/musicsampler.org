# Music Sampler nodejs server application

## GCP App Engine
The application is currently running in GCP App Engine
Instructions to get a development environment setup
1. Install the Google Cloud SDK
2. Setup local environment: `gcloud init`
3. Deploy the app: `gcloud deploy app`

### Tailing Server Log
`gcloud app logs tail -s default`

## Heroku Database

## Running Locally
1. Configure a .env file defining DB_URL variable to point to your heroku postgres instance
2. npm start