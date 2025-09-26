import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import {chunkText , getEmnbeddings} from  "./utils.js"
import { docChunk } from '../models/docChunk.js';




const app = express();
app.use(express.json());
app.use(fileUpload());

mongoose.connect("mongodb://localhost:27017/docs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.post("/upload", async (req, res) => {
  if (!req.files || !req.files.files) {
    return res.status(400).send("No files uploaded.");
  }

  const files = Array.isArray(req.files.files)
    ? req.files.files
    : [req.files.files];

  for (let file of files) {
    let text = "";

    if (file.name.endsWith(".pdf")) {
      const dataBuffer = file.data;
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: file.data });
      text = result.value;
    } else if (file.name.endsWith(".txt")) {
      text = file.data.toString("utf-8");
    }

    const chunks = chunkText(text, 500); // split into 500-char chunks

    for (let chunk of chunks) {
      const embedding = await getEmbedding(chunk); // generate embedding
      const docChunk = new DocChunk({ filename: file.name, chunk, embedding });
      await docChunk.save();
    }
  }

  res.json({ status: "success", message: "Files uploaded and stored with embeddings." });
});

app.listen(5000, () => console.log("Server running on port 5000"));