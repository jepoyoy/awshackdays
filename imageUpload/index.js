const express = require('express')
const AWS = require('aws-sdk')
var bodyParser = require('body-parser')
const https = require("https")
const fs = require("fs")

const options = {
  key: fs.readFileSync("/home/jepoyoy/key.pem"),
  cert: fs.readFileSync("/home/jepoyoy/certificate.pem")
};

const app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// POST method route
app.post('/upload', urlencodedParser, function (req, res) {

// Configure AWS with your access and secret key. I stored mine as an ENV on the server
// ie: process.env.ACCESS_KEY_ID = "abcdefg"
AWS.config.update({ accessKeyId: "AKIAIHH4KXILGVTGRHGA", secretAccessKey: "7Z9TO+0fl7TgWV2ttPfNSEL1Rrs9NLIqsgGFKaZE" });

// Create an s3 instance
const s3 = new AWS.S3();

const faceImg = req.body.customerFace;
const idImg = req.body.customerId;

// Ensure that you POST a base64 data to your server.
// Let's assume the variable "base64" is one.
const base64Data = new Buffer(faceImg.replace(/^data:image\/\w+;base64,/, ""), 'base64')
const base64Data2 = new Buffer(idImg.replace(/^data:image\/\w+;base64,/, ""), 'base64')

// Getting the file type, ie: jpeg, png or gif
const type = faceImg.split(';')[0].split('/')[1]
const type2 = idImg.split(';')[0].split('/')[1]

// Generally we'd have a userId associated with the image
// For this example, we'll simulate one
const userId = Math.round(new Date().getTime()/1000);
const userId2 = Math.round(new Date().getTime()/1000) + '-id';

// With this setup, each time your user uploads an image, will be overwritten.
// To prevent this, use a unique Key each time.
// This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
const params = {
  Bucket: "loanapp-face",
  Key: `${userId}.png`, // type is not required
  Body: base64Data,
  ACL: 'public-read',
  ContentEncoding: 'base64', // required
  ContentType: `image/png` // required. Notice the back ticks
}

// The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
// see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
s3.upload(params, (err, data) => {
  if (err) { return console.log(err) }

  	const params = {
	  Bucket: "loanapp-id",
	  Key: `${userId2}.png`, // type is not required
	  Body: base64Data2,
	  ACL: 'public-read',
	  ContentEncoding: 'base64', // required
	  ContentType: `image/png` // required. Notice the back ticks
	}

	s3.upload(params, (err, data) => {
  	if (err) { return console.log(err) }
  		 // Continue if no error
		  // Save data.Location in your database
		  console.log('Image successfully uploaded.');
  	});
});
  

})

app.listen(3000, () => console.log('Example app listening on port 3000 - http only!'))

https.createServer(options, app).listen(8080);

app.use(express.static('public'))