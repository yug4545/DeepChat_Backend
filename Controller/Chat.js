import Chat from '../Model/Chat.js'


export const GetChat = async (req, res) => {

    try {

         let  {sender,receiver} = req.body;

         let chat = await Chat.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        });


          if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
          }

        res.status(200).json({
            messages: "Successfull",
            chat
        });


    } catch (error) {
        console.log(error.message)
    }
};

               
export const CreateChat = async (req, res) => {
    try {
      const { sender, receiver, text } = req.body;
  
      let chat = await Chat.findOne({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender }
        ]
      });
  
      const message = {
        sender,
        messages: text, 
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        read: false
      };
  
      if (chat) {
        chat.messages.push(message);
        await chat.save();
        return res.status(200).json(chat);
      }
  
      const newChat = new Chat({
        sender,
        receiver,
        messages: [message]
      });
  
      const savedChat = await newChat.save();
      res.status(201).json(savedChat);
  
    } catch (error) {
      console.error("Error creating chat:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  