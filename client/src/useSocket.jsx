import io from "socket.io-client";

const serverURL = "http://localhost:8080";

const subscriptions = ["final", "partial", "transcriber-ready", "error"];
let socket = io(serverURL, {
  reconnection: true
});
// feel free to pass in any props
const useSocket = () => {
  // ... free to add any state or variables
  
  const initialize = () => {
    socket.on("connected", (data) => {
      console.log('Connected socket connection', data);
    })

    socket.on('connect_error', (error) => {
      console.log('Connection error:', error);
    });
    socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
      io.connect(serverURL);
    });
  };

  const disconnect = () => {
    socket.emit('final', {});
  };

  // ... free to add more functions
  const sendData = (data) => {
    console.log(data);
    socket.emit('transcriber-ready', data);
  };
  return { initialize, disconnect, sendData };
};

export default useSocket;
