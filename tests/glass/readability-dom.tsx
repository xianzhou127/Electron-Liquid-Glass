import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { DemoToolbar } from '../../src/demo-controls';
import { visualFixture } from './visual-fixture';
import { readingRects, READING_REGION_COUNT, applyInkTones } from '../../src/glass/readability';
import '../../src/glass/ui.css';

function check(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

export async function verifyReadingDOM() {
  const oldReduced = document.documentElement.dataset.reduced;
  document.documentElement.dataset.reduced = 'true';
  const element = document.createElement('div'); element.className = 'capsule-shell has-material';
  element.dataset.reading = 'true'; element.dataset.readingReady = 'true'; document.body.append(element);
  const root = createRoot(element), fixture = visualFixture();
  const seen = new Map<string, unknown>();
  let lastPrimaryX: number | null = null;
  const render = () => {
    const state = fixture.state;
    flushSync(() => root.render(<DemoToolbar state={state} onPrimary={() => {}} onView={() => {}} />));
    if (!['ready', 'active', 'busy', 'done'].includes(state.phase)) return;
    applyInkTones(element, ['dark', 'light', 'dark', 'light', 'dark']);
    const rects = readingRects(element);
    check(rects.length === READING_REGION_COUNT, `${state.phase}: missing reading region`);
    const primary = element.querySelector<HTMLButtonElement>('.learning-primary')!;
    check(primary.scrollWidth <= primary.clientWidth, `${state.phase}: primary label clips`);
    if (lastPrimaryX !== null) check(primary.offsetLeft === lastPrimaryX, 'Primary action moved between states');
    lastPrimaryX = primary.offsetLeft;
    const label = element.querySelector<HTMLElement>('.toolbar-state')!;
    check(label.scrollWidth <= element.querySelector<HTMLElement>('.toolbar-status')!.clientWidth, `${state.phase}: status or timer clips`);
    const css = getComputedStyle(primary), context = getComputedStyle(element.querySelector('.toolbar-context')!);
    check(css.color === 'rgb(246, 250, 255)', 'Primary foreground did not adapt independently');
    check(context.color === 'rgb(21, 32, 47)', 'Status did not preserve independent dark ink');
    check(css.backgroundColor === 'rgba(0, 0, 0, 0)', 'Adaptive button paints a background patch');
    check(css.opacity === '1', `${state.phase}: processing text faded out`);
    check(parseFloat(context.fontSize) >= 9 && context.opacity === '1', 'Secondary text still too small or faded');
    for (const rect of rects) check(rect.x >= 6 && rect.y >= 6 && rect.x + rect.width <= 315 && rect.y + rect.height <= 46, 'Region exceeds capsule geometry');
    seen.set(state.phase, { rects, primaryColor: css.color, secondaryColor: context.color, secondaryFontSize: context.fontSize, primaryDisabled: primary.disabled });
    const sameMask = () => readingRects(element).every((r, i) => ['x', 'y', 'width', 'height'].every(key => Math.abs(r[key as keyof typeof r] - rects[i][key as keyof typeof r]) < .05));
    element.style.transform = 'translate3d(400.25px,250.5px,0)';
    check(sameMask(), 'Drag changes local reading mask');
    primary.style.transform = 'scale(.965)';
    check(sameMask(), 'Press changes local reading mask');
    primary.style.transform = ''; element.style.transform = '';
  };
  try {
    for (const phase of ['ready','active','busy','done']) { fixture.set(phase); render(); }
    check(seen.size === 4, 'Missing visual phase in layout verification');
    const primary = element.querySelector<HTMLElement>('.learning-primary')!;
    document.documentElement.dataset.reduced = 'false';
    void getComputedStyle(primary).color;
    applyInkTones(element, ['light', 'dark', 'light', 'dark', 'light']);
    void getComputedStyle(primary).color;
    const transition = primary.getAnimations().find(a => a instanceof CSSTransition && a.transitionProperty === 'color');
    const reducedByOS = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let midpoint: string | null = null;
    if (!reducedByOS) {
      check(transition, 'Foreground switches abruptly without CSS color transition');
      transition.pause(); transition.currentTime = 60;
      midpoint = getComputedStyle(primary).color;
      check(midpoint !== 'rgb(246, 250, 255)' && midpoint !== 'rgb(21, 32, 47)', 'Foreground has no intermediate color');
      transition.finish();
      check(getComputedStyle(primary).color === 'rgb(21, 32, 47)', 'Transition does not reach selected foreground');
    }
    document.documentElement.dataset.reduced = 'true';
    applyInkTones(element, ['dark', 'light', 'dark', 'light', 'dark']);
    check(getComputedStyle(primary).color === 'rgb(246, 250, 255)', 'Reduced motion does not switch instantly');
    element.dataset.reading = 'false';
    check(getComputedStyle(element.querySelector('.learning-toolbar')!).color === 'rgb(21, 32, 47)', 'Zero protection does not restore original foreground');
    return { states: Object.fromEntries(seen), foregroundTransition: { durationMs: 120, midpoint, reducedByOS, reducedMotion: 'pass' }, captureUsed: false, opticalPixelsRead: false, visualAcceptance: 'not evaluated' };
  } finally {
    root.unmount(); element.remove();
    if (oldReduced === undefined) delete document.documentElement.dataset.reduced; else document.documentElement.dataset.reduced = oldReduced;
  }
}
