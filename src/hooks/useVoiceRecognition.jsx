import { useRef } from "react";

export default function useVoiceRecognition({
  translate,
  detectLanguage,
  input,
  sourceLanguage,
  getFullLanguageCode,
  targetLanguage,
  setInput,
}) {
  const micButtonRef = useRef(null);

  async function startVoiceRecognition() {
    const hasNativeRecognitionSupport =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!hasNativeRecognitionSupport) return;

    const recognition = new (SpeechRecognition || webkitSpeechRecognition)();

    recognition.continuous = false;
    recognition.interimResults = false;

    const language =
      sourceLanguage === "auto" ? await detectLanguage(input) : sourceLanguage;

    recognition.lang = getFullLanguageCode(language);

    recognition.onaudiostart = () => {
      console.log("working");
      micButtonRef.current.style.backgroundColor = "var(--google-red)";
      micButtonRef.current.style.color = "white";
    };

    recognition.onaudioend = () => {
      micButtonRef.current.style.backgroundColor = "";
      micButtonRef.current.style.color = "";
    };

    recognition.onresult = (event) => {
      console.log(event.results);
      const [{ transcript }] = event.results[0];
      setInput(transcript);
      translate(transcript, sourceLanguage, targetLanguage);
    };

    recognition.onnomatch = () => {
      console.error("Speech not recognized");
    };

    recognition.onerror = (event) => {
      console.log("Error de reconocimiento de voz", event.error);
    };

    recognition.start();
  }

  return { startVoiceRecognition, micButtonRef };
}
