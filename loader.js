/**
 * Kittysunedude's Soundgasm Codeloader
**/

// Codeloader
document.body.onload = (function () {
  // avoid loading more than once
  if (window.SOUNDGASM_CODELOADER) throw new Error("Stopping script from being executed more than once.");
  window.SOUNDGASM_CODELOADER = true;

  // constants
  const url = location.href.split('/');
  const audio = url.length > 5;
  const username = url[4];

  // utilities
  function toHHMMSS(sec_num) {
    var hours = Math.floor(sec_num / 3600).toFixed(0);
    const hn = hours;
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60).toFixed(0);
    var seconds = (sec_num - (hours * 3600) - (minutes * 60)).toFixed(0);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    if(hn == 0) return minutes + ':' + seconds;
    else return hours + ':' + minutes + ':' + seconds;
  }

  /** @param {string} str The element's ID @returns {HTMLElement} */
  function e(str) {
    return document.getElementById(str);
  }

  /**
   * Utility function to add CSS in multiple passes.
   * @param {string} styleString
   */
  function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
  }

  /**
   * Utility function to add CSS in multiple passes.
   * @param {string} styleUrl
   */
  function addStyleUrl(styleUrl) {
    const style = document.createElement('link');
    style.href = styleUrl;
    style.rel = 'stylesheet';
    style.type = 'text/css';
    document.head.append(style);
  }

  /**
   * Utility function to add JS in multiple passes.
   * @param {string} jsUrl
   */
  function addCodeUrl(jsUrl, callback = () => { }) {
    const style = document.createElement('script');
    style.src = jsUrl;
    style.type = 'text/javascript';
    style.onload = callback;
    document.head.append(style);
  }

  // Check that we're indeed in an audio.
  if (audio == false) return;

  // get the title
  const title = document.querySelector('.jp-title').innerHTML;
  document.title = `Soundgasm - ${title}`;
  // get the description
  const descr = (() => {
    const p = document.querySelector('.jp-description').children[0];
    const children = p.children;
    for (let i = 0; i < children.length; i++) {
      // remove script elements
      if (children instanceof HTMLScriptElement) children.remove();
    }
    return p.innerHTML;
  })();
  // get the audio URL
  const audio_url = (() => {
    // get the script HTML
    const scripts = document.getElementsByTagName('script');
    var found = null;
    for(let i = 0; i < scripts.length; i++) {
      let html = scripts[i].innerHTML;
      if(html.trim() == '') continue;

      // get the raw url
      const first = html.indexOf('m4a: "') + 6;
      if(first == -1) continue;
      const second = html.indexOf('"', first);
      if(second == -1) continue;
      const maybe = html.substring(first, second).substring(27);
      if(maybe.trim() == '') continue;

      // i think we found it!
      found = maybe;
      break;
    }

    // validate found
    if(found == null) throw new Error('Could not get the audio URL');
    return found;
  })();

  // default style
  if (window.sgl_style == null) {
    window.sgl_style = {
      background_color: '#222',
      text_color: '#fff',
      main_color: '#0aa',
      sec_color: '#088',
      bnt_color: 'w3-indigo',
      wave: '#0FF',
      wave_progress: '#088'
    };
  }
  const style = window.sgl_style;

  // inject CSS
  addStyleUrl('https://www.w3schools.com/w3css/4/w3.css'); // W3.css framework
  addStyle(/* custom style */
    `
    html, body, h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; border: none; }
    html, body { background-color: ${style.background_color}; color: ${style.text_color}; }
    .title { margin: 15px; border-bottom: 2px ${style.main_color} solid; display: inline-block; color: ${style.text_color}; }
    .nav { margin-left: 25px; margin-top: 5px; margin-bottom: 20px; }
    .nav a { display: inline-block; margin: 5px; }
    .sg-cont { border: 2px ${style.main_color} solid; padding: 10px; border-radius: 20px }
    .sg-cont .player { padding: 15px; }
    .small-btn { padding: 5px !important; margin: 2px !important; }
    .slidecontainer { width: 100%; border: 2px white solid; }
    .descr { margin: auto; width: 60%; word-break: break-word; }
    .left { float: left; }
    .right { float: right; }
    .endlr { clear: both; }
    .slider {
      -webkit-appearance: none;
      width: 100%;
      height: 25px;
      background-color: ${style.background_color};
      outline: none;
    }
    .slider:hover { opacity: 1; }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px;
      height: 25px;
      background: ${style.main_color};
      cursor: pointer;
    }
    .slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      background: ${style.main_color};
      cursor: pointer;
    }
  `);

  /**
   * Create New HTML
  **/
  const btn_style = `w3-btn w3-ripple ${style.bnt_color} w3-round w3-hover-grayscale`;
  document.body.innerHTML = `
    <div>
      <h1 class="title left">Soundgasm</h1>
      <div class="right" style="margin: 10px;"><a class="${btn_style}" href="https://github.com/kittysunedude/sgcl" target="_blank">What is this?!</a></div>
      <div class="endlr"></div>
      <div class="nav">
        <a class="${btn_style}" href="https://soundgasm.net/">Home</a>
        <a class="${btn_style}" href="https://soundgasm.net/u/${username}">My Audios</a>
        <a class="${btn_style}" href="https://soundgasm.net/upload">Upload</a>
        <a class="${btn_style}" href="https://soundgasm.net/logout">Logout</a>
        <a class="${btn_style}" href="https://soundgasm.net/contact">Contact</a>
      </div>
    </div>
    <div class="w3-container">
      <div class="w3-center">
        <h2>${title}</h2>
      </div>
      <div class="sg-cont">
        <div class="visualizer">
          <div id="waveform_wait">Loading waveform, please wait...</div>
          <div id="waveform"></div>
        </div>
        <div class="w3-display-container player">
          <div class="w3-display-left">
            <a id="playpause" class="${btn_style} small-btn" onclick="__play()">▶</a>
            <a class="${btn_style} small-btn" onclick="__stop()">⏹️</a>
            <span id="player_lbl"></span>
          </div>
          <div class="w3-display-right">
            <div style="display: inline-flex;">
              <span style="margin-right: 3px;">🔊</span>
              <input id="vol_in" type="range" min="0" max="100" value="80" class="slider" id="myRange" oninput="__vol()" onchange="__vol()">
            </div>
          </div>
        </div>
      </div>
      <div class="descr">
        <p>${descr}</p>
      </div>
    </div>
   `;
  /**
   * Inject Audio
   */
  addCodeUrl('https://unpkg.com/wavesurfer.js', () => {
    // create player
    const wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: style.wave,
      progressColor: style.wave_progress
    });

    // event things
    const player_lbl = e('player_lbl');
    const playpause = e('playpause');
    const updateLabel = () => {
      const current = wavesurfer.getCurrentTime();
      const duration = wavesurfer.getDuration();
      player_lbl.innerHTML = `${ toHHMMSS(current) } / ${ toHHMMSS(duration) }`;
    };
    const updateBtns = () => {
      playpause.innerHTML = wavesurfer.isPlaying() ? '⏸' : '▶';
    };

    // hook events
    wavesurfer.on('audioprocess', () => { updateLabel(); });
    wavesurfer.on('play', () => { updateLabel(); updateBtns(); });
    wavesurfer.on('pause', () => { updateLabel(); updateBtns(); });
    wavesurfer.on('stop', () => { updateLabel(); updateBtns(); });
    wavesurfer.on('seek', () => { updateLabel(); updateBtns(); });
    wavesurfer.on('ready', () => { updateLabel(); e('waveform_wait').innerHTML = ''; });
    wavesurfer.on('waveform-ready', () => { e('waveform_wait').innerHTML = ''; });

    // hook events on DOM
    const vol_in = e('vol_in');
    window.__play = () => wavesurfer.playPause();
    window.__stop = () => wavesurfer.stop();
    window.__vol  = () => wavesurfer.setVolume(vol_in.value / 100);

    // load audio
    wavesurfer.setVolume(0.8);
    wavesurfer.load(audio_url);
  });
  // end!
});