const multer = require("multer");
const ObjectStorage = require("./MulterObjectStorage")

const uploadOS = multer({
    storage: ObjectStorage({
        destination(req, file, cb) {
            cb(null, `./files/`);
        }
    })
});

module.exports = uploadOS;