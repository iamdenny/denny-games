/* Denny Games MIT. Runs in an opaque-origin iframe with no storage or network privileges. */
(() => {
  const params = new URLSearchParams(location.search);
  const slug = params.get('game');
  const channel = params.get('channel');
  const parentOrigin = new URL(document.referrer).origin;
  const send = (type, payload = {}) => parent.postMessage({ channel, type, ...payload }, parentOrigin);
  let held = false, previous = false, pad = null, cursor = null, lastScore = -1;
  let ended = false;
  const bridge = window.dennyBridge = {
    running: false,
    beforeUpdate() {
      if (pad) {
        const pos = cursor || (cursor = vec(options.viewSize.x / 2, options.viewSize.y / 2));
        pos.x = clamp(pos.x + pad.x * options.viewSize.x / 60, 0, options.viewSize.x);
        pos.y = clamp(pos.y + pad.y * options.viewSize.y / 60, 0, options.viewSize.y);
        const pressed = held || pad.pressed;
        input.set({pos, isPressed: pressed, isJustPressed: pressed && !previous, isJustReleased: !pressed && previous});
        previous = pressed;
      }
    },
    afterUpdate(value, ticks) {
      document.body.dataset.ticks = String(ticks);
      if (value !== lastScore) { lastScore = value; send('score', { score: value }); }
    },
    finish(score, won) { if (!ended) { ended = true; bridge.running = false; send('end', { score, won }); } },
    fail(error) { bridge.running = false; send('error', { error }); },
  };
  window.addEventListener('error', e => bridge.fail(e.message));
  window.addEventListener('unhandledrejection', e => bridge.fail(String(e.reason)));
  window.addEventListener('message', e => {
    if (e.source !== parent || e.origin !== parentOrigin || e.data?.channel !== channel) return;
    const d = e.data;
    if (d.type === 'run') { bridge.running = d.running === true && !ended; held = false; previous = false; pad = null; }
    if (d.type === 'input' && (pad || d.pressed || d.x || d.y)) { pad = { x: clamp(Number(d.x) || 0,-1,1), y: clamp(Number(d.y) || 0,-1,1), pressed:d.pressed === true }; }
    if (d.type === 'press') { held = d.pressed === true; }
    if (d.type === 'digit' && /^[1-9]$/.test(d.key)) {
      document.dispatchEvent(new KeyboardEvent('keydown', {code:'Digit'+d.key,key:d.key,bubbles:true,keyCode:48+Number(d.key)}));
      setTimeout(() => document.dispatchEvent(new KeyboardEvent('keyup', {code:'Digit'+d.key,key:d.key,bubbles:true,keyCode:48+Number(d.key)})), 60);
    }
  });
  document.addEventListener('mousedown', () => {pad = null;});
  document.addEventListener('touchstart', () => {pad = null;});
  document.addEventListener('keydown', e => {
    pad = null;
    if (e.key === 'Escape' || e.code === 'KeyP') { e.preventDefault(); e.stopImmediatePropagation(); send('pause'); }
  }, true);
  window.addEventListener('blur', () => { if (bridge.running) send('pause'); });
  // A few originals store high scores. Give only a frame-local, in-memory store.
  const memory = new Map();
  Object.defineProperty(window, 'localStorage', {value:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}});
  async function script(src) {
    return new Promise((resolve, reject) => {const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(Error('Script unavailable'));document.head.append(s);});
  }
  (async () => {
    if (!/^[a-z0-9-]+$/.test(slug || '') || !channel) throw Error('Invalid game');
    window.sss = {setTempo(){},setQuantize(){},playMml(){},stopMml(){},stopBgm(){},playBgm(){},generateMml(){return [];}};
    window.module = {};
    await script('/vendor/crisp/clone-deep.js');
    window.cloneDeep = window.module.exports;
    await script('/vendor/crisp/runtime.js');
    await script(`/vendor/crisp/games/${slug}/${slug === "dango" ? "main.csp.js" : "main.js"}`);
    if (Array.isArray(window.characters) && window.characters.some(v=>v.trim().startsWith('./'))) {
      await script('/vendor/crisp/images.js');
      window.characters = window.characters.map(value=>window.dennyImages[value] || value);
    }
    const themeName = options?.theme;
    window.options = {...options, viewSize:options?.viewSize || {x:100,y:100}, theme: ['dark','shapeDark','pixel','crt'].includes(themeName) ? 'dark' : 'simple', isCapturing:false,isRecording:false,isMinifying:false,isReplayEnabled:false,isSoundEnabled:false,isPlayingBgm:false};
    window.title = ''; window.description = '';
    window.play = () => send('sound');
    onLoad();
    const style = document.createElement('style');style.textContent='html,body{width:100%;height:100%;margin:0;overflow:hidden;touch-action:none}canvas{image-rendering:pixelated;width:100%!important;height:100%!important;object-fit:contain}';document.head.append(style);
    send('ready', { width:options.viewSize.x, height:options.viewSize.y });
  })().catch(error => bridge.fail(String(error)));
})();
