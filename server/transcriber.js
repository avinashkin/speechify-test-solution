import EventEmitter from "events";
import { createClient } from "@deepgram/sdk";
import { LiveTranscriptionEvents } from "@deepgram/sdk";
import { readFileSync } from "fs";


class Transcriber extends EventEmitter {
  constructor() {
    super();
  }

  // sampleRate: number
  async startTranscriptionStream(sampleRate) {
    // example deepgram configuration
    /*
    {
      model: "nova-2",
      punctuate: true,
      language: "en",
      interim_results: true,
      diarize: false,
      smart_format: true,
      endpointing: 0,
      encoding: "linear16",
      sample_rate: sampleRate,
    }
      */
    const deepgram = createClient("e9c0ac0250d57a771e9277721edc996d8fe08fda");
    // const live = deepgram.listen.live(
    //   {
    //     model: "nova-2",
    //     punctuate: true,
    //     language: "en",
    //     interim_results: true,
    //     diarize: false,
    //     smart_format: true,
    //     endpointing: 0,
    //     encoding: "linear16",
    //     sample_rate: sampleRate,
    //   }
    // );
    
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      // path to the audio file
      readFileSync(sampleRate),
      // STEP 3: Configure Deepgram options for audio analysis
      {
        model: "nova-2", 
        punctuate: true,
        language: "en",
        interim_results: true,
        diarize: false,
        smart_format: true,
        endpointing: 0,
        encoding: "linear16",
        sample_rate: sampleRate,
      }
    );

    console.log(result, error);

    
    // live.on(LiveTranscriptionEvents.Open, () => {
    //   live.on(LiveTranscriptionEvents.Transcript, (data) => {
    //     console.log(data);
    //   });

    //   live.on(LiveTranscriptionEvents.Close, () => {
    //     console.log("Connection closed.");
    //   });
  
    //   live.on(LiveTranscriptionEvents.Metadata, (data) => {
    //     console.log(data);
    //   });
  
    //   live.on(LiveTranscriptionEvents.Error, (err) => {
    //     console.error('err', err);
    //   });
    // });

    // live.on(LiveTranscriptionEvents.Error, (err) => {
    //   console.error('err', err);
    // });

    

    

    // live.addListener(LiveTranscriptionEvents.Open, async () => {
    //   console.log('Deep conn');
    //   deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {
    //     const daa = JSON.parse(data);
    //     console.log(daa);
    //   })
    // })

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
