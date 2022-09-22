const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);

app.use(express.static("public"));

// app.get('/', (req,res) =>
//     res.sendFile(path.join(__dirname, '/public/index.html'))
// );

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    }
    return;
  });
});

app.post("/api/notes", (req, res) => {
  let getNotes = JSON.parse(fs.readFileSync("./db/db.json"));
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuid(),
  };
  getNotes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(getNotes, null, 4));
  res.json(getNotes);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
