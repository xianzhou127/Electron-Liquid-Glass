import { useLayoutEffect, useRef } from 'react';
import type { VisualState } from './visual-state';
import type { DemoAction } from './demo-api';
function Glyph({ name }: { name: 'grip' | 'play' | 'pulse' | 'menu' }) {
  return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true">{name === 'grip' ? <path d="M8 5v2m8-2v2M8 11v2m8-2v2M8 17v2m8-2v2"/> : name === 'play' ? <path d="m8 5 11 7-11 7Z"/> : name === 'pulse' ? <path d="m3 12 5 0 3-7 3 14 3-7h4"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}</svg>;
}
const labels: Record<string,string> = {ready:'演示 · 静止', active:'演示 · 活跃', busy:'演示 · 过渡', done:'演示 · 提示'};
export function DemoToolbar({ state, onPrimary, onView, menuOpen = false }: { state: VisualState; onPrimary: () => void; onView: (value: DemoAction) => void; menuOpen?: boolean }) {
  return <main className="learning-toolbar" data-phase={state.phase} aria-label="玻璃演示工具条">
    <button className="toolbar-grip" aria-label="拖动工具条" title="拖动移动；方向键微调" onKeyDown={e => { const action = {ArrowLeft:'move-left',ArrowRight:'move-right',ArrowUp:'move-up',ArrowDown:'move-down'}[e.key] as DemoAction | undefined; if(action) { e.preventDefault(); onView(action); } }}><Glyph name="grip"/></button>
    <div className="toolbar-status"><div className="toolbar-state"><span className="state-dot"/><strong role="status">{labels[state.phase] ?? state.phase}</strong>{state.phase === 'active' && <time>01</time>}</div><button className="toolbar-context" onClick={() => onView('appearance')}>真实桌面 · 本机材质</button></div>
    <button className="primary learning-primary" onClick={onPrimary}><span className="primary-symbol"><Glyph name="play"/></span><span>切换演示</span></button>
    <button className={`toolbar-feedback ${state.notify ? 'is-ready' : ''}`} aria-label="提示脉冲" onClick={() => onView('pulse')}><Glyph name="pulse"/></button>
    <button className="toolbar-more" aria-label="更多" aria-expanded={menuOpen} onClick={() => onView('toggle-menu')}><Glyph name="menu"/></button>
  </main>;
}
export function DemoMenu({ onView, onHeight, open = true }: { onView: (action: DemoAction) => void; onHeight?: (height:number) => void; open?: boolean }) {
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if(!content.current || !onHeight) return; const node = content.current; const observer = new ResizeObserver(() => onHeight(node.offsetHeight)); observer.observe(node); return () => observer.disconnect(); }, [onHeight]);
  return <main className="learning-more floating-surface" data-open={open} inert={!open} aria-label="玻璃演示菜单"><div ref={content} className="menu-content">
    <header><strong>液态玻璃演示</strong><button className="icon-button" aria-label="收起更多" onClick={() => onView('collapse')}>×</button></header>
    <button onClick={() => onView('appearance')}>外观调参</button><button onClick={() => onView('pulse')}>提示动效（演示）</button><button onClick={() => onView('toggle-material')}>开启 / 关闭材质</button><button onClick={() => onView('toggle-motion')}>开启 / 关闭动效</button>
    <div className="menu-divider"/><div className="menu-utilities"><button onClick={() => onView('hide')}>隐藏到托盘</button><button onClick={() => onView('quit')}>退出演示</button></div><p>背景仅在本机渲染，不上传或归档。</p>
  </div></main>;
}
