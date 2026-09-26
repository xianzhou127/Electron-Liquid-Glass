export type Rect = { x: number; y: number; width: number; height: number };
export const TOOLBAR = { width: 309, height: 40 };
export function constrain(rect: Rect, area: Rect): Rect {
  const width = Math.min(rect.width, area.width), height = Math.min(rect.height, area.height);
  return { x: Math.round(Math.max(area.x, Math.min(rect.x, area.x + area.width - width))), y: Math.round(Math.max(area.y, Math.min(rect.y, area.y + area.height - height))), width, height };
}
export function adjacentBounds(anchor: Rect, area: Rect, size: { width: number; height: number }) {
  // Leave a small physical rounding allowance for fractional Windows display scale.
  const safeArea = { x: area.x + 2, y: area.y + 2, width: area.width - 4, height: area.height - 4 };
  const below = safeArea.y + safeArea.height - anchor.y - anchor.height - 8;
  const above = anchor.y - safeArea.y - 8;
  const direction = below >= size.height || below >= above ? "down" : "up";
  const height = Math.min(size.height, Math.max(1, direction === "down" ? below : above));
  const bounds = constrain({ x: anchor.x + anchor.width - size.width, y: direction === "down" ? anchor.y + anchor.height + 8 : anchor.y - height - 8, width: size.width, height }, safeArea);
  return { bounds, direction } as const;
}
