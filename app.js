var express = require("express");
var serveIndex = require("serve-index");

var app = express();

app.get("/", function(req, res) {
  res.send("AllGoVision Analytics Logs");
});
var FolderPath = "C:/ProgramData/AllGoVision/";
app.use(express.static(FolderPath));
app.use("/logs", serveIndex(FolderPath));

var server = app.listen(8087, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
