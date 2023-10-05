const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const db = require("./db/db.json");
//all the dependencies and express set up
// for generating unique identifiers
// const uuid = require('uuid');
//  const uuidv4 = uuid.v4;

const { v4: uuidv4 } = require("uuid");

// const myUuid = uuidv4(); // Generates a new UUID using the v4 method
// console.log(myUuid)

//reference public folder
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API routes
// GET / POST / DELETE
// Get route
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      // Handle any potential errors when reading the file
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while reading the file." });
      return;
    }
    try {
      const dbNote = JSON.parse(data);
      res.json(dbNote);
      console.log("refreshed");
    } catch (parseError) {
      // Handle any potential JSON parsing errors
      console.error(parseError);
      res
        .status(500)
        .json({ error: "An error occurred while parsing the JSON data." });
    }
  });
});

// Post
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  console.log("note");
  // Generate a unique ID for the new note
  newNote.id = uuidv4(); // Call the uuid.v4 function

  // Push the new note to the database
  db.push(newNote);

  // Write the updated database back to the JSON file
  fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while saving the note." });
      return;
    }
    console.log("Note saved successfully");
    res.json(db);
  });
});

// Delete

app.delete("/api/notes/:id", (req, res) => {
  const newDB = db.filter((note) => note.id !== req.params.id);
  fs.writeFileSync("./db/db.json", JSON.stringify(newDB))
  readFile.json(newDB);
});

// app.delete('/api/notes/:id', (req, res) => {
//   const newDb = db.filter((note) =>
//       note.id !== req.params.id)

//   // update the db.json file to reflect the modified notes array
//   fs.writeFileSync('./db/db.json', JSON.stringify(newDb))

//   // send that removed note object back to user
//   readFile.json(newDb)
  


// home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.listen(PORT, () => {
  console.log(`App live on port: http://localhost:${PORT}`);
});
