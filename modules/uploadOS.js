const multer = require("multer");

const uploadOS = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, `./files/`);
        },
        filename(req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    })
});

module.exports = uploadOS;