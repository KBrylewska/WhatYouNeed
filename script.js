// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');
const readline = require('readline');

// Create unique bucket name
var bucketName = 'node-sdk-sample-' + uuid.v4();
// Create name for uploaded object key
var keyName = 'hello_world.txt';

AWS.config.region = 'eu-central-1';

console.log(process.env[0]);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

rl.question('MFA Code:', (answer) => {
// TODO: Log the answer in a database
console.log(`Thank you for your valuable feedback: ${answer}`);
sts.assumeRole({
    RoleArn: 'arn:aws:iam::123456789:role/Developer',
    RoleSessionName: 'awssdkk',
    Policy: "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"Stmt1\",\"Effect\":\"Allow\",\"Action\":\"s3:ListAllMyBuckets\",\"Resource\":\"*\"}], \"Condition\": {\"Bool\": {\"aws:MultiFactorAuthPresent\": true}}", 
    SerialNumber: 'NRD90M.G891AUCU2BQB2',
    TokenCode: answer
  
  }, function(err, data) {
    if (err) { // an error occurred
      console.log('Cannot assume role');
      console.log(err, err.stack);
    } else { // successful response
      AWS.config.update({
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken
      });
    }
  });
rl.close();
});
  
var sts = new AWS.STS();



// Create a promise on S3 service object
var bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();

// Handle promise fulfilled/rejected states
bucketPromise.then(
  function(data) {
    // Create params for putObject call
    var objectParams = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
    // Create object upload promise
    var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
    uploadPromise.then(
      function(data) {
        console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
      });
}).catch(
  function(err) {
    console.error(err, err.stack);
});
