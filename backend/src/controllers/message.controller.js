import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const extractPublicIdFromCloudinaryUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const uploadMarker = "/upload/";
    const uploadIndex = parsed.pathname.indexOf(uploadMarker);
    if (uploadIndex === -1) return null;

    let publicPath = parsed.pathname.slice(uploadIndex + uploadMarker.length);
    publicPath = publicPath.replace(/^v\d+\//, "");
    publicPath = publicPath.replace(/\.[^/.]+$/, "");
    return decodeURIComponent(publicPath);
  } catch {
    return null;
  }
};

export const getAllContacts = async (req, res) => {
  try {
    // we need all Users but not  loggedInUser in contacts list so will filter loggedInUser
    const loggedInUserById = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserById },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { receiverId: myId, senderId:userToChatId  },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverUser = await User.findById(receiverId)
      .select("_id fullName profilePic")
      .lean();
    if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found." });
    }
    let imageURL;
    let imagePublicId;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image,{
      folder: "QuickChat/ChatImages"
    });
      imageURL = uploadResponse.secure_url;
      imagePublicId = uploadResponse.public_id;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
      imagePublicId,
    });

 await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", {
            ...newMessage.toObject(),
            chatPartner: {
              _id: req.user._id,
              fullName: req.user.fullName,
              profilePic: req.user.profilePic,
            },
          });
        }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserById = req.user._id;
    // getting all the messages which senderId and receverId is === to logged In User
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserById }, { receiverId: loggedInUserById }],
    });
    // getting unique id for all message in an array
    const chatPartnersIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserById.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    // getting all the users we send or recived message from
    const chatPartners = await User.find({
      _id: { $in: chatPartnersIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteConversation = async (req,res) => {
 try {
   const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const filter = {
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { receiverId: myId, senderId:userToChatId  },
      ],
    };

    const messagesToDelete = await Message.find(filter).select("image imagePublicId");
    const publicIds = [
      ...new Set(
        messagesToDelete
          .map((msg) => msg.imagePublicId || extractPublicIdFromCloudinaryUrl(msg.image))
          .filter(Boolean),
      ),
    ];

    if (publicIds.length > 0) {
      await Promise.allSettled(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
      );
    }

    const result = await Message.deleteMany(filter);

     res.status(200).json(result);

 } catch (error) {
  console.log("Error in deleteConversation controller:", error);
    res.status(500).json({ message: "Internal server error" });
 }
}
