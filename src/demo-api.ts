import type { VisualState } from './visual-state';
export type Role = 'orb' | 'appearance';
export type DemoAction = 'cycle' | 'pulse' | 'toggle-menu' | 'collapse' | 'appearance' | 'hide' | 'show' | 'quit' | 'toggle-material' | 'toggle-motion' | 'move-left' | 'move-right' | 'move-up' | 'move-down';
export type DemoPresentation = { menuOpen: boolean };
export type DemoState = { revision: number; visual: VisualState; presentation: DemoPresentation };
export interface DemoApi {
  state(): Promise<DemoState>;
  onState(callback: (state: DemoState) => void): () => void;
  action(action: DemoAction): Promise<void>;
  menuHeight(height: number): void;
}
declare global { interface Window { demo: DemoApi } }
