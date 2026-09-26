import js from '@eslint/js';
import ts from 'typescript-eslint';
export default ts.config(
  { ignores: ['dist/**', 'node_modules/**', 'artifacts/**', '.local/**'] },
  js.configs.recommended, ...ts.configs.recommended,
  { languageOptions: { globals: Object.fromEntries(['window','document','navigator','location','performance','devicePixelRatio','innerWidth','innerHeight','requestAnimationFrame','cancelAnimationFrame','matchMedia','ResizeObserver','MutationObserver','Element','HTMLElement','HTMLButtonElement','HTMLCanvasElement','HTMLVideoElement','HTMLInputElement','HTMLSelectElement','Node','Text','DOMMatrixReadOnly','PointerEvent','MouseEvent','KeyboardEvent','FocusEvent','Event','CSSTransition','WebGL2RenderingContext','MediaStream','MediaStreamTrack','ImageData','OffscreenCanvas','getComputedStyle','setTimeout','clearTimeout','setInterval','clearInterval','console','process','Buffer','__dirname','URL','URLSearchParams','Response','fetch','structuredClone'].map(k => [k, 'readonly'])) }, rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }], '@typescript-eslint/no-empty-function':'off', 'no-empty':['error',{allowEmptyCatch:true}], 'prefer-const':'error' } },
  { files:['scripts/**/*.mjs','scripts/**/*.cjs'], languageOptions:{globals:{require:'readonly'}}, rules:{'@typescript-eslint/no-require-imports':'off'} }
);
