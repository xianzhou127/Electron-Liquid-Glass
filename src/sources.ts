import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

export type NativeMonitor = { id: string; device: string; primary: boolean; x: number; y: number; width: number; height: number };
export type NativeCatalog = { monitors: NativeMonitor[] };
const runFile = promisify(execFile);

export async function readNativeCatalog(): Promise<NativeCatalog> {
  // Fixed bundled executable, no shell and no renderer-supplied path or arguments.
  const directory = __dirname.replace(/app\.asar(?=[\\/]|$)/, "app.asar.unpacked");
  const { stdout } = await runFile(path.join(directory, "native/source-catalog.exe"), [], { windowsHide: true, timeout: 5000, maxBuffer: 1024 * 1024, encoding: "utf8" });
  const catalog = JSON.parse(stdout) as NativeCatalog;
  if (!Array.isArray(catalog.monitors) || !catalog.monitors.length) throw new Error("Invalid native source catalog");
  return catalog;
}
