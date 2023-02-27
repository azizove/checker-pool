import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const fs = require('fs');
const fileUpload = require('express-fileupload');


const app = express();

// Apply middlware for CORS and JSON endpoing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable file uploads middleware
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define file upload endpoint
app.post('/api/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const fileName = file.name;

  file.mv(`uploads/${fileName}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File uploaded successfully.');
  });
});

// Define file download endpoint
app.get('/api/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = `uploads/${fileName}`;

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found.');
  }

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

app.listen(process.env.PORT, () =>
  console.log(`Storage app listening on port ${process.env.PORT}!`),
);
