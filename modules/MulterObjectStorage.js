const toast = require("./toast.js");
const axios = require("axios");

const putHeader = (token, file) => {
    return {
        headers: {
            "X-Auth-Token": `${token}`,
            "Content-type": `${file.mimetype}`,
        },
    };
};
const endpoint = process.env.endpoint;
const containerName = "/tjj";

function ObjectStorage(opts) {
    this.getDestination = opts.destination;
}

ObjectStorage.prototype._handleFile = function _handleFile(req, file, cb) {
    this.getDestination(req, file, function (err, container) {
        if (err) {
            return cb(err);
        }
        let token = toast.getToken();
        let filename = encodeURI(Date.now() + "_" + file.originalname);
        let url = endpoint + containerName + container + filename;
        axios
            .put(url, file.stream, putHeader(token, file))
            .then((response) => {
                console.log("put file success");
                cb(null, {
                    filename: filename,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

ObjectStorage.prototype._removeFile = function _removeFile(req, file, cb) {};

module.exports = function (opts) {
    return new ObjectStorage(opts);
};
