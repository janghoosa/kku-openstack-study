const express = require("express");
const router = express.Router();
const template = require("../modules/template.js");
const mysql = require("mysql");
const dbconfig = {
    host: process.env.dbhost,
    port: "10000",
    user: "rehoosa",
    password: process.env.dbpw,
    database: "test",
};
const connection = mysql.createConnection(dbconfig);

router.all("/", (req, res, next) => {
    res.redirect("/rds/list");
});

router.all("/list", (req, res, next) => {
    let query = `select * from comment`;
    let data = `
    <h1> 리스트 </h1>
    <a href="/rds/createCommentPage">Create Comment</a>
    <br>
    <br>
    `;
    connection.query(query, (err, rows) => {
        if (err) console.log(err);
        if (rows != null) {
            console.log("rds/list");
            rows.forEach((item) => {
                data =
                    data +
                    '<a href="/rds/updateCommentPage/' +
                    item.id +
                    '">' +
                    item.id +
                    ":" +
                    item.comment +
                    "</a><br><br>";
            });
            res.send(template.HTML(data));
        } else {
            res.send(template.HTML("List"));
        }
    });
});

router.all("/createTable", (req, res, next) => {
    let query = `
    create table comment(
        id int primary key auto_increment,
        comment varchar(100) not null
    );`;
    connection.query(query, (err, rows) => {
        if (err) console.log(err);
        else console.log("createTable");
    });
});

router.all("/createCommentPage", (req, res, next) => {
    let data = `
        <h1> 업로드 페이지 입니다. </h1>
        <form action="/rds/createComment" method="post">
        <input type="text" name="comment"/>
        <input type="submit" />
    `;
    res.send(template.HTML(data));
});

router.all("/createComment", (req, res, next) => {
    let data = req.body.comment;
    let query = `
    insert into comment(comment) values
    ('${data}')
    ;`;
    connection.query(query, (err, rows) => {
        if (err) console.log(err);
        else console.log("createComment");
    });
    res.redirect("/rds/list");
});

router.all("/updateCommentPage/:id", (req, res, next) => {
    let id = req.params.id;
    let query = `select * from comment where id = ${id}`;
    connection.query(query, (err, rows) => {
        if (err) console.log(err);
        else {
            console.log("updateCommentPage");
            let data = `
                <h1> 업데이트 페이지 입니다. </h1>
                <form action="/rds/updateComment/${id}" method="post">
                <p>${id},${rows[0].comment}</p>
                <input type="text" name="comment"/>
                <input type="submit" />
            `;
            res.send(template.HTML(data));
        }
    });
});

router.all("/updateComment/:id", (req, res, next) => {
    let data = req.body.comment;
    let id = req.params.id;
    let query = `update comment set comment='${data}' where id=${id};`;
    connection.query(query, (err, rows) => {
        if (err) console.log(err);
        else console.log("updateComment");
    });
    res.redirect("/rds/list");
});

module.exports = router;
