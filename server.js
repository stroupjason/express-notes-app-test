// require needed modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

const app = express();

// setup PORT
const PORT = process.env.PORT || 8080;
// use express middleware to handle requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use the public directory
app.use(express.static(path.join(__dirname, 'public')));

// setup api-routes
app.get('/api/notes', function(req, res) {
    // read db.json file and parse data
    fs.readFile('./db/db.json', 'utf8', function(err, data) {
        if (err) throw err;
        let obj = JSON.parse(data);
        res.json(obj);
    });
});

app.post('/api/notes', function(req, res) {
    // create empty variable called obj
    let obj;

    fs.readFile('./db/db.json', 'utf8', function(err, data) {
        if (err) throw err;
        // create a variable called array that is parsed data from the db.json file
        const array = JSON.parse(data);
        // unique id with each note
        req.body.id = uniqid();
        let addNote = JSON.stringify(req.body);
        // push newnote to array
        array.push(JSON.parse(addNote));
        obj = JSON.stringify(array);
        // rewrite db.json file with new note
        fs.writeFile('./db/db.json', obj, function(err) {
            if (err) throw err;

            res.json(obj);
        });
    });

    // res.json(addNote)
});
app.delete('/api/notes/:id', function(req, res) {
    // variable notes equal to data from db.json file
    let notes = fs.readFileSync('./db/db.json', 'utf8');
    notes = JSON.parse(notes);
    // filter through notes to check id equals one selected
    notes = notes.filter(function(note) {
        return note.id != req.params.id;
    });
    notes = JSON.stringify(notes);
    // rewrite file without deleted item
    fs.writeFile('./db/db.json', notes, 'utf8', function(err) {
        if (err) throw err;
    });
    res.send(JSON.parse(notes));
});

// html-routes

app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// // my file was not reading the style or index.js files
// app.get("/assets/css/styles.css", function(req, res) {
//     res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"))
// });
// app.get("/assets/js/index.js", function(req, res) {
//     res.sendFile(path.join(__dirname, "/public/assets/js/index.js"))
// });

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, function() {
    console.log('App is listening on PORT ' + PORT);
});