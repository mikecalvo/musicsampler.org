'use strict';

const fs = require('fs');

const dotEnvExists = fs.existsSync('.env');
if (dotEnvExists) {
    console.log('.env exists probably running locally');
    process.exit();
}

const gcs = require('@google-cloud/storage')();
const bucketName = `envvars.${process.env.GCLOUD_PROJECT}.musicsampler.org`;
console.log(`Downloading .env from bucket "${bucketName}"`);
gcs.bucket(bucketName).file('env').download({destination: '.env'}).then(() => {
    console.log('.env downloaded succesfully')
}).catch(e => {
    console.log('Error getting .env: '+JSON.stringify(e));
});