const fs = require('fs');
const aws = require('aws-sdk');
aws.config.update({
    accessKeyId:'AKIAWJ46WHK4BLDIOUVS',
    secretAccessKey:'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',
    region:'ap-southeast-3'
});

const s3 = new aws.S3({
    apiVersion:"2023-05-28",
    params:{
        Bucket:"cahsierinstorage"}
});

async function uploadFile(file) {
    const fileContent = fs.readFileSync(file.path); //lakukan pengambilan(baca) pada file kiriman
    return new Promise((resolve, reject) => {
        const options = { partSize: 10 * 1024 * 1024, queueSize: 1 }; //10mb
        const params = { //params yang akan dikirimkan
          Bucket: "cahsierinstorage",
          Key: file.filename,
          Body: fileContent, // file
          ContentType: file.headers['content-type']
        };
    
        s3.upload(params, options, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    }

    module.exports = uploadFile