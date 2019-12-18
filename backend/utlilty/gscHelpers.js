const fs = require('fs')
const path = require('path')
const Blob = require('blob')
const { Storage } = require('@google-cloud/storage');

const keyFilename = path.join(process.cwd(), "/backend/blog-22a3a-firebase-adminsdk-pf3ip-1a3f4196aa.json"); //replace this with api key file
const projectId = "blog-22a3a" //replace with your project id
const DEFAULT_BUCKET_NAME = `${projectId}.appspot.com`;

const storage = new Storage({ keyFilename: keyFilename, projectId: projectId });

function getPublicUrl(bucketName, filename) {
    return `https://storage.googleapis.com/${bucketName}/${filename}`;
}


module.exports.uploadFile = function (file, bucketName = null) {

    bucketName = bucketName || DEFAULT_BUCKET_NAME;
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${Date.now()}-${file.originalname}`;
    const gscFile = bucket.file(gcsFileName);

    const stream = gscFile.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    return new Promise((resolve, reject) => {
        stream.on('error', (err) => {
            reject(err);
        });

        stream.on('finish', () => {
            return gscFile.makePublic()
                .then(() => {
                    resolve(gcsFileName)
                })
        });

        stream.end(file.buffer); process.env
    })
}

module.exports.downloadFile = function (fileName, bucketName = null) {
    return new Promise((res, rej) => {
        bucketName = bucketName || DEFAULT_BUCKET_NAME;
        storage.bucket(bucketName)
            .file(fileName)
            .download()
            .then((buffer) => { res(buffer.toString()) })
            .catch((err) => { rej(err) })
    });
}