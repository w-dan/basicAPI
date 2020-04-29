var express = require("express");
var mongoskin = require("mongoskin");
var bodyParser = require("body-parser");

var app = express();

var db = mongoskin.db("mongodb://@localhost:27017/tesdata", {safe: true});
var id = mongoskin.helper.toObjectID;

var allowMethods = function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
}

var allowCrossTokenHeader = function(req, res, next) {
    res.headers("Acess-Control-Allow-Header", "token");
};

var auth = function(req, res, next) {
    if(req.header.token === "password12345") {
        return next();
    } else {
        return next(new Error("Unauthorised"));
    }
};

// http://localhost:8080/api/:collection/:id

app.param("Collection", function(eq, res, next, collection) {
    req.collection = db.collection(collection);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(allowMethods);
app.use(allowCrossTokenHeader);

// POST
app.post("/api/:collection", auth, function(req, res, next) {
    req.collection.insert(req.body, {}, function(err, result) {
        if(err) return next(err);
         res.send(result);
    });
});

// GET
app.get("/api/:collection", auth, function(req, res, next) {
    req.collection.find(req.body, {}, {limit: 10, sort: [['_id', -1]]}).toArray(function(err, results) {
        if(err) return next(err);
         res.send(results);
    });
});

app.get("/api/collection/:id", function(req, res, next) {
    req.collection.findOne({_id: id(req.params.id)}, function(err, result) {
        if(err) return next(err);
         res.send(result);
    });
});

// PUT
app.put("/api/:collection/:id", auth, function(req, res, next) {
    req.collection.update({_id: id(req.params.id)}, {$set: req.body}, {safe: true, multi: false}, function(err, result) {
        if(err) return next(err);
         res.send((result == 1) ? {result: "ok"} : {result: "ko"});
    });
});

// DELETE
app.delete("/api/:collection/:id", auth, function(req, res, next) {
    req.collection.remove({_id: id(req.params.id)}, function(err, result) {
        if(err) return next(err);
         res.send((result == 1) ? {result: "ok"} : {result: "ko"});
    });
});

app.listen(8080, function() {
    console.log("Server listening in port 8080");
});