import { useCallback, useRef } from "react";

export default function useTraduccion({
  setOutput,
  sourceLanguage,
  detectLanguage,
  targetLanguage,
  input,
}) {
  const currentTranslatorKey = useRef(null);
  const currentTranslator = useRef(null);

  async function getTranslation(text, source, target) {
    const sourceLanguageDetect =
      source === "auto" ? await detectLanguage(text) : source;

    console.log(target);

    if (sourceLanguageDetect === target) return text;

    try {
      const status = await window.Translator.availability({
        sourceLanguage: source,
        targetLanguage: target,
      });

      if (status === "unavailable") {
        throw new Error(`Traducción de ${source} a ${target} no disponible`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Traducción de ${source} a ${target} no disponible`);
    }

    const translatorKey = `${source} - ${target}`;
    console.log(translatorKey);
    try {
      if (
        !currentTranslator.current ||
        currentTranslatorKey.current !== translatorKey
      ) {
        currentTranslator.current = await window.Translator.create({
          sourceLanguage: source,
          targetLanguage: target,

          monitor: (monitor) => {
            monitor.addEventListener("downloadprogress", () => {
              console.log("descargando...");
              setOutput(`Descargando el modelo`);
            });
          },
        });
      }

      currentTranslatorKey.current = translatorKey;

      const translation = await currentTranslator.current.translate(text);
      return translation;
    } catch (e) {
      console.error(e);
      return "Error al traducir";
    }
  }

  const translate = useCallback(
    async (text, source, target) => {
      if (!text) {
        setOutput("");
        return;
      }
      setOutput("Traduciendo...");

      let sourceToUse = source;
      if (sourceLanguage === "auto") {
        sourceToUse = await detectLanguage(text);
      }

      try {
        const translation = await getTranslation(text, sourceToUse, target);
        setOutput(translation);
      } catch (error) {
        console.error(error);
        setOutput("Error al traducir");
      }
    },
    [sourceLanguage, targetLanguage, input]
  );

  return { translate };
}
