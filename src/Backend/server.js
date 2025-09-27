import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import cors from 'cors';
import dotenv from 'dotenv';
import { chunkText, getEmbeddings, cosineSimilarity, generateAnswer } from './utils.js';
import { docChunk } from '../models/docChunk.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/docs";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Atlas connected successfully"))
.catch(err => console.error(err));

// Upload and process documents
app.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.files) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];

    let processedFiles = 0;

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
      } else {
        continue; // Skip unsupported file types
      }

      const chunks = chunkText(text, 500);

      for (let chunk of chunks) {
        try {
          const embedding = await getEmbeddings(chunk);
          const newDocChunk = new docChunk({ 
            filename: file.name, 
            chunk, 
            embedding 
          });
          await newDocChunk.save();
        } catch (error) {
          console.error(`Error processing chunk for ${file.name}:`, error);
        }
      }
      processedFiles++;
    }

    res.json({ 
      status: "success", 
      message: `${processedFiles} files uploaded and processed with embeddings.` 
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process files" });
  }
});

// Query documents
app.post("/query", async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Get query embedding
    const queryEmbedding = await getEmbeddings(query);

    // Get all document chunks
    const allChunks = await docChunk.find({});

    // Calculate similarities and get top 5 most relevant chunks
    const similarities = allChunks.map(chunk => ({
      ...chunk.toObject(),
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    const topChunks = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    // Create context from top chunks
    const context = topChunks.map(chunk => chunk.chunk).join('\n\n');

    // Generate answer using Gemini
    const answer = await generateAnswer(context, query);

    // Create summary of sources
    const sources = [...new Set(topChunks.map(chunk => chunk.filename))];

    res.json({
      status: "success",
      answer,
      sources,
      relevantChunks: topChunks.length,
      context: context.substring(0, 500) + "..." // Preview of context
    });

  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ error: "Failed to process query" });
  }
});

// Get uploaded files list
app.get("/files", async (req, res) => {
  try {
    const files = await docChunk.distinct("filename");
    res.json({ status: "success", files });
  } catch (error) {
    console.error("Files error:", error);
    res.status(500).json({ error: "Failed to get files" });
  }
});

// Delete all documents
app.delete("/documents", async (req, res) => {
  try {
    await docChunk.deleteMany({});
    res.json({ status: "success", message: "All documents deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete documents" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));