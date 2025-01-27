import React from "react";
import { useSocket } from "../SocketContext";

function AppHeader() {
  const { username } = useSocket();  // Get username from context

  return (
    <div className="header">
      <span className="current-username">Logged in as: {username}</span>
    </div>
  );
}

export default AppHeader;
