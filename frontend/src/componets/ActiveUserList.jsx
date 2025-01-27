import { useSocket } from "../SocketContext";

function ActiveUserList() {
  const { users, socket } = useSocket();

  // Check if `users` and `socket` are valid
  if (!users || !socket) {
    return <div>Loading...</div>; // Or some other fallback UI
  }

  return (
    <div className="sidebar">
      <h3>Users</h3>
      <ul>
        {users
          .filter((user) => user.socketId !== socket.id) // Exclude the current user
          .map((user) => (
            <li key={user.socketId} className="user-item">
              <span
                className={`status-dot ${
                  user.status === "active" ? "green" : "gray"
                }`}></span>
              <span className="username">{user.username}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ActiveUserList;
