import React from "react";
import { useSocket } from "../SocketContext";

function GroupChat() {
  const { groupMessages, message, setMessage, sendMessage } = useSocket();

  return (
    <div className="message-container">
      {groupMessages.map((msg, index) => (
        <div key={index} className="message">
          {msg}
        </div>
      ))}
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field"
          placeholder="Type a group message..."
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default GroupChat;
