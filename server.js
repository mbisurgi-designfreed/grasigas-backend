var express = require('express');
var mongodb = require('mongodb');
var parser = require('body-parser');

var app = express();
var ObjectID = mongodb.ObjectID;
var db;

mongodb.MongoClient.connect('mongodb://localhost:27017/grasi-gas', (err, database) => {
    if (err) {
        var e = {
            code: err.code,
            name: err.name,
            message: err.message,
            stacktrace: err.stack
        }

        console.log(e);
    } else {
        console.log('Connected successfully to database server');

        db = database;

        app.listen(3000, () => {
            console.log('Express started successfully, listening on port 3000');
        });
    }
});

app.use(parser.urlencoded({extended: true}));
app.use(parser.json())

app.get('/api/choferes', (req, res) => {
    db.collection('choferes').find({}).toArray((err, docs) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 200;
            res.json(docs);
        }
    });
});

app.post('/api/choferes', (req, res) => {
    var newChofer = req.body;

    db.collection('choferes').insertOne(newChofer, (err, r) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 201;
            res.json(r);
        }
    });
});

app.get('/api/choferes/:dni', (req, res) => {
    var dni = req.params.dni;

    db.collection('choferes').findOne({dni: dni}, (err, doc) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 200;
            res.json(doc);
        }
    });
});

app.put('/api/choferes/:dni', (req, res) => {
    var updatedChofer = req.body;
    var dni = req.params.dni;

    db.collection('choferes').updateOne({dni: dni}, {$set: updatedChofer}, (err, doc) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 200;
            res.json(doc);
        }
    });
});

app.delete('/api/choferes/:dni', (req, res) => {
    var dni = req.params.dni;

    db.collection('choferes').deleteOne({dni: dni}, (err, doc) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 200;
            res.json(doc);
        }
    });
});

app.get('/api/movimientos', (req, res) => {
    var desde = req.query.desde
    var hasta = req.query.hasta;

    db.collection('movimientos').find({fecha: {$gte: desde, $lte: hasta}}).toArray((err, docs) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 200;
            res.json(docs);
        }
    });
});

app.post('/api/movimientos', (req, res) => {
    req.body.choferId = new ObjectID(req.body.choferId);
    
    var newMovimiento = req.body;

    db.collection('movimientos').insertOne(newMovimiento, (err, r) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 201;
            res.json(r);
        }
    });
});

app.get('/api/movimientos/:choferId', (req, res) => {
    var id = new ObjectID(req.params.choferId);
    var desde = req.query.desde;
    var hasta = req.query.hasta;

    db.collection('movimientos').find({fecha: {$gte: desde, $lte: hasta}, choferId: id}).toArray((err, docs) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 200;
            res.json(docs);
        }
    });
});

app.put('/api/movimientos/:choferId', (req, res) => {
    var id = new ObjectID(req.params.choferId);
    var fecha = req.body.fecha;
    var updatedMovimiento = req.body;

    db.collection('movimientos').updateOne({fecha: fecha, choferId: id}, {$set: updatedMovimiento}, {upsert: true}, (err, doc) => {
        if (err) {
            res.statusCode = 500;

            var e = {
                code: err.code,
                name: err.name,
                message: err.message,
                stacktrace: err.stack
            }

            res.json(e);
        } else {
            res.statusCode = 200;
            res.json(doc);
        }
    });
});