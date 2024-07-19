import Transcriber from "./transcriber.js";

/**
 * Events to subscribe to:
 * - connection: Triggered when a client connects to the server.
 * - configure-stream: Requires an object with a 'sampleRate' property.
 * - incoming-audio: Requires audio data as the parameter.
 * - stop-stream: Triggered when the client requests to stop the transcription stream.
 * - disconnect: Triggered when a client disconnects from the server.
 *
 *
 * Events to emit:
 * - transcriber-ready: Emitted when the transcriber is ready.
 * - final: Emits the final transcription result (string).
 * - partial: Emits the partial transcription result (string).
 * - error: Emitted when an error occurs.
 */

const transcriber = new Transcriber();

const initializeWebSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`connection made (${socket.id})`);
    // console.log(socket)
    // ... add needed event handlers and logic
    socket.on('transcriber-ready', (args) => {

      transcriber.startTranscriptionStream(args);
    })

    socket.on('final', () => {
      transcriber.endTranscriptionStream();
    })
  });

  
  
  // transcriber.startTranscriptionStream()

  return io;
};

export default initializeWebSocket;
