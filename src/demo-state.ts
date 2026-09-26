import { useCallback, useEffect, useState } from 'react';
import type { DemoAction, DemoState } from './demo-api';
import { INITIAL_VISUAL } from './visual-state';
export function useDemo() {
  const [state, setState] = useState<DemoState>({ revision: -1, visual: INITIAL_VISUAL, presentation: { menuOpen: false } });
  useEffect(() => { const receive = (next: DemoState) => setState(old => old.revision > next.revision ? old : next); const off = window.demo.onState(receive); void window.demo.state().then(receive); return off; }, []);
  const action = useCallback((value: DemoAction) => { void window.demo.action(value); }, []);
  return { ...state, action };
}
