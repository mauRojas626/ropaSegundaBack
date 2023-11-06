const S3 = require('@aws-sdk/client-s3')
require("dotenv").config();
const fs = require('fs')
const presigner = require('@aws-sdk/s3-request-presigner')

const client = new S3.S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        signatureVersion: 'v4',
        accessKeyId: process.env.S3_PUBLIC_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    }
})

async function uploadFile(file, name){
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: name,
        Body: file.data
    }

    const command = new S3.PutObjectCommand(uploadParams)
    const result = await client.send(command)
    return result
}

async function getPhoto(filename){
    const command = new S3.GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename
    })
    const url = await presigner.getSignedUrl(client, command, { expiresIn: 36000 })
    //const result = await client.send(command)
    //result.Body.pipe(fs.createWriteStream(`../images/${filename}`))
    return url
}

async function deletePhoto(filename){
    const command = new S3.DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename
    })
    const result = await client.send(command)
    return result
}
module.exports = { uploadFile, getPhoto, deletePhoto };