# shoelace-polygon-area-tools

Computes the signed area and centroid of a simple polygon from its vertex coordinates using the shoelace formula.

```js
import { signedArea, centroid } from "shoelace-polygon-area-tools";

const square = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 4 },
  { x: 0, y: 4 },
];

const area = signedArea(square); // 16
const c = centroid(square);     // { x: 2, y: 2 }
```

The library exists to give a single, dependency-free source for these two computations — the kind of thing you find yourself inlining repeatedly and getting the winding or the centroid factor wrong. Only simple (non-self-intersecting) polygons are supported. If you pass a self-intersecting polygon you will get a number, but it will not represent the physical area you probably want; no validation is performed because doing so correctly would require a segment-intersection routine that dwarfs the shoelace formula itself.

Input vertices may be given either as `[x, y]` pairs or as `{ x, y }` objects, and you can mix the two within a single array. The polygon is treated as closed automatically — the last vertex is implicitly connected back to the first — so you should not duplicate the first vertex at the end. Doing so is harmless for `signedArea` (the zero-length closing edge contributes nothing), but it will shift the centroid slightly because the closing edge's cross-product becomes a small non-zero value that is not balanced.

A polygon with fewer than three vertices has zero area and its centroid is `{ x: 0, y: 0 }`. The centroid of a degenerate polygon whose signed area rounds to exactly zero is likewise `{ x: 0, y: 0 }`; computing a "midpoint of the vertex set" instead would be a different function with different semantics.

`signedArea` returns a positive value for counter-clockwise winding and negative for clockwise. Use `Math.abs` on the result if you only care about magnitude.
