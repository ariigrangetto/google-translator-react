/* eslint-disable react/react-in-jsx-scope */
import "./App.css";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MicIcon from "@mui/icons-material/Mic";
import { useCallback, useEffect, useRef, useState } from "react";
import useVoiceRecognition from "./hooks/useVoiceRecognition";
import useTraduccion from "./hooks/useTraduccion";
import {
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  FULL_LANGUAGES_CODES,
} from "./constanst";
import useSpeakRecognition from "./hooks/useSpeakRecognition";
import useDetectLanguage from "./hooks/useDetectLanguage";

function App() {
  console.log("render del componente");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copyText, setCopyText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  let [sourceLanguage, setSourceLanguage] = useState("auto");
  let [targetLanguage, setTargetLanguage] = useState(DEFAULT_TARGET_LANGUAGE);

  const { detectLanguage } = useDetectLanguage({ setSourceLanguage });
  console.log(sourceLanguage);

  function updateDetectedLanguage(lang) {
    setDetectedLanguage(lang);
    console.log(lang);
  }

  const { translate } = useTraduccion({
    setOutput,
    sourceLanguage,
    updateDetectedLanguage,
    detectLanguage,
    targetLanguage,
    input,
  });

  const { startVoiceRecognition, micButtonRef } = useVoiceRecognition({
    translate,
    detectLanguage,
    input,
    sourceLanguage,
    getFullLanguageCode,
    targetLanguage,
    setInput,
  });

  const { speakRecognition, speakerBtn } = useSpeakRecognition({
    output,
    getFullLanguageCode,
    targetLanguage,
  });

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
    (text, sourceLanguage, targetLanguage) => {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        translate(text, sourceLanguage, targetLanguage);
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

  function getFullLanguageCode(languageCode) {
    return FULL_LANGUAGES_CODES[languageCode] ?? DEFAULT_SOURCE_LANGUAGE;
  }

  async function handleCopyButton() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyText("Copiado");
      setTimeout(() => {
        setCopyText(" ");
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  }

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
              <option value='auto'>
                {detectedLanguage
                  ? `Detectar idioma (${detectedLanguage})`
                  : "Detectar idioma"}
              </option>
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
                placeholder='Escribe o habla'
                maxLength='5000'
                value={input}
                onChange={handleChangeInput}
              ></textarea>
            </div>
            <footer className='input-controls'>
              <button
                className='icon-button mic-button'
                id='micButton'
                onClick={startVoiceRecognition}
                ref={micButtonRef}
              >
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
                placeholder='Traducción '
                onChange={(e) => setOutput(e.target.value)}
              ></textarea>

              <footer className='output-controls'>
                <button
                  className='icon-button copy-button'
                  id='copyButton'
                  onClick={handleCopyButton}
                >
                  <span className='material-symbols-outlined'>
                    <ContentCopyIcon />
                  </span>
                  <p id='copyText'>{copyText}</p>
                </button>

                <button
                  className='icon-button speaker-button'
                  id='speakerButton'
                  onClick={speakRecognition}
                  ref={speakerBtn}
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
