const multer = require("multer");

const uploadFS = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, './files/');
        },
        filename(req, file, cb) {
            cb(null, Date.now()+file.originalname);
        }
    })
});

module.exports = uploadFS;