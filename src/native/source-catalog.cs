// Read-only Windows metadata. No capture, audio, window activation, or commands.
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Web.Script.Serialization;

class SourceCatalog {
  delegate bool MonitorCallback(IntPtr monitor, IntPtr dc, IntPtr rect, IntPtr data);
  [StructLayout(LayoutKind.Sequential)] struct Rect { public int left, top, right, bottom; }
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)] struct DisplayDevice {
    public int cb;
    [MarshalAs(UnmanagedType.ByValTStr,SizeConst=32)] public string name;
    [MarshalAs(UnmanagedType.ByValTStr,SizeConst=128)] public string label;
    public uint flags;
    [MarshalAs(UnmanagedType.ByValTStr,SizeConst=128)] public string id;
    [MarshalAs(UnmanagedType.ByValTStr,SizeConst=128)] public string key;
  }
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)] struct MonitorInfo {
    public int cb; public Rect monitor, work; public uint flags;
    [MarshalAs(UnmanagedType.ByValTStr,SizeConst=32)] public string device;
  }
  [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern bool EnumDisplayDevices(string device, uint index, ref DisplayDevice output, uint flags);
  [DllImport("user32.dll")] static extern bool EnumDisplayMonitors(IntPtr dc, IntPtr rect, MonitorCallback callback, IntPtr data);
  [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern bool GetMonitorInfo(IntPtr monitor, ref MonitorInfo info);
  [DllImport("user32.dll")] static extern bool SetProcessDpiAwarenessContext(IntPtr context);

  static void Main() {
    // Match physical monitor coordinates regardless of the user's display scaling.
    SetProcessDpiAwarenessContext(new IntPtr(-4));
    var monitors = new List<object>();
    var devices = new Dictionary<string,uint>(StringComparer.OrdinalIgnoreCase);
    for (uint index=0; index<256; index++) {
      var device = new DisplayDevice(); device.cb=Marshal.SizeOf(device);
      if (!EnumDisplayDevices(null,index,ref device,0)) break;
      if ((device.flags&1)!=0) devices[device.name]=index;
    }
    if (!EnumDisplayMonitors(IntPtr.Zero,IntPtr.Zero,(monitor,dc,rect,data)=>{
      var info=new MonitorInfo(); info.cb=Marshal.SizeOf(info); uint index;
      if (GetMonitorInfo(monitor,ref info) && devices.TryGetValue(info.device,out index))
        monitors.Add(new { id="screen:"+index+":0", device=info.device, primary=(info.flags&1)!=0,
          x=info.monitor.left,y=info.monitor.top,width=info.monitor.right-info.monitor.left,height=info.monitor.bottom-info.monitor.top });
      return true;
    },IntPtr.Zero)) throw new InvalidOperationException("Monitor enumeration failed");
    Console.OutputEncoding=new UTF8Encoding(false);
    Console.Write(new JavaScriptSerializer().Serialize(new { monitors }));
  }
}
