// A separate OS window with generated, non-personal content. It is captured by
// the real desktop media API, never injected into the material renderer.
const {app,BrowserWindow,screen}=require('electron');
const path=require('node:path');
app.setName('Liquid Glass Test Document');
app.setPath('userData',process.env.LIQUID_GLASS_FIXTURE_DATA);
app.whenReady().then(()=>{
 const w=new BrowserWindow({...screen.getPrimaryDisplay().workArea,frame:false,show:false,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false}});
 w.once('ready-to-show',()=>w.show());
 w.loadFile(path.join(__dirname,'document.html'));
});
app.on('window-all-closed',()=>app.quit());
