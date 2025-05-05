import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  SocketID: { type: String, required: true, unique: true },
  isFollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  isFollower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  isOnline:{type:Boolean,default:false}
});

const User = mongoose.model('User', userSchema);

export default User;
