const express = require("express");
const router = express.Router();
const template = require("../modules/template.js");
const axios = require("axios");
const uploadOS = require("../modules/uploadOS.js");
const fs = require("fs");

const endpoint = process.env.endpoint;
const containerName = "/tjj";

const authHeader = (token) => {
    return {
        headers: {
            "X-Auth-Token": `${token}`,
        },
    };
};

const putHeader = (token, req) => {
    return {
        headers: {
            "X-Auth-Token": `${token}`,
            "Content-type": `${req.file.mimetype}`,
            "Content-Length": `${req.file.size}`,
        },
    };
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

const getListFromToast = async () => {
    let token = await getTokenFromToast();
    let getContainerURL = endpoint + containerName;
    // console.log(authHeader(token));
    let result = await axios.get(getContainerURL, authHeader(token));
    return result.data;
};

const putObjectToToast = async (req, res, next) => {
    let token = await getTokenFromToast();
    let url = endpoint + containerName + "/" + encodeURI(req.file.path);
    try {
        if (fs.existsSync(req.file.path)) {
            let file = fs.createReadStream(req.file.path);
            console.log(url);
            // const options = {
            //     method: "PUT",
            //     headers: {
            //         "X-Auth-Token": `${token}`,
            //         "Content-type": `${req.file.mimetype}`,
            //         "Content-Length": `${req.file.size}`,
            //     },
            //     data: file,
            //     url,
            // };
            // let result = axios(options);
            // console.log(result);
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

router.all("/", (req, res, next) => {
    res.redirect("/os/list");
});

router.all("/upload", (req, res, next) => {
    let data = `
        <h1> 업로드 페이지 입니다. </h1>
        <form action="/os/uploadFile" method="post" enctype="multipart/form-data">
        <input
            type="file" name="file" id="file" required="true" accept="*/*" />
        <input type="submit" />
    `;
    res.send(template.HTML(data));
});

router.all("/list", async (req, res, next) => {
    let data = `
    <h1> 리스트 </h1>
    <a href="/os/upload">Upload</a>
    <br>
    <br>
    `;
    let result = await getListFromToast();
    let list = result
        .filter((item) => item.name.substr(-1) != "/")
        .map((item) => item.name);
    list.forEach(
        (item) =>
            (data =
                data +
                '<a href="/os/download/' +
                item +
                '">' +
                item +
                "</a><br>")
    );
    res.send(template.HTML(data));
});

router.all("/uploadFile", uploadOS.single("file"), (req, res, next) => {
    console.log("upload file OS saved", req.file.filename);
    putObjectToToast(req, res, next);
});

router.all("/download/:path/:file", (req, res, next) => {
    let path = req.params.path;
    let file = req.params.file;
    let url = endpoint + containerName +'/' + path +'/' + file;
    res.redirect(url);
})

module.exports = router;
