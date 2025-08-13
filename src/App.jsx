/* eslint-disable react/react-in-jsx-scope */
import "./App.css";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MicIcon from "@mui/icons-material/Mic";
import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  console.log("render del componente");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const DEFAULT_SOURCE_LANGUAGE = "es";
  const DEFAULT_TARGET_LANGUAGE = "en";

  let [sourceLanguage, setSourceLanguage] = useState(DEFAULT_SOURCE_LANGUAGE);
  let [targetLanguage, setTargetLanguage] = useState(DEFAULT_TARGET_LANGUAGE);

  const SUPPORTED_LANGUAGES = [
    "en",
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "ru",
    "ja",
    "zh",
  ];

  const FULL_LANGUAGES_CODES = {
    es: "es-ES",
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    pt: "pt-PT",
    ru: "ru-RU",
    ja: "ja-JP",
    zh: "zh-CN",
  };

  const currentTranslator = useRef(null);
  const currentDetector = useRef(null);

  const currentTranslatorKey = useRef(null);

  const checkApiSupport = () => {
    let hasNativeTranlator = "Translator" in window;
    let hasNativeDetector = "LanguageDetector" in window;

    if (!hasNativeTranlator || !hasNativeDetector) {
      console.warn(
        "APIs nativas de traducción y deteccón NO soportadas por tu navegador"
      );
    } else {
      console.log("APIs nativas de IA disponibles");
    }
  };

  useEffect(() => {
    checkApiSupport();
  }, []);

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
            monitor.addEventListener("downloadprogress", (e) => {
              console.log("descargando...");
              setOutput(`Descargando el modelo ${Math.floor(e.loaded * 100)}`);
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

  async function swapLanguages() {
    if (sourceLanguage === "auto") {
      const detectedLanguage = await detectLanguage(input);
      setSourceLanguage(detectedLanguage);
    }

    const temporalLanguage = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temporalLanguage);

    setInput(output);
    setOutput("");

    if (input) {
      translate(input, targetLanguage, sourceLanguage);
    }
  }

  const timeoutId = useRef(null);
  const debounceTranslate = useCallback(
    (text, source, target) => {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        translate(text, source, target);
      }, 500);
    },
    [translate]
  );

  const handleChangeInput = (e) => {
    const newText = e.target.value;
    if (newText.length === 51) return;
    setInput(newText);
    debounceTranslate(newText, sourceLanguage, targetLanguage);
  };

  const handleSelectSource = (e) => {
    const newSource = e.target.value;
    setSourceLanguage(newSource);
    debounceTranslate(input, newSource, targetLanguage);
  };

  const handleSelectTarget = (e) => {
    const newTarget = e.target.value;
    setTargetLanguage(newTarget);
    console.log(newTarget);
    debounceTranslate(input, sourceLanguage, newTarget);
  };

  const handleSwapLanguage = () => {
    swapLanguages();
  };

  return (
    <>
      <div className='container'>
        <header className='header'>
          <div className='header-content'>
            <div className='logo'>
              <span className='google-g'>G</span>
              <span className='google-o1'>o</span>
              <span className='google-o2'>o</span>
              <span className='google-g'>g</span>
              <span className='google-l'>l</span>
              <span className='google-e'>e</span>
              <span className='traductor'>Traductor</span>
            </div>
          </div>
        </header>

        <section className='language-selection'>
          <div className='source-language'>
            <select
              id='sourceLanguage'
              value={sourceLanguage}
              onChange={handleSelectSource}
            >
              <option value='auto'>Detectar idioma</option>
              <option value='en'>Inglés</option>
              <option value='es'>Español</option>
              <option value='fr'>Francés</option>
              <option value='de'>Alemán</option>
              <option value='it'>Italiano</option>
              <option value='pt'>Portugués</option>
              <option value='ru'>Ruso</option>
              <option value='ja'>Japonés</option>
              <option value='zh'>Chino</option>
            </select>
          </div>
          <button
            className='swap-languages icon-button'
            id='swapLanguages'
            onClick={handleSwapLanguage}
          >
            <span className='material-symbols-outlined'>
              <SwapHorizIcon />
            </span>
          </button>

          <div className='target-language'>
            <select
              id='targetLanguage'
              value={targetLanguage}
              onChange={handleSelectTarget}
            >
              <option value='en'>Inglés</option>
              <option value='es'>Español</option>
              <option value='fr'>Francés</option>
              <option value='de'>Alemán</option>
              <option value='it'>Italiano</option>
              <option value='pt'>Portugués</option>
              <option value='ru'>Ruso</option>
              <option value='ja'>Japonés</option>
              <option value='zh'>Chino</option>
            </select>
          </div>
        </section>
        <main className='translation-area'>
          <section className='input-section'>
            <div className='textarea-container'>
              <textarea
                id='inputText'
                placeholder='Introduce el texto'
                maxLength='5000'
                value={input}
                onChange={handleChangeInput}
              ></textarea>
            </div>
            <footer className='input-controls'>
              <button className='icon-button mic-button' id='micButton'>
                <span className='material-symbols-outlined'>
                  <MicIcon />
                </span>
              </button>
              <p
                className='length-limit'
                id='length-limit'
                style={{ color: input.length >= 50 ? "red" : "black" }}
              >
                <span id='length'>{input.length}</span> / 50
              </p>
            </footer>
          </section>

          <section className='output-section'>
            <div className='textarea-container'>
              <textarea
                readOnly
                id='outputText'
                value={output}
                onChange={(e) => setOutput(e.target.value)}
              ></textarea>

              <footer className='output-controls'>
                <button className='icon-button copy-button' id='copyButton'>
                  <span className='material-symbols-outlined'>
                    <ContentCopyIcon />
                  </span>
                  <p id='copyText'></p>
                </button>

                <button
                  className='icon-button speaker-button'
                  id='speakerButton'
                >
                  <span className='material-symbols-outlined'>
                    <VolumeUpIcon />
                  </span>
                </button>
              </footer>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
