import React, { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";

// Create a context
const SocketContext = createContext();

// Socket URL
const socket = io("http://192.168.1.7:4000");

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [groupMessages, setGroupMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateMessage, setPrivateMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState("group");
  const [message, setMessage] = useState("");

  // Emit events and handle incoming socket messages
  useEffect(() => {
    const randomUsername = `User ${Math.floor(Math.random() * 1000)}`;
    setUsername(randomUsername);

    socket.emit("join", randomUsername);

    socket.on("receive_message", (data) => {
      setGroupMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("receive_private_message", (data) => {
      setPrivateMessages((prevMessages) => [
        ...prevMessages,
        { from: data.from, message: data.message },
      ]);
    });

    socket.on("update_users", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_private_message");
      socket.off("update_users");
    };
  }, []);

  useEffect(() => {
    let inactivityTimeout;

    const resetInactivity = () => {
      socket.emit("update_status", { username, status: "active" });
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        socket.emit("update_status", { username, status: "inactive" });
      }, 20000); // 20 seconds of inactivity
    };

    window.addEventListener("mousemove", resetInactivity);
    window.addEventListener("keydown", resetInactivity);

    socket.emit("update_status", { username, status: "active" });
    resetInactivity();

    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", resetInactivity);
      window.removeEventListener("keydown", resetInactivity);
    };
  }, [username]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessage("");
    }
  };

  const sendPrivateMessage = () => {
    if (privateMessage.trim() && targetUserId) {
      socket.emit("send_private_message", {
        targetSocketId: targetUserId,
        message: privateMessage,
        from: username,
      });
      setPrivateMessages((prevMessages) => [
        ...prevMessages,
        { from: "You", message: privateMessage },
      ]);
      setPrivateMessage("");
    }
  };

  return (
    <SocketContext.Provider
      value={{
        username,
        groupMessages,
        privateMessages,
        message,
        setMessage,
        privateMessage,
        setPrivateMessage,
        targetUserId,
        setTargetUserId,
        users,
        currentChat,
        setCurrentChat,
        sendMessage,
        sendPrivateMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
