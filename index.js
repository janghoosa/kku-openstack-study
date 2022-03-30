const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const template = require("./modules/template.js");

app.set("port", port);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const objectStorage = require("./routes/objectStorage.js");
const fileSystem = require("./routes/fileSystem.js");
const cdn = require("./routes/cdn.js");
const rds = require("./routes/rds.js");

app.use("/os", objectStorage);
app.use("/fs", fileSystem);
app.use("/cdn", cdn);
app.use("/rds", rds);

app.get("/", (req, res, next) => {
    let data = `
    <a href="/fs"}>For Upload</a>
    <br>
    <br>
    <a href="/os">For Object Storage</a>
    <br>
    <br>
    <a href="/cdn">For CDN</a>
    <br>
    <br>
    <a href="/rds">For RDS</a>
    `;
    res.status(200).send(template.HTML(data));
});

app.all("*", (req, res, next) => {
    res.status(404).send(template.HTML("<h1> 404 ERROR </h1>"));
});

app.listen(port, () => console.log("Listening on", port));
