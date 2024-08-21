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
  const [isCoipied, setIsCopied] = useState(false);

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

  const onStopRecordingPress = () => {
    const op = stopRecording();
    disconnect();
  };

  const onClickCopy = () => {
    setIsCopied(true);
    textareaValue && navigator.clipboard.writeText(textareaValue);
  }

  const onTextChange = (value) => {
    setIsCopied(false);
    setTextArea(value)
  }

  // ... add more functions
  return (
    <div className="container">
      <h1 className="heading">Speechify Voice Notes</h1>
      <section className="main-section">
        <p className="sub-text">Record or type something in the textbox.</p>
        <div className="area-container">
          <textarea id="transcription-display" rows={10} value={textareaValue} onChange={(e) => onTextChange(e.target.value)} className="text-area"></textarea>
          <div className="btn-container">
            <button id="record-button"  className="btn" onClick={isRecording ? onStopRecordingPress : onStartRecordingPress}>{`${isRecording ? 'Stop Recording' : 'Start recording'}`}</button>
            <button id="reset-button" className="btn" onClick={() => onTextChange("")}>Reset</button>
            <button id="copy-button" className="btn" onClick={onClickCopy}>{isCoipied? 'Copied!' : 'Copy'}</button>
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default App;
