import EventEmitter from "events";
import { LiveTranscriptionEvents } from "@deepgram/sdk";

let keepAlive;

class Transcriber extends EventEmitter {
  constructor() {
    super();
  }

  async startTranscriptionStream(deepgram) {
    const live = deepgram.listen.live({
      language: "en",
      punctuate: true,
      smart_format: true,
      model: "nova-2",
      interim_results: true,
      endpointing: 10000,
      smart_format: true,
    });

    if (keepAlive) clearInterval(keepAlive);
    keepAlive = setInterval(() => {
      console.log("deepgram: keepalive");
      live.keepAlive();
    }, 3000);
  
    live.addListener(LiveTranscriptionEvents.Open, (dd) => {
      console.log('Deepgram connected');
      live.addListener(LiveTranscriptionEvents.Transcript, (data) => {
        console.log('Hereee',data);
      });

      live.addListener(LiveTranscriptionEvents.Close, async (ddd) => {
        // clearInterval(keepAlive);
        // live.finish();
        console.log("Connection closed.", ddd);
        clearInterval(keepAlive);
      });
  
      live.addListener(LiveTranscriptionEvents.Metadata, (data) => {
        console.log("deepgram: packet received");
        console.log("deepgram: metadata received");
        console.log("ws: metadata sent to client");
        console.log('Metadara', data);
        // ws.send(JSON.stringify({ metadata: data }));
      });
  
      live.addListener(LiveTranscriptionEvents.Error, (err) => {
        console.error('err', err);
      });
    });

    return live;
  }

  endTranscriptionStream() {
    // close deepgram connection here
    // live.finish();
  }

  // NOTE: deepgram must be ready before sending audio payload or it will close the connection
  send(payload) {}

  // ... feel free to add more functions
}

export default Transcriber;
