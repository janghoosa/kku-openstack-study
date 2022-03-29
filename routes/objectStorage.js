const express = require("express");
const router = express.Router();
const template = require("../modules/template.js")
const upload = require("../modules/uploadOS.js");


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

router.all("/list", (req, res, next) => {
    let data = `
    <h1> 리스트 </h1>
    <a href="/os/upload">Upload</a>
    <br>
    <br>
    `;
    res.send(template.HTML(data));
});

router.all("/uploadFile", upload.single("file"), (req, res, next) => {
    console.log(req.file);
    res.redirect("/os/list");
});

module.exports = router;