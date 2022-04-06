const express = require("express");
const router = express.Router();
const template = require("../modules/template.js");
const toast = require("../modules/toast.js");
const uploadOS = require("../modules/uploadOS.js");
const uploadFS = require("../modules/uploadFS.js");
const fs = require("fs");

const endpoint = process.env.endpoint;
const containerName = "/tjj";

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
    let result = await toast.getListFromToast();
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

router.all("/uploadFileFS", uploadFS.single("file"), (req, res, next) => {
    console.log("upload file OS saved", req.file.filename);
    toast.putObjectToToast(req, res, next);
});

router.all("/uploadFile", uploadOS.single("file"), (req, res, next) => {
    console.log("upload file OS saved", req.file.filename);
    res.redirect("/os/list");
});

router.all("/download/:path/:file", (req, res, next) => {
    let path = req.params.path;
    let file = req.params.file;
    let url = endpoint + containerName +'/' + path +'/' + file;
    res.redirect(url);
})

module.exports = router;
