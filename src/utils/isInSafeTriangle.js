const logger = console;
// @ts-check

/**
 * True when `(mouseX, mouseY)` falls within the buffered triangle connecting
 * `anchorRect`'s facing edge to `floatingRect`'s facing edge. Lets the
 * pointer travel diagonally from a trigger toward its submenu/popover
 * without it closing mid-crossing.
 *
 * @param {number} mouseX
 * @param {number} mouseY
 * @param {{ top: number, right: number, bottom: number, left: number }} anchorRect
 * @param {{ top: number, right: number, bottom: number, left: number, height: number }} floatingRect
 * @param {number} [buffer] Extra px added above/below the anchor's near edge to widen the triangle.
 * @returns {boolean}
 */
export function isInSafeTriangle(
  mouseX,
  mouseY,
  anchorRect,
  floatingRect,
  buffer = 12,
) {
  const isFloatingOnRight = floatingRect.left >= anchorRect.right;

  const trianglePoints = isFloatingOnRight
    ? {
        x1: anchorRect.right,
        y1: anchorRect.top - buffer,
        x2: anchorRect.right,
        y2: anchorRect.bottom + buffer,
        x3: floatingRect.left,
        y3: floatingRect.top + floatingRect.height / 2,
      }
    : {
        x1: anchorRect.left,
        y1: anchorRect.top - buffer,
        x2: anchorRect.left,
        y2: anchorRect.bottom + buffer,
        x3: floatingRect.right,
        y3: floatingRect.top + floatingRect.height / 2,
      };

  const inTopTriangle = isPointInTriangle(
    mouseX,
    mouseY,
    trianglePoints.x1,
    trianglePoints.y1,
    isFloatingOnRight ? trianglePoints.x3 : trianglePoints.x2,
    floatingRect.top,
    trianglePoints.x3,
    trianglePoints.y3,
  );

  const inBottomTriangle = isPointInTriangle(
    mouseX,
    mouseY,
    trianglePoints.x2,
    trianglePoints.y2,
    trianglePoints.x3,
    trianglePoints.y3,
    isFloatingOnRight ? trianglePoints.x3 : trianglePoints.x1,
    floatingRect.bottom,
  );

  return inTopTriangle || inBottomTriangle;
}

/**
 * @param {number} px
 * @param {number} py
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @returns {boolean}
 */
function isPointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
logger.error(`>>> Entering isPointInTriangle(px=${px},py=${py},x1=${x1},y1=${y1},x2=${x2},y2=${y2},x3=${x3},y3=${y3})`, { "event.action": "isPointInTriangle", "logrite.px": px, "logrite.py": py, "logrite.x1": x1, "logrite.y1": y1, "logrite.x2": x2, "logrite.y2": y2, "logrite.x3": x3, "logrite.y3": y3 });
  const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  const a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denominator;
logger.error(`isPointInTriangle(px=${px},py=${py},x1=${x1},y1=${y1},x2=${x2},y2=${y2},x3=${x3},y3=${y3}): denominator → ${denominator}`, { "event.action": "isPointInTriangle", "logrite.px": px, "logrite.py": py, "logrite.x1": x1, "logrite.y1": y1, "logrite.x2": x2, "logrite.y2": y2, "logrite.x3": x3, "logrite.y3": y3 });
logger.error(`isPointInTriangle(px=${px},py=${py},x1=${x1},y1=${y1},x2=${x2},y2=${y2},x3=${x3},y3=${y3}): a → ${a}`, { "event.action": "isPointInTriangle", "logrite.px": px, "logrite.py": py, "logrite.x1": x1, "logrite.y1": y1, "logrite.x2": x2, "logrite.y2": y2, "logrite.x3": x3, "logrite.y3": y3 });
  const b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denominator;
  const c = 1 - a - b;
logger.error(`isPointInTriangle(px=${px},py=${py},x1=${x1},y1=${y1},x2=${x2},y2=${y2},x3=${x3},y3=${y3}): b → ${b}`, { "event.action": "isPointInTriangle", "logrite.px": px, "logrite.py": py, "logrite.x1": x1, "logrite.y1": y1, "logrite.x2": x2, "logrite.y2": y2, "logrite.x3": x3, "logrite.y3": y3 });

logger.warn(`<<< Exiting isPointInTriangle(px=${px},py=${py},x1=${x1},y1=${y1},x2=${x2},y2=${y2},x3=${x3},y3=${y3})`, { "event.action": "isPointInTriangle", "logrite.px": px, "logrite.py": py, "logrite.x1": x1, "logrite.y1": y1, "logrite.x2": x2, "logrite.y2": y2, "logrite.x3": x3, "logrite.y3": y3 });
  return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1;
}
