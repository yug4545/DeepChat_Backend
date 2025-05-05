import express from 'express';
import { signUp, login ,getAllUsers,Followeing, Follower, getFollowing} from '../Controller/Userr.js';

let router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/read', getAllUsers);
router.get('/following/:userId', getFollowing);
router.post('/followeing/:userid', Followeing);
router.post('/follower/:userid', Follower);

export default router;