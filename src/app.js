const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));
app.get('/new', (req, res) => res.sendFile(path.join(__dirname + '/new.html')));
app.get('/test', (req, res) => res.sendFile(path.join(__dirname + '/testLogo.html')));
app.get('/review', (req, res) => res.sendFile(path.join(__dirname + '/review.html')));
app.use('/visuals', express.static('visuals'));
app.use('/unscreened_visuals', express.static('unscreened_visuals'));
app.get('/visual', (req, res) => {
	let folder = req.query.folder;
	let file;
	if (folder === "all") {
		const paths = getAllFiles('./visuals/').filter( (file) => {return file.match(/.*\.(mp4)/ig);});
		const selection = paths[Math.floor(Math.random() * paths.length)];
		const split_path = selection.split('/');
		[folder, file] = split_path.slice(Math.max(split_path.length - 2, 1));
	} else {
		const files = fs.readdirSync(`./visuals/${folder}/`).filter( (file) => {return file.match(/.*\.(mp4)/ig);});
		file = files[Math.floor(Math.random() * files.length)];
	}
	res.json({ src: `http://localhost:3000/visuals/${folder}/${file}`});
});
app.get('/ls', (req, res) => {
	let folder = req.query.folder;
	const files = fs.readdirSync(`./unscreened_visuals/${folder}/`).filter( (file) => {return file.match(/.*\.(mp4)/ig);});
	let data = []
	files.forEach((item, i) => {
		data.push({src: `http://localhost:3000/unscreened_visuals/${folder}/${item}`,
		name: item});
	});
	res.json(data)
});
app.get('/rm', (req, res) => {
	let folder = req.query.folder;
	let file = req.query.file;
	fs.unlinkSync(`./unscreened_visuals/${folder}/${file}`)
});

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

app.listen(port, () => console.log(`Listening on port ${port}`));
