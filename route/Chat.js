import express from 'express';
import {GetChat,CreateChat} from '../Controller/Chat.js';

let router = express.Router();

router.post('/getchat', GetChat);
router.post('/createchat', CreateChat);


export default router;