import io from "socket.io-client";

const serverURL = "http://localhost:8080";

const subscriptions = ["final", "partial", "transcriber-ready", "error"];

// feel free to pass in any props
const useSocket = () => {
  // ... free to add any state or variables
  const socket = io(serverURL);
  const initialize = () => {
    socket.on("connect", () => {
      console.log('Connected socket connection', socket.id);
    })
  };

  const disconnect = () => {
    
    socket.emit('final');
  };

  // ... free to add more functions
  const sendData = (data) => {
    socket.emit('transcriber-ready', data);
  };
  return { initialize, disconnect, sendData };
};

export default useSocket;
