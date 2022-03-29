const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const BUCKET_NAME = "tjj";

const s3 = new AWS.S3({
    accessKeyId: process.env.OS_ACCESS_KEY,
    secretAccessKey: process.env.OS_SECRET_KEY,
    region: "KR2",
    endpoint:"https://api-storage.cloud.toast.com/v1/AUTH_35682dae0076479ab712dbb328468535"
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, `image/${Date.now()}_${file.originalname}`);
        },
    }),
});

module.exports = upload;
