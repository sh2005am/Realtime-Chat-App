import express from 'express'
import { protectRoute } from '../middleware/auth.middlewawre.js';
import { getUserforSideBar,getMessages,sendMessage } from '../controllers/message.controller.js';
const router=express.Router()
router.get("/users",protectRoute,getUserforSideBar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage)
export default router;