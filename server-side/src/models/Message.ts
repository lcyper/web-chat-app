import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    content: String,
    sender: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  export default mongoose.model('Message', MessageSchema);