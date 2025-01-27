import GroupChat from "./componets/GroupChat";
import PrivateChat from "./componets/PrivateChat";
import ActiveUserList from "./componets/ActiveUserList";
import AppHeader from "./componets/AppHeader";
import "./App.css";
import { SocketProvider, useSocket } from "./SocketContext";

function App() {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
}

function AppContent() {
  const {
    username,
    groupMessages,
    message,
    setMessage,
    sendMessage,
    privateMessages,
    privateMessage,
    setPrivateMessage,
    targetUserId,
    setTargetUserId,
    users,
    currentChat,
    setCurrentChat,
    sendPrivateMessage,
  } = useSocket();

  return (
    <div className="app-container">
      <AppHeader username={username} />
      <div className="main-container">
        <ActiveUserList users={users} />
        <div className="chat-container">
          <div className="chat-mode-selector">
            <button
              onClick={() => setCurrentChat("group")}
              className={`mode-button ${currentChat === "group" ? "active" : ""}`}
            >
              Group Chat
            </button>
            <button
              onClick={() => setCurrentChat("private")}
              className={`mode-button ${currentChat === "private" ? "active" : ""}`}
            >
              Private Chat
            </button>
          </div>
          {currentChat === "group" && (
            <GroupChat
              groupMessages={groupMessages}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          )}
          {currentChat === "private" && (
            <PrivateChat
              privateMessages={privateMessages}
              privateMessage={privateMessage}
              setPrivateMessage={setPrivateMessage}
              sendPrivateMessage={sendPrivateMessage}
              users={users}
              targetUserId={targetUserId}
              setTargetUserId={setTargetUserId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
