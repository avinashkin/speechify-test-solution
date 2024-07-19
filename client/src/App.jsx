import { useEffect, useState } from "react";
import useAudioRecorder from "./useAudioRecorder";
import useSocket from "./useSocket";

// IMPORTANT: To ensure proper functionality and microphone access, please follow these steps:
// 1. Access the site using 'localhost' instead of the local IP address.
// 2. When prompted, grant microphone permissions to the site to enable audio recording.
// Failure to do so may result in issues with audio capture and transcription.
// NOTE: Don't use createPortal()

function App() {
  const { initialize, sendData, disconnect } = useSocket();
  const [textareaValue, setTextArea] = useState("");

  useEffect(() => {
    // Note: must connect to server on page load but don't start transcriber
    initialize();
  }, []);

  const { startRecording, stopRecording, isRecording } = useAudioRecorder({
    dataCb: (data) => {
      sendData(data);
    },
  });

  const onStartRecordingPress = async () => {
    // start recorder and transcriber (send configure-stream)
    const op = await startRecording();
    console.log(op);
  };

  const onStopRecordingPress = async () => {
    const op = await stopRecording();
    disconnect();
  };

  const onClickCopy = () => {
    textareaValue && navigator.clipboard.writeText(textareaValue);
  }

  // ... add more functions
  return (
    <div className="container">
      <h1>Speechify Voice Notes</h1>
      <p>Record or type something in the textbox.</p>
      <textarea id="transcription-display" rows={10} value={textareaValue} onChange={(e) => setTextArea(e.target.value)} className="text-area"></textarea>
      <div className="btn-container">
        <button id="record-button"  className="btn" onClick={isRecording ? onStopRecordingPress : onStartRecordingPress}>{`${isRecording ? 'Stop Recording' : 'Start recording'}`}</button>
        <button id="reset-button" className="btn" onClick={() => setTextArea("")}>Reset</button>
        <button id="copy-button" className="btn" onClick={onClickCopy}>Copy</button>
      </div>
    </div>
  );
}

export default App;
