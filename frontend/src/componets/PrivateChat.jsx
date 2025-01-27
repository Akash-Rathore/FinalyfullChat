import React from "react";
import { useSocket } from "../SocketContext";

function PrivateChat() {
  const {
    privateMessages,
    privateMessage,
    setPrivateMessage,
    sendPrivateMessage,
    users,
    targetUserId,
    setTargetUserId,
  } = useSocket();

  return (
    <div className="private-chat-container">
      <select
        value={targetUserId}
        onChange={(e) => setTargetUserId(e.target.value)}
        className="user-select"
      >
        <option value="">Select User for Private Chat</option>
        {users
          .filter((user) => user.socketId !== targetUserId)
          .map((user) => (
            <option key={user.socketId} value={user.socketId}>
              {user.username}
            </option>
          ))}
      </select>
      <input
        type="text"
        value={privateMessage}
        onChange={(e) => setPrivateMessage(e.target.value)}
        className="input-field"
        placeholder="Type a private message..."
      />
      <button onClick={sendPrivateMessage} className="send-button">
        Send Private
      </button>
      <div className="message-container">
        {privateMessages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.from}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrivateChat;
