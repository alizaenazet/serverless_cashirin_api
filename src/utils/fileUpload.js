const fs = require('fs');
const aws = require('aws-sdk');
const { PutObjectCommand,S3Client,GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({region:"ap-southeast-3"})
//new S3 Config
 async function newUploadFile(file) {
    const fileContent = fs.readFileSync(file.path); //lakukan pengambilan(baca) pada file kiriman
        const options = { partSize: 10 * 1024 * 1024, queueSize: 1 }; //10mb
        const params = { //params yang akan dikirimkan
          Bucket: "cahsierinstorage",
          Key: file.filename,
          Body: fileContent, // file
          ContentType: file.headers['content-type']
        };
        try {
          const result = await s3Client.send(new PutObjectCommand(params))
          console.log("hasil upload response");
          console.log(result);
         const url = await getPresignedUrl(file.filename);
         return url
        } catch (error) {
          console.log(error);
        }

    }

    async function getPresignedUrl(key) {
      const params = {
        Bucket: 'cahsierinstorage',
        Key: key
      };
    
      try {
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command);
        return url;
      } catch (error) {
        console.log(error);
        return null;
      }
    }

    module.exports = {newUploadFile,getPresignedUrl}