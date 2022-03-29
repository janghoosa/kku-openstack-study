const express = require("express");
const router = express.Router();
const template = require("../modules/template.js")

router.all("/", (req, res, next) => {
    res.send(template.HTML("Hi"));
});

router.all("/list", (req, res, next) => {
    

    res.send(template.HTML("List"));
});

router.all("/uploadFile", (req, res, next) => {
    
});

module.exports = router;