import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserforSideBar = async (req,res) => {
    try {

        const users = await User.find({_id:{$ne:req.user._id}}).select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        console.log("error in getUserforSideBar controller",error.message)
        res.status(500).json("internal server error")
    }
}
export const getMessages = async (req,res) => { 
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        }).sort({createdAt:1});
        res.status(200).json(messages);
    }
    catch (error) {
        console.log("error in getMessages controller",error.message)
        res.status(500).json("internal server error")
    
    }
}
export const sendMessage = async (req,res) => {
    try {
        const {id:receiverId} = req.params;
        const {text,image} = req.body;
        const senderId = req.user._id;

        let imageURL;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }
       const newMessage = new Message ({
        senderId,
        receiverId,
        text,
        image:imageURL
       
       })
       await newMessage.save();

       const receiverSocketId = getReceiverSocketId(receiverId);
       if(receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage",newMessage);
       }
       res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("error in sendMessage controller",error.message)
        res.status(500).json("internal server error")
        
    }
}