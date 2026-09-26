/** Pure visual cues. IDs deduplicate transitions and pulses; no session or media. */
export type VisualState = { phase: string; cycle: number; step: number; notify: boolean };
export const INITIAL_VISUAL: VisualState = { phase: 'ready', cycle: 0, step: 0, notify: false };
