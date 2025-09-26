# RAG Document Q&A System

A complete Retrieval-Augmented Generation (RAG) system that allows users to upload documents and ask questions about their content using AI.

## 🔄 Complete Flow

1. **Upload** → Parse documents (PDF, DOCX, TXT)
2. **Chunk** → Split into 500-character chunks
3. **Embed** → Generate embeddings using Gemini API
4. **Store** → Save chunks and embeddings in MongoDB
5. **Query** → User asks questions
6. **Retrieve** → Find most relevant chunks using similarity search
7. **Generate** → Use Gemini to generate answers with context
8. **Display** → Show results in clean UI

## 🚀 Features

- **Multi-format Support**: PDF, DOCX, and TXT files
- **Smart Chunking**: Optimal 500-character chunks for better context
- **Vector Search**: Cosine similarity for finding relevant content
- **AI-Powered Answers**: Gemini Pro for natural language responses
- **Source Attribution**: Shows which documents were used
- **Real-time Processing**: Live upload and query status
- **Clean UI**: Modern, responsive interface

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- Gemini API key from Google AI Studio

## 🛠️ Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on `mongodb://localhost:27017`

4. **Start the Backend Server**
   ```bash
   cd src/Backend
   node server.js
   ```

5. **Start the Frontend**
   ```bash
   npm start
   ```

## 🎯 How to Use

1. **Upload Documents**: Click the attachment icon and select PDF, DOCX, or TXT files
2. **Process Files**: Click "Upload Files" to process and store them
3. **Ask Questions**: Type your question in the input field
4. **Get Answers**: The AI will provide answers based on your documents

## 🏗️ Architecture

### Backend (`src/Backend/`)
- **server.js**: Express server with upload and query endpoints
- **utils.js**: Embedding generation, similarity calculation, and AI response
- **models/docChunk.js**: MongoDB schema for document chunks

### Frontend (`src/components/`)
- **Hero.jsx**: Main interface for file upload and querying
- **Header.jsx**: Navigation header
- **App.js**: Main application component

## 🔧 API Endpoints

- `POST /upload`: Upload and process documents
- `POST /query`: Ask questions about uploaded documents
- `GET /files`: List uploaded files
- `DELETE /documents`: Clear all documents

## 🎨 Technologies Used

- **Frontend**: React, Tailwind CSS, React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI**: Google Gemini API (embeddings + text generation)
- **File Processing**: pdf-parse, mammoth, express-fileupload

## 📝 Supported File Types

- **PDF**: Extracted using pdf-parse
- **DOCX**: Processed with mammoth
- **TXT**: Direct text reading

## 🔍 How It Works

1. **Document Processing**: Files are parsed and split into manageable chunks
2. **Embedding Generation**: Each chunk gets a vector representation using Gemini
3. **Storage**: Chunks and embeddings stored in MongoDB
4. **Query Processing**: User questions are embedded and compared to stored chunks
5. **Context Retrieval**: Top 5 most similar chunks are selected
6. **Answer Generation**: Gemini generates answers using the retrieved context

## 🚨 Troubleshooting

- **MongoDB Connection**: Ensure MongoDB is running on port 27017
- **API Key**: Verify your Gemini API key is correct in `.env`
- **File Upload**: Check file formats are supported (PDF, DOCX, TXT)
- **Server**: Make sure backend server is running on port 5000

## 📈 Future Enhancements

- Support for more file formats (PPT, Excel, etc.)
- Advanced chunking strategies
- Multiple embedding models
- Chat history
- Document management interface
- Deployment configurations