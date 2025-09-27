import mongoose from "mongoose";

const docChunkSchema = new mongoose.Schema({
    filename: String,
    chunk: String,
    embedding: [Number],
}, {
    timestamps: true
});

