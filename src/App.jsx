/* eslint-disable react/react-in-jsx-scope */
import "./App.css";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MicIcon from "@mui/icons-material/Mic";

function App() {
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
            <select id='sourceLanguage'>
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
          <button className='swap-languages icon-button' id='swapLanguages'>
            <span className='material-symbols-outlined'>
              <SwapHorizIcon />
            </span>
          </button>

          <div className='target-language'>
            <select id='targetLanguage'>
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
              ></textarea>
            </div>
            <footer className='input-controls'>
              <button className='icon-button mic-button' id='micButton'>
                <span className='material-symbols-outlined'>
                  <MicIcon />
                </span>
              </button>
              <p className='length-limit' id='length-limit'>
                <span id='length'>0</span> / 50
              </p>
            </footer>
          </section>

          <section className='output-section'>
            <div className='textarea-container'>
              <output id='outputText'></output>

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
