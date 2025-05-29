import { Error } from 'mongoose';
import User from '../Model/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

// SIGN UP
export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  try {
    const existingUser = await User.findOne({ email });


    if (existingUser) return res.status(400).json({ message: 'User already exists' });


    const newUser = await User.create({
      username,
      email,
      password,
    });

    console.log("HEloo");



    res.status(201).json(
      {
        message: 'User signup successfully',
        newUser,
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { EmailorUsername, password } = req.body;

  let username = "";
  let email = EmailorUsername.includes('@');

  if (condition) {
    username = EmailorUsername;
  }

  try {
    const user = await User.findOne({
      $or: [
        { email: EmailorUsername },
        { username: EmailorUsername }
      ]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, "yug-token");


    res.status(200).json({ message: 'Login successful', user, token });

  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (err) {
    res.status(500).json({ error: 'Fetching users failed', details: err.message });
  }
};

export const Followeing = async (req, res) => {
  const { currentUserId } = req.body; // The one who's following
  const targetUserId = req.params.userid; // The one being followed

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyFollowing = currentUser.isFollowing.includes(targetUserId);

    if (alreadyFollowing) {
      // ❌ Unfollow
      currentUser.isFollowing.pull(targetUserId);
      targetUser.isFollower.pull(currentUserId);
    } else {
      // ✅ Follow
      currentUser.isFollowing.push(targetUserId);
      targetUser.isFollower.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: alreadyFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !alreadyFollowing,
      currentUser
    });

  } catch (error) {
    res.status(500).json({ message: 'Error in following/unfollowing', details: error.message });
  }
};

export const getFollowing = async (req, res) => {
  const { userId } = req.params;


  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch following list', details: error.message });
  }
};

export const Follower = async (req, res) => {

  let userid = req.params.userid

  try {
    let user = await User.findByIdAndUpdate(userid, { $inc: { isFollower: 1 } }, { new: true });

    res.status(200).json({ message: 'Following user successfully', user });

  } catch (error) {
    res.status(500).json({ message: 'Error in followeing', details: error.message });
  }
};