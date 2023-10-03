const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require("fs");
//all the dependencies and express set up
const app = express();
const PORT = process.env.PORT || 3001;

// for generating unique identifiers
const uuid = require('uuid');
// const uuidv4 = uuid.v4; 

//reference public folder
app.use(express.static('public')); 
app.use(express.json());

// API routes 
// GET / POST / DELETE 
// Get route 
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        // Handle any potential errors when reading the file
        console.error(err);
        res.status(500).json({ error: 'An error occurred while reading the file.' });
        return;
      }
      try {
        const db = JSON.parse(data);
        res.json(db);
      } catch (parseError) {
        // Handle any potential JSON parsing errors
        console.error(parseError);
        res.status(500).json({ error: 'An error occurred while parsing the JSON data.' });
      }
    });
  });
// Post
app.post('/api/notes/:id', (req, res) => {
    const newNote = req.body;
  
    // Generate a unique ID for the new note
    newNote.id = uuid.v4(); // Call the uuid.v4 function
  
    // Push the new note to the database
    db.push(newNote);
  
    // Write the updated database back to the JSON file
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while writing to the file.' });
      }
      // Send the updated database as a response
      res.json(db);
    });
  });
// Delete
app.delete('/api/notes/:id', async (req, res) => {
    try {
      // Read the current database from the file
      const data = await fs.readFile(dbFilePath, 'utf8');
      const db = JSON.parse(data);
  
      // Filter out the note with the specified ID
      const newDb = db.filter((note) => note.id !== req.params.id);
  
      // Write the updated database back to the JSON file
      await fs.writeFile(dbFilePath, JSON.stringify(newDb));
  
      // Send the updated database back to the user
      res.json(newDb);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
  });





// home page 
app.get('/', (req,res) =>  {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
// notes page 
app.get('/notes', (req,res) =>  {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.listen(PORT, () => {
    console.log(`App live on port: http://localhost:${PORT}`);
})


