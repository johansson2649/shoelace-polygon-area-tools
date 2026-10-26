/**
 * Shoelace-formula area and centroid for simple polygons.
 *
 * Vertices may be supplied as [x, y] pairs or { x, y } objects, or a mix.
 * The polygon is treated as closed: the last vertex is implicitly connected
 * to the first. The caller should NOT duplicate the first vertex at the end,
 * since that introduces a zero-length edge whose cross-product contribution
 * is zero for area but is not zero for the centroid formula.
 */

/**
 * Extract the x-coordinate from a vertex, accepting either a tuple
 * [x, y] or an object { x, y }.
 * @param {[number, number] | { x: number, y: number }} v
 * @returns {number}
 */
function getX(v) {
  return Array.isArray(v) ? v[0] : v.x;
}

/**
 * Extract the y-coordinate from a vertex.
 * @param {[number, number] | { x: number, y: number }} v
 * @returns {number}
 */
function getY(v) {
  return Array.isArray(v) ? v[1] : v.y;
}

/**
 * Compute the signed area of a simple polygon via the shoelace formula.
 *
 * Positive for counter-clockwise winding, negative for clockwise.
 * The polygon is implicitly closed — the last vertex connects back to the
 * first without the caller duplicating it.
 *
 * @param {Array<[number, number] | { x: number, y: number }>} vertices
 * @returns {number} signed area in coordinate-square units
 */
export function signedArea(vertices) {
  if (!Array.isArray(vertices) || vertices.length < 3) {
    return 0;
  }

  let sum = 0;
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % n];
    sum += getX(a) * getY(b) - getX(b) * getY(a);
  }
  return sum / 2;
}

/**
 * Compute the centroid (area-weighted geometric center) of a simple polygon.
 *
 * Uses the standard closed-form centroid formula derived from the shoelace
 * decomposition. The polygon is implicitly closed.
 *
 * The centroid formula divides by the signed area. When the area is exactly
 * zero (degenerate polygon — all vertices collinear, or fewer than three
 * vertices) we return { x: 0, y: 0 } rather than NaN. This is a deliberate,
 * documented choice rather than throwing, because polygon pipelines often
 * encounter degenerate inputs and prefer a defined sentinel over an
 * exception that interrupts a batch.
 *
 * @param {Array<[number, number] | { x: number, y: number }>} vertices
 * @returns {{ x: number, y: number }}
 */
export function centroid(vertices) {
  if (!Array.isArray(vertices) || vertices.length < 3) {
    return { x: 0, y: 0 };
  }

  const n = vertices.length;
  let cx = 0;
  let cy = 0;
  let area2 = 0; // twice the signed area

  for (let i = 0; i < n; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % n];
    const cross = getX(a) * getY(b) - getX(b) * getY(a);
    area2 += cross;
    cx += (getX(a) + getX(b)) * cross;
    cy += (getY(a) + getY(b)) * cross;
  }

  if (area2 === 0) {
    return { x: 0, y: 0 };
  }

  const area = area2 / 2;
  return { x: cx / (6 * area), y: cy / (6 * area) };
}
