const express = require("express");
const fs = require("fs");
const path = require("path");
var notes = require(path.join(__dirname, "/db/db.json"));
const { nanoid } = require("nanoid");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function validateNote(note) {
    if (!note.title || typeof note.title !== "string") {
        return false;
    }
    if (!note.text || typeof note.title !== "string") {
        return false;
    }
    return true;
}

function createNote(body, noteArray) {
    noteArray.push(body);
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(noteArray, null, 2)
    );

    return body;
}

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.json(notes);
});

app.post("/api/notes", (req, res) => {
    req.body.id = nanoid(7);

    if (!validateNote(req.body)) {
        res.status(400).send("Please include a title and text in your note.");
    } else {
        const note = createNote(req.body, notes);
        res.json(note);
    }
})

app.delete("/api/notes/:id", (req, res) => {
    var tempArray = [];
    var idMatched = false;

    notes.forEach(note => {
        if (req.params.id === note.id) {
            idMatched = true;
        } else if (req.params.id !== note.id) {
            tempArray.push(note);
        }
    });

    if (!idMatched) {
        res.status(400).send("Note could not be found.");
    }

    notes = tempArray;

    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notes, null, 2)
    );

    res.json(notes);
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server active on port ${PORT}`);
});