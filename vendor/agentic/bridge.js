/* Denny Games lifecycle adapter; upstream sources remain unmodified. */
(()=>{
 const channel=new URLSearchParams(location.search).get('channel');
 const parentOrigin=document.referrer?new URL(document.referrer).origin:location.origin;
 const post=(type,data={})=>parent.postMessage({channel,type,...data},parentOrigin);
 const nativeRAF=window.requestAnimationFrame.bind(window);
 let now=performance.now(),next=1,queue=new Map(),running=false,ended=false,hook,started=false,ticks=0,lastScore=-1,sound=false;
 Object.defineProperty(performance,'now',{value:()=>now});
 window.requestAnimationFrame=cb=>{const id=next++;queue.set(id,cb);return id;};
 window.cancelAnimationFrame=id=>queue.delete(id);
 const timers=new Map();
 window.setTimeout=(fn,delay=0,...args)=>{const id=next++;timers.set(id,{fn,args,at:now+Math.max(1,Number(delay)||0),period:0});return id;};
 window.setInterval=(fn,delay=0,...args)=>{const id=next++,period=Math.max(1,Number(delay)||0);timers.set(id,{fn,args,at:now+period,period});return id;};
 window.clearTimeout=window.clearInterval=id=>timers.delete(id);
 const contexts=[], gains=new WeakMap();let volume=1;
 const connect=window.AudioNode?.prototype.connect;
 if(connect)window.AudioNode.prototype.connect=function(destination,...args){return connect.call(this,gains.get(destination)||destination,...args);};
 const NativeAudio=window.AudioContext||window.webkitAudioContext;
 if(NativeAudio){window.AudioContext=new Proxy(NativeAudio,{construct(Target,args){const c=new Target(...args),resume=c.resume.bind(c);contexts.push(c);const master=c.createGain();master.gain.value=volume;connect.call(master,c.destination);gains.set(c.destination,master);c.resume=()=>running&&sound?resume():Promise.resolve();if(!running||!sound)c.suspend().catch(()=>{});else resume().catch(()=>{});return c;}});window.webkitAudioContext=window.AudioContext;}
 const syncAudio=()=>contexts.forEach(c=>{(running&&sound?c.resume():c.suspend()).catch(()=>{});});
 // Imported leaderboards are session-local; shell owns persistent personal bests.
 const memory=new Map();
 try{Object.defineProperty(window,'localStorage',{value:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k),clear:()=>memory.clear()}});}catch{}
 // Shared shell owns visibility/focus pause. Clear all held keys before freezing.
 window.addEventListener('blur',e=>e.stopImmediatePropagation(),true);
 document.addEventListener('visibilitychange',e=>{if(document.hidden&&running)post('pause');e.stopImmediatePropagation();},true);
 const held=new Set(),physicalKeys=new Set(),pointers=new Set(),touches=new Map();
 window.addEventListener('keydown',e=>{if(running)physicalKeys.add(e.code);},true);
 window.addEventListener('keyup',e=>physicalKeys.delete(e.code),true);
 window.addEventListener('pointerdown',e=>{if(running)pointers.add(e.pointerId);},true);
 for(const type of ['pointerup','pointercancel'])window.addEventListener(type,e=>pointers.delete(e.pointerId),true);
 window.addEventListener('touchstart',e=>{if(running)for(const t of e.changedTouches)touches.set(t.identifier,t);},true);
 for(const type of ['touchend','touchcancel'])window.addEventListener(type,e=>{for(const t of e.changedTouches||[])touches.delete(t.identifier);},true);
 function key(code,down){if(down===held.has(code))return;if(down)held.add(code);else held.delete(code);window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,key:code==='Space'?' ':code,bubbles:true}));}
 const clear=()=>{const c=document.querySelector('canvas');if(c){for(const pointerId of [...pointers])c.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId}));c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));const event=new Event('touchcancel',{bubbles:true});Object.defineProperty(event,'changedTouches',{value:[...touches.values()]});c.dispatchEvent(event);}for(const k of [...held])key(k,false);for(const k of new Set([...physicalKeys,'ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']))window.dispatchEvent(new KeyboardEvent('keyup',{code:k,key:k==='Space'?' ':k,bubbles:true}));};
 for(const name of ['keydown','keyup'])window.addEventListener(name,e=>{if(running&&e.type==='keydown'&&['KeyP','Escape'].includes(e.code)){post('pause');clear();running=false;syncAudio();}if((!running||['KeyP','KeyM','Escape','Enter'].includes(e.code))&&!e.__release){if(!running&&e.type==='keyup')return;e.preventDefault();e.stopImmediatePropagation();}},true);
 for(const name of ['pointerdown','pointerup','pointermove','touchstart','touchmove','touchend','mousedown','mouseup'])window.addEventListener(name,e=>{if(!running){e.preventDefault();e.stopImmediatePropagation();}}, {capture:true,passive:false});
 window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==parentOrigin||e.data?.channel!==channel)return;const d=e.data;
 if(d.type==='run'){if(!d.running)clear();running=d.running===true&&!ended;syncAudio();}
 if(d.type==='sound'){sound=d.enabled===true;syncAudio();}
 if(d.type==='volume'&&Number.isFinite(d.volume)){volume=Math.min(1,Math.max(0,d.volume));contexts.forEach(c=>{gains.get(c.destination).gain.value=volume;});}
 if(d.type==='key'&&running&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(d.code))key(d.code,d.down===true);
 if(d.type==='input'&&running){key('ArrowLeft',d.x<0);key('ArrowRight',d.x>0);key('ArrowUp',d.y<0);key('ArrowDown',d.y>0);key('Space',d.pressed===true);}
 });
 window.__agenticSetup=h=>{hook=h;h.start();started=true;const c=document.querySelector('canvas');const callbacks=[...queue.values()];queue.clear();callbacks.forEach(f=>f(now));post('ready',{width:c.width,height:c.height});document.body.dataset.phase='ready';};
 let previous;
 function pump(real){const dt=previous===undefined?0:Math.min(33,real-previous);previous=real;
 if(running&&started){now+=dt;ticks++;for(const [id,t] of [...timers])if(now>=t.at){if(t.period)t.at=now+t.period;else timers.delete(id);if(typeof t.fn==='function')t.fn(...t.args);}const callbacks=[...queue.values()];queue.clear();try{callbacks.forEach(f=>f(now));const s=hook.read();document.body.dataset.ticks=String(ticks);document.body.dataset.phase=String(s.phase);if(Number.isFinite(s.score)&&s.score!==lastScore){lastScore=s.score;post('score',{score:s.score});}if(s.ended&&!ended){ended=true;running=false;clear();syncAudio();post('end',{score:Number.isFinite(s.score)?s.score:0,won:s.won});}}catch(error){running=false;syncAudio();post('error');}}
 nativeRAF(pump);
 }nativeRAF(pump);
 window.addEventListener('error',()=>{running=false;syncAudio();post('error');});
 window.addEventListener('unhandledrejection',()=>{running=false;syncAudio();post('error');});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)post('pause');},true);
})();
