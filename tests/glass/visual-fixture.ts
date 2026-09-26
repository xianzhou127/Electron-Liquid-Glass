import { INITIAL_VISUAL, type VisualState } from '../../src/visual-state';
/** Four explicit paint states only. No controller, services, timers or media. */
export function visualFixture() {
  let state:VisualState={...INITIAL_VISUAL};
  const listeners=new Set<()=>void>();
  return { get state(){return state;}, set(phase:string){state={...state,phase,notify:phase==='done'}; for(const callback of listeners)callback();}, subscribe(callback:()=>void){listeners.add(callback);return ()=>{listeners.delete(callback);};} };
}
