import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { signedArea, centroid } from "../src/core.js";

describe("signedArea", () => {
  it("computes the area of a unit square (counter-clockwise)", () => {
    const square = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];
    assert.equal(signedArea(square), 1);
  });

  it("returns a negative value for clockwise winding", () => {
    const cw = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
    ];
    assert.equal(signedArea(cw), -1);
  });

  it("scales with the square of side length", () => {
    const big = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ];
    assert.equal(signedArea(big), 16);
  });

  it("computes a triangle area correctly", () => {
    const tri = [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 4 },
    ];
    assert.equal(signedArea(tri), 12);
  });

  it("accepts [x, y] tuple vertices", () => {
    const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
    assert.equal(signedArea(sq), 1);
  });

  it("accepts a mix of tuple and object vertices", () => {
    const mixed = [
      [0, 0],
      { x: 1, y: 0 },
      [1, 1],
      { x: 0, y: 1 },
    ];
    assert.equal(signedArea(mixed), 1);
  });

  it("returns 0 for fewer than three vertices", () => {
    assert.equal(signedArea([]), 0);
    assert.equal(signedArea([{ x: 1, y: 2 }]), 0);
    assert.equal(signedArea([{ x: 1, y: 2 }, { x: 3, y: 4 }]), 0);
  });

  it("returns 0 for a non-array input", () => {
    assert.equal(signedArea(null), 0);
    assert.equal(signedArea(undefined), 0);
  });

  it("returns 0 for collinear points", () => {
    const line = [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 10 },
    ];
    assert.equal(signedArea(line), 0);
  });
});

describe("centroid", () => {
  it("computes the centroid of a square", () => {
    const sq = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ];
    const c = centroid(sq);
    assert.ok(Math.abs(c.x - 2) < 1e-12);
    assert.ok(Math.abs(c.y - 2) < 1e-12);
  });

  it("computes the centroid of a right triangle", () => {
    const tri = [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 4 },
    ];
    const c = centroid(tri);
    assert.ok(Math.abs(c.x - 2) < 1e-12);
    assert.ok(Math.abs(c.y - (4 / 3)) < 1e-12);
  });

  it("returns {0,0} for a degenerate (collinear) polygon", () => {
    const line = [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 10 },
    ];
    assert.deepEqual(centroid(line), { x: 0, y: 0 });
  });

  it("returns {0,0} for fewer than three vertices", () => {
    assert.deepEqual(centroid([]), { x: 0, y: 0 });
    assert.deepEqual(centroid([{ x: 1, y: 2 }]), { x: 0, y: 0 });
  });

  it("accepts tuple vertices", () => {
    const sq = [[0, 0], [2, 0], [2, 2], [0, 2]];
    const c = centroid(sq);
    assert.ok(Math.abs(c.x - 1) < 1e-12);
    assert.ok(Math.abs(c.y - 1) < 1e-12);
  });

  it("handles a non-origin-centered polygon", () => {
    const offset = [
      { x: 10, y: 10 },
      { x: 14, y: 10 },
      { x: 14, y: 14 },
      { x: 10, y: 14 },
    ];
    const c = centroid(offset);
    assert.ok(Math.abs(c.x - 12) < 1e-12);
    assert.ok(Math.abs(c.y - 12) < 1e-12);
  });
});
