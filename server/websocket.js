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

const initializeWebSocket = (io, deepgramClient) => {
  io.on("connection", async (socket) => {
    console.log(`connection made (${socket.id})`);
    let deepgram = await transcriber.startTranscriptionStream(deepgramClient);
    // ... add needed event handlers and logic
    socket.emit('connected', socket.id);
 
    socket.on('transcriber-ready', (args) => {
      // deepgram.send(args);
      if (deepgram.getReadyState() === 1 /* OPEN */) {
        console.log("socket: data sent to deepgram");
        deepgram.send(args);
      } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
        console.log("socket: data couldn't be sent to deepgram");
        console.log("socket: retrying connection to deepgram");
        /* Attempt to reopen the Deepgram connection */
        // deepgram.finish();
        // deepgram.removeAllListeners();
        deepgram = transcriber.startTranscriptionStream(deepgramClient);
      } else {
        console.log("socket: data couldn't be sent to deepgram");
      }

    })

    socket.on('final', () => {
      // transcriber.endTranscriptionStream();
      deepgram.finish();
    })
  });
  
  return io;
};

export default initializeWebSocket;
