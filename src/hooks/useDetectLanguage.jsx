import { useRef } from "react";
import { DEFAULT_SOURCE_LANGUAGE, SUPPORTED_LANGUAGES } from "../constanst";

export default function useDetectLanguage() {
  const currentDetector = useRef(null);
  async function detectLanguage(text) {
    try {
      if (!currentDetector.current) {
        currentDetector.current = await window.LanguageDetector.create({
          expectedInputLanguages: SUPPORTED_LANGUAGES,
        });
      }
      const results = await currentDetector.current.detect(text);

      const detectedLanguage = results[0]?.detectedLanguage;

      return detectedLanguage === "und"
        ? DEFAULT_SOURCE_LANGUAGE
        : detectedLanguage;
    } catch (error) {
      console.error("No he podido averiguar el idioma", error);
      return DEFAULT_SOURCE_LANGUAGE;
    }
  }

  return { detectLanguage };
}
