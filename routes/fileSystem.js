const express = require("express");
const router = express.Router();
const template = require("../modules/template.js");
const uploadFS = require("../modules/uploadFS.js");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

router.all("/", (req, res, next) => {
    res.redirect("/fs/list");
});

router.all("/upload", (req, res, next) => {
    let data = `
        <h1> 업로드 페이지 입니다. </h1>
        <form action="/fs/uploadFile" method="post" enctype="multipart/form-data">
        <input
            type="file" name="file" id="file" required="true" accept="*/*" />
        <input type="submit" />
    `;
    res.send(template.HTML(data));
});

router.all("/list", (req, res, next) => {
    let data = `
    <h1> 리스트 </h1>
    <a href="/fs/upload">Upload</a>
    <br>
    <br>
    `;
    if (fs.existsSync("./files")) {
        let files = fs.readdirSync("./files");
        files.forEach(item => data = data + '<a href="/fs/download/' + item + '">'+item+'</a><br>');
    }
    res.send(template.HTML(data));
});

router.all("/uploadFile", uploadFS.single("file"), (req, res, next) => {
    console.log("uploadfile FS",req.file.originalname);
    res.redirect("/fs/list");
});

router.all("/download/:file", (req, res, next) => {
    const params = req.params.file;
    const filefolder = './files/';
    const file = filefolder + params;
    // console.log(params);
    try {
        if (fs.existsSync(file)) {
            let filename = path.basename(file);
            let mimetype = mime.getType(file);
            console.log(filename);
            res.setHeader('Content-Disposition', 'attachment; filename='+encodeURI(filename));
            res.setHeader('Content-type', mimetype);
            
            let fileStream = fs.createReadStream(file);
            fileStream.pipe(res);
            
        } else {
            // res.redirect("/fs/list");
        }
    } catch (e) {
        console.log(e);
        // res.redirect("/fs/list");
    }
})

module.exports = router;