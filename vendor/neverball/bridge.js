/* Denny Games host integration, GPL-3.0-or-later. Engine/data remain unchanged. */
'use strict';
// The native add-on fetcher receives an empty offline catalogue; it never opens a socket.
window.DennyLocalRequest=class {
 open(method,url){this.url=url;this.readyState=1;}
 setRequestHeader(){} overrideMimeType(){} getAllResponseHeaders(){return '';}
 abort(){this.cancelled=true;}
 send(){queueMicrotask(()=>{if(this.cancelled)return;this.status=this.url.endsWith('/available-packages.txt')?200:404;this.statusText=this.status===200?'OK':'Not available';this.response=new ArrayBuffer(0);this.readyState=4;this.onreadystatechange?.({target:this});this.onload?.({target:this});});}
};
const channel=new URLSearchParams(location.search).get('channel');
let module,started=false,paused=true,pendingSnapshot=false;
const canvas=document.getElementById('canvas');
// Native mouse capture may be requested before a child-frame gesture. Fall back until the player clicks.
const requestLock=canvas.requestPointerLock?.bind(canvas);
if(requestLock)canvas.requestPointerLock=()=>{try{return Promise.resolve(requestLock()).catch(()=>{});}catch{return Promise.resolve();}};
const send=(type,payload={})=>parent.postMessage({channel,type,...payload},'*');
// Audio deliberately omitted. Engine calls these native-browser bridge functions.
window.Neverball={audioCanPlayOgg:true,audioInit(){},audioQuit(){},audioPlay(){},audioMusicFadeOut(){},audioMusicFadeIn(){},audioMusicFadeTo(){},audioMusicStop(){},audioVolume(){},quit(){send('exit');}};
const safePath=name=>/^(?:Scores\/)?[A-Za-z0-9_.-]{1,100}$/.test(name)&&!name.split('/').some(p=>p==='.'||p==='..');
function snapshot(requestId){
 if(!module)return;const files={};let size=0;
 const names=[...module.FS.readdir('/neverball/Scores').map(name=>'Scores/'+name),...module.FS.readdir('/neverball')];
 for(const name of names){if(!safePath(name))continue;try{const data=module.FS.readFile('/neverball/'+name);if(data.length>60000||size+data.length>180000)continue;size+=data.length;files[name]=Array.from(data);}catch{}}
 send('snapshot',{files,requestId});
}
async function init(d){
 if(pendingSnapshot||module)return;pendingSnapshot=true;
 try{
 module=await Neverball_createEmscriptenModule({canvas,wasmBinary:d.wasm,getPreloadedPackage:()=>d.data,print(){},printErr(text){if(/abort|error/i.test(text))console.warn(text);},onAbort(){send('error');}});
 const FS=module.FS;FS.mkdir('/neverball');FS.mkdir('/neverball/Downloads');FS.mkdir('/neverball/Scores');
 FS.writeFile('/neverball/Downloads/set-easy.zip',new Uint8Array(d.easy));FS.writeFile('/neverball/Downloads/course-putt.zip',new Uint8Array(d.putt));
 FS.writeFile('/neverball/Downloads/installed-packages.txt','package set-easy\nfilename set-easy.zip\npackage course-putt\nfilename course-putt.zip\n');
 let size=0;for(const [name,data] of Object.entries(d.files??{})){if(!safePath(name)||!Array.isArray(data)||data.length>60000||!data.every(n=>Number.isInteger(n)&&n>=0&&n<=255))continue;size+=data.length;if(size>180000)break;FS.writeFile('/neverball/'+name,new Uint8Array(data));}
 // Force safe window size and muted output. The player owns audio and viewport.
 const old=(()=>{try{return FS.readFile('/neverball/neverballrc',{encoding:'utf8'});}catch{return '';}})();
 const filtered=old.split('\n').filter(line=>! /^(width|height|fullscreen|sound_volume|music_volume|mouse_grab|language)\s/.test(line));
 FS.writeFile('/neverball/neverballrc',filtered.join('\n')+'\nwidth 800\nheight 450\nfullscreen 0\nsound_volume 0\nmusic_volume 0\nmouse_grab 0\nplayer Denny\nlanguage '+(d.locale==='ko'?'ko_KR':'en_US')+'\n');
 window.gameKind=d.kind;send('ready');
 }catch(error){console.error(error);send('error');}
}
window.addEventListener('message',e=>{if(e.source!==parent||e.data?.channel!==channel)return;const d=e.data;
 if(d.type==='init'){void init(d);return;}if(!module)return;
 if(d.type==='start'){paused=false;if(!started){started=true;module.callMain(window.gameKind==='neverputt'?['--putt']:[]);}else module.resumeMainLoop();canvas.focus();}
 if(d.type==='pause'){document.exitPointerLock?.();paused=true;module.pauseMainLoop();snapshot();}
 if(d.type==='snapshot')snapshot(d.requestId);
 if(d.type==='key'&&!paused){const names={up:['ArrowUp',38],down:['ArrowDown',40],left:['ArrowLeft',37],right:['ArrowRight',39],confirm:['Enter',13]};const k=names[d.action];if(k){for(const type of ['keydown','keyup']){const event=new KeyboardEvent(type,{key:k[0],code:k[0],keyCode:k[1],which:k[1],bubbles:true});canvas.dispatchEvent(event);}}}
});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();send('pause');}},true);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();send('error');});
setInterval(()=>{if(started&&!paused)snapshot();},1500);
send('bridge-ready');
