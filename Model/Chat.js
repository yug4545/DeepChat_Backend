import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: { type: String, required: true },
    read: { type: Boolean, default: false },
    time: { type:String }
  });

const ChatSchema = new mongoose.Schema({

    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
    date: { type: Date, default: Date.now }

});

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;