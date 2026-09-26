import { app, BrowserWindow, ipcMain, Menu, nativeImage, protocol, session, Tray, type IpcMainEvent, type IpcMainInvokeEvent } from 'electron';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { AppearanceHost } from './glass/host';
import { menuPlacementFor } from './glass/menu-geometry';
import { INITIAL_VISUAL } from './visual-state';
import type { DemoAction, DemoState, Role } from './demo-api';
import { trustedPage } from './security';

app.setName('Electron-Liquid-Glass');
app.setAppUserModelId('local.electron-liquid-glass.demo');
// Test runs use an explicit temporary path; never inspect another app's data.
app.setPath('userData', process.env.LIQUID_GLASS_USER_DATA || path.join(app.getPath('appData'), 'Electron-Liquid-Glass'));
protocol.registerSchemesAsPrivileged([{scheme:'glass',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
export const windows = new Map<Role,BrowserWindow>();
export let appearance: AppearanceHost;
let tray: Tray | undefined, ending = false, menuHeight = 280;
let state: DemoState = {revision:0,visual:{...INITIAL_VISUAL},presentation:{menuOpen:false}};
const urlFor=(role:Role)=>`glass://app/glass.html?role=${role}`;
function auth(event:IpcMainEvent|IpcMainInvokeEvent, roles:Role[]):Role {
  for(const role of roles) { const win=windows.get(role); if(win && !win.isDestroyed() && event.sender===win.webContents && trustedPage(event.senderFrame?.url ?? '',role,event.senderFrame===win.webContents.mainFrame)) return role; }
  throw new Error('Untrusted IPC sender');
}
function publish() { state={...state,revision:state.revision+1}; for(const win of windows.values()) if(!win.isDestroyed()) win.webContents.send('demo:state',state); align(); }
function align() { if(appearance && windows.get('orb') && !windows.get('orb')!.isDestroyed()) appearance.menuBounds(state.presentation.menuOpen ? menuPlacementFor(appearance.geometry(),menuHeight) : null); }
function openTuner() { const win=windows.get('appearance') ?? createWindow('appearance'); win.show(); return win; }
function createWindow(role:Role) {
  const orb=role==='orb';
  const win=new BrowserWindow({title:orb?'Liquid Glass · 演示胶囊':'Liquid Glass · 外观调参',width:orb?321:800,height:orb?52:850,show:false,frame:!orb,transparent:orb,backgroundColor:orb?'#00000000':'#f5f6f8',hasShadow:!orb,resizable:!orb,thickFrame:!orb,roundedCorners:!orb,skipTaskbar:orb,alwaysOnTop:orb,minimizable:!orb,maximizable:!orb,fullscreenable:false,
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),partition:'liquid-glass-local',sandbox:true,contextIsolation:true,nodeIntegration:false,webSecurity:true,backgroundThrottling:false,focusOnNavigation:false,devTools:!app.isPackaged}});
  windows.set(role,win); win.setContentProtection(true);
  if(orb) win.setAlwaysOnTop(true,'screen-saver');
  if(orb) {
    let pendingBlur:ReturnType<typeof setImmediate> | undefined;
    win.on('blur',()=>{clearImmediate(pendingBlur);pendingBlur=setImmediate(()=>{pendingBlur=undefined;if(!ending && state.presentation.menuOpen && !win.isDestroyed() && !win.isFocused())act('collapse');});});
    win.once('closed',()=>clearImmediate(pendingBlur));
    win.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&input.key==='Escape'){event.preventDefault();act(state.presentation.menuOpen?'collapse':'hide');}});
  }
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',event=>event.preventDefault());
  win.on('close',event=>{if(!ending) {event.preventDefault(); win.hide();}});
  win.on('closed',()=>windows.delete(role));
  if(!orb) win.on('hide',()=>appearance?.closeTuner());
  win.webContents.on('did-finish-load',()=>{win.setTitle(orb?'Liquid Glass · 演示胶囊':'Liquid Glass · 外观调参');win.webContents.send('demo:state',state);});
  void win.loadURL(urlFor(role));
  return win;
}
export function quit() { if(ending)return; ending=true; appearance?.dispose(); tray?.destroy(); for(const win of windows.values()) if(!win.isDestroyed()) win.destroy(); app.quit(); }
const actions:DemoAction[]=['cycle','pulse','toggle-menu','collapse','appearance','hide','show','quit','toggle-material','toggle-motion','move-left','move-right','move-up','move-down'];
export function act(action:DemoAction) {
  if(!actions.includes(action)) throw new Error('Unknown demo action');
  const orb=windows.get('orb')!;
  switch(action) {
    case 'quit': quit(); return;
    case 'appearance': openTuner(); return;
    case 'show': orb.showInactive(); orb.setAlwaysOnTop(true,'screen-saver'); orb.moveTop(); return;
    case 'hide': state.presentation={menuOpen:false}; publish(); orb.hide(); return;
    case 'toggle-material': appearance.toggleMaterial(); return;
    case 'toggle-motion': appearance.toggleMotion(); return;
    case 'toggle-menu': state.presentation={menuOpen:!state.presentation.menuOpen}; if(state.presentation.menuOpen)orb.focus(); break;
    case 'collapse': state.presentation={menuOpen:false}; break;
    case 'pulse': state.visual={...state.visual,step:state.visual.step+1,notify:true,phase:'done'}; break;
    case 'cycle': { const phases=['ready','active','busy','done']; const next=(phases.indexOf(state.visual.phase)+1)%phases.length; state.visual={cycle:state.visual.cycle+1,step:0,phase:phases[next],notify:next===3}; break; }
    default: { const delta={'move-left':[-8,0],'move-right':[8,0],'move-up':[0,-8],'move-down':[0,8]}[action]; appearance.move(delta[0],delta[1]); return; }
  }
  publish();
}
export const ready = app.whenReady().then(async()=>{
  if(process.platform!=='win32' || process.arch!=='x64') throw new Error('Windows x64 is currently required');
  const ses=session.fromPartition('liquid-glass-local');
  ses.webRequest.onBeforeRequest({urls:['http://*/*','https://*/*','ws://*/*','wss://*/*']},(_request,callback)=>callback({cancel:true}));
  ses.on('will-download',event=>event.preventDefault());
  const assets:Record<string,[string,string]>={'/glass.html':['glass.html','text/html; charset=utf-8'],'/glass.js':['glass.js','application/javascript'],'/glass.css':['glass.css','text/css']};
  ses.protocol.handle('glass',async request=>{
    const url=new URL(request.url), asset=assets[url.pathname];
    if(url.host!=='app'||request.method!=='GET'||!asset) return new Response(null,{status:404});
    return new Response(await readFile(path.join(__dirname,'renderer',asset[0])),{headers:{'Content-Type':asset[1],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'"}});
  });
  appearance=new AppearanceHost(windows,auth,openTuner,align); await appearance.load();
  ses.setPermissionRequestHandler((contents,permission,callback,details)=>callback(details.isMainFrame && details.requestingUrl===urlFor('orb') && appearance.permission(contents,permission,'mediaTypes' in details?details.mediaTypes:undefined)));
  ses.setPermissionCheckHandler((contents,permission,origin)=>['glass://app','glass://app/'].includes(origin) && contents?.getURL()===urlFor('orb') && permission==='display-capture' && appearance.permission(contents,permission));
  ses.setDisplayMediaRequestHandler((request,callback)=>{void appearance.displayRequest(request,callback);});
  ipcMain.handle('demo:state',event=>{auth(event,['orb','appearance']);return state;});
  ipcMain.handle('demo:action',(event,value:DemoAction)=>{auth(event,['orb','appearance']); act(value);});
  ipcMain.on('demo:menu-height',(event,value:unknown)=>{auth(event,['orb']);if(typeof value==='number'&&Number.isFinite(value)&&value>=80&&value<=1200){menuHeight=value;align();}});
  appearance.install(); Menu.setApplicationMenu(null);
  const orb=createWindow('orb'); appearance.attach();
  orb.once('ready-to-show',()=>orb.showInactive());
  const pixels=Buffer.alloc(16*16*4); for(let i=0;i<pixels.length;i+=4){pixels[i]=175;pixels[i+1]=140;pixels[i+2]=50;pixels[i+3]=255;}
  tray=new Tray(nativeImage.createFromBitmap(pixels,{width:16,height:16})); tray.setToolTip('Electron Liquid Glass');
  tray.setContextMenu(Menu.buildFromTemplate([{label:'显示胶囊',click:()=>act('show')},{label:'外观调参',click:openTuner},{label:'开启 / 关闭材质',click:()=>act('toggle-material')},{label:'隐藏胶囊',click:()=>act('hide')},{type:'separator'},{label:'退出演示',click:quit}]));
  tray.on('double-click',()=>act('show'));
  if(process.argv.includes('--tuner')) openTuner();
});
ready.catch(error=>{console.error('Glass startup failed:',error.message); app.exit(1);});
app.on('before-quit',()=>{ending=true;appearance?.dispose();tray?.destroy();});
app.on('window-all-closed',()=>{if(ending)app.quit();});
