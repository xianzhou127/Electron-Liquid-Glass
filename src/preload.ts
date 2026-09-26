import { contextBridge, ipcRenderer } from 'electron';
import type { AppearanceApi } from './glass/api';
import type { DemoApi } from './demo-api';
const on = <T>(channel:string, callback:(value:T)=>void) => { const listener=(_event:unknown,value:T)=>callback(value); ipcRenderer.on(channel,listener); return ()=>{ipcRenderer.removeListener(channel,listener);}; };
const appearance: AppearanceApi = {
  config:()=>ipcRenderer.invoke('appearance:config'), onConfig:cb=>on('appearance:config',cb),
  monitors:()=>ipcRenderer.invoke('appearance:monitors'), prepareCapture:id=>ipcRenderer.invoke('appearance:prepare-capture',id),
  configure:value=>ipcRenderer.invoke('appearance:configure',value), tune:value=>ipcRenderer.invoke('appearance:tune',value),
  saveMaterial:()=>ipcRenderer.invoke('appearance:save-material'), saveMotion:()=>ipcRenderer.invoke('appearance:save-motion'), importSettings:kind=>ipcRenderer.invoke('appearance:import',kind), restoreSaved:kind=>ipcRenderer.invoke('appearance:restore-saved',kind),
  geometry:()=>ipcRenderer.invoke('appearance:geometry'), onGeometry:cb=>on('appearance:geometry',cb),
  pointer:inside=>ipcRenderer.send('appearance:pointer',inside), placement:value=>ipcRenderer.send('appearance:placement',value),
  report:value=>ipcRenderer.send('appearance:telemetry',value), telemetry:()=>ipcRenderer.invoke('appearance:telemetry'), onTelemetry:cb=>on('appearance:telemetry',cb),
  utility:action=>ipcRenderer.invoke('appearance:utility',action), onDiagnostic:cb=>on('appearance:diagnostic',cb), contextMenu:()=>ipcRenderer.send('appearance:context-menu')
};
const demo: DemoApi = {state:()=>ipcRenderer.invoke('demo:state'), onState:cb=>on('demo:state',cb), action:action=>ipcRenderer.invoke('demo:action',action), menuHeight:height=>ipcRenderer.send('demo:menu-height',height)};
contextBridge.exposeInMainWorld('appearance',appearance);
contextBridge.exposeInMainWorld('demo',demo);
