var express = require("express");
var path = require("path");
var del = require("del");
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");
var fs = require("fs");
var app = express();
var favicon = require("serve-favicon");
const archiver = require("archiver");

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", err => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve(1));
    archive.finalize();
  });
}

function filter(name) {
  var arr = ["ServiceSettings", "SIFU.log", "AllGoVisionLogs.zip"];
  if (arr.includes(name)) return false;
  return true;
}

var FolderPath = "C:/ProgramData/AllGoVision/";
app.use(
  "/",
  express.static(FolderPath),
  serveIndex(FolderPath, {
    icons: true,
    view: "details",
    filter: filter,
    stylesheet: "html/style.css",
    template: "html/directory.html"
  })
);
app.use(express.static(path.join(__dirname, "html")));
app.get("/download", function(req, res) {
  zipDirectory(FolderPath, FolderPath + "AllGoVisionLogs.zip")
    .then(result => {
      res.send("Download Completed.");
    })
    .catch(error => {
      res.status(400).send("Error:", error);
    });
});
app.all(
  "*/Rescue.ico",
  serveStatic(__dirname + "/html/icons/Rescue.ico", {
    fallthrough: false,
    lastModified: false,
    maxAge: "1y"
  })
);

var server = app.listen(8087, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
