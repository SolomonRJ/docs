import React, { useState, useRef } from "react";
import { GoUpload } from "react-icons/go";
import { RiAttachment2 } from "react-icons/ri";
import { FaRegFileAlt } from "react-icons/fa";

export default function Hero() {
  const [input, setInput] = useState("");
  const [file, setFile] = useState([]);
  const fileinputref = useRef(null);

  function handleChange(e) {
    setInput(e.target.value);
  }

  function handleAttachmentClick() {
    fileinputref.current.click();
  }

  function handleFileChange(e) {
    const selectedFile = Array.from(e.target.files);
    setFile((prev) => [...prev, ...selectedFile]); // append files
    console.log("uploaded file ", selectedFile);
  }

  return (
    <div className="h-screen flex flex-col">                                                                                                                                                                                                                                                              
      {/* File list area (scrollable content) */}
      <div className="flex-1 overflow-y-auto p-5">
        {file.length > 0 && (
          <div className="space-y-2">
            {file.map((f) => (
              <div
                key={f.name}
                className=" rounded px-3 py-1 flex items-center gap-2 text-sm"
              >
                <FaRegFileAlt className="text-gray-600" />
                {f.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-3">
        <div className="relative w-full max-w-2xl mx-auto">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileinputref}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />

          {/* Input with icons */}
          <RiAttachment2
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={handleAttachmentClick}
          />

          <input
            type="text"
            placeholder="ask anything about your docs"
            value={input}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="absolute right-1 top-1/2 -translate-y-1/2 text-blue-500 p-1 hover:bg-blue-100 rounded">
            <GoUpload />
          </button>
        </div>
      </div>
    </div>
  );
}
