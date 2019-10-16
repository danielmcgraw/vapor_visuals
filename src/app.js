const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

// /clips/{filename}
// /clips/random --any random
// /clips/random?kw=<keyword> --any random within the keyword folder

app.listen(port, () => console.log(`Listening on port ${port}`));
