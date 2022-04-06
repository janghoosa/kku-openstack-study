const axios = require("axios");
const fs = require("fs");

var token;
const endpoint = process.env.endpoint;
const containerName = "/tjj";

const authHeader = (token) => {
    return {
        headers: {
            "X-Auth-Token": `${token}`,
        },
    };
};

const getToken = async () => {
    console.log("get Token", token);
    if (token != null) return token;
    else {
        token = await getTokenFromToast();
        return token;
    }
};

exports.getToken = () => {
    console.log("get Token", token);
    if (token != null) return token;
    else {
        token = getTokenFromToast();
        return token;
    }
};

const getTokenFromToast = async () => {
    let tokenURL =
        "https://api-identity.infrastructure.cloud.toast.com/v2.0/tokens";

    let tokenHeader = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    let body = {
        auth: {
            tenantId: process.env.tenantId,
            passwordCredentials: {
                username: process.env.username,
                password: process.env.password,
            },
        },
    };
    let result = await axios.post(tokenURL, body, tokenHeader);
    console.log("os token:", result.data.access.token.id);
    return result.data.access.token.id;
};

exports.getListFromToast = async () => {
    let token = await getToken();
    if (token != null) {
        let getContainerURL = endpoint + containerName;
        // console.log(authHeader(token));
        let result = await axios.get(getContainerURL, authHeader(token));
        return result.data;
    } else {
        return "nothing";
    }
};

exports.putObjectToToast = async (req, res, next) => {
    let token = await getToken();
    let url = endpoint + containerName + "/" + encodeURI(req.file.path);
    try {
        if (fs.existsSync(req.file.path)) {
            let file = fs.createReadStream(req.file.path);
            console.log(url);
            let result = await axios.put(url, file, putHeader(token, req));
            // console.log(result.request.data);
            res.redirect("/os/list");
        } else {
        }
    } catch (e) {
        console.log(e);
        // res.send(e);
    }
};

exports.putDirectToToast = async (req, file, next) => {
    let token = await getToken();
    let url = endpoint + containerName + "/" + encodeURI(req.file.path);
    try {
        if (fs.existsSync(req.file.path)) {
            let file = fs.createReadStream(req.file.path);
            console.log(url);
            let result = await axios.put(url, file, putHeader(token, req));
            // console.log(result.request.data);
            res.redirect("/os/list");
        } else {
        }
    } catch (e) {
        console.log(e);
        // res.send(e);
    }
};
