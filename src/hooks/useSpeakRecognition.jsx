import { useRef } from "react";

export default function useSpeakRecognition({
  output,
  getFullLanguageCode,
  targetLanguage,
}) {
  const speakerBtn = useRef(null);
  function speakRecognition() {
    console.log("working");
    const hasNativeSuportSynthesis = "SpeechSynthesis" in window;
    if (!hasNativeSuportSynthesis) return;

    const text = output;
    if (!text) return;

    //in case you want to change the default voice
    const voices = speechSynthesis.getVoices();
    console.log(voices);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getFullLanguageCode(targetLanguage);
    utterance.rate = 0.9;

    utterance.onstart = () => {
      speakerBtn.current.style.backgroundColor = "var(--google-green)";
      speakerBtn.current.style.color = "white";
    };

    utterance.onend = () => {
      speakerBtn.current.style.backgroundColor = "";
      speakerBtn.current.style.color = "";
    };

    window.speechSynthesis.speak(utterance);
  }
  return { speakRecognition, speakerBtn };
}
