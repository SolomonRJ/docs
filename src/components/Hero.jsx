import React, { useState, useRef } from "react";
import { GoUpload } from "react-icons/go";
import { RiAttachment2 } from "react-icons/ri";
import { FaRegFileAlt, FaSpinner } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Hero() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const fileInputRef = useRef(null);

  function handleChange(e) {
    setInput(e.target.value);
  }

  function handleAttachmentClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
        setFiles([]);
        alert('Files uploaded successfully!');
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Make sure the server is running.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleQuery() {
    if (!input.trim()) return;

    setIsQuerying(true);
    setQueryResult(null);

    try {
      const response = await fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setQueryResult(result);
      } else {
        alert('Query failed: ' + result.error);
      }
    } catch (error) {
      console.error('Query error:', error);
      alert('Query failed. Make sure the server is running.');
    } finally {
      setIsQuerying(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        {/* Uploaded files section */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Uploaded Documents</h3>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((fileName, index) => (
                <div
                  key={index}
                  className="bg-green-100 border border-green-300 rounded-lg px-3 py-2 flex items-center gap-2 text-sm"
                >
                  <FaRegFileAlt className="text-green-600" />
                  <span className="text-green-800">{fileName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files to upload */}
        {files.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Files to Upload</h3>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <GoUpload />
                    Upload Files
                  </>
                )}
              </button>
            </div>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <FaRegFileAlt className="text-blue-600" />
                    <span className="text-blue-800">{file.name}</span>
                    <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Query result */}
        {queryResult && (
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Answer</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{queryResult.answer}</p>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Sources:</strong> {queryResult.sources.join(', ')}
                  </div>
                  <div>
                    <strong>Relevant chunks:</strong> {queryResult.relevantChunks}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-4 shadow-lg">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.docx,.txt"
            className="hidden"
          />

          {/* Input with icons */}
          <div className="flex gap-2">
            <button
              onClick={handleAttachmentClick}
              className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Attach files"
            >
              <RiAttachment2 size={20} />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ask anything about your documents..."
                value={input}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={isQuerying}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <button
              onClick={handleQuery}
              disabled={!input.trim() || isQuerying || uploadedFiles.length === 0}
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isQuerying ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <GoUpload />
                  Ask
                </>
              )}
            </button>
          </div>

          {uploadedFiles.length === 0 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Upload documents first to start asking questions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}