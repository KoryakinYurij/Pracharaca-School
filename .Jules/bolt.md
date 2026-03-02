# Bolt's Journal

## ⚡ BackgroundShapes.tsx useFrame loop optimization

Found a hotspot in the `useFrame` render loop in `BackgroundShapes.tsx` where math operations dependent only on invariant physics properties (drift, spin, phase) were being recalculated every frame for every shape. Also found it was using an `Array.prototype.forEach` loop, which allocates a closure function every frame.

**Learnings**:
*   React Three Fiber's `useFrame` runs up to 60+ times per second. Moving math invariants out of this loop significantly reduces CPU overhead.
*   Replacing `.forEach` with a standard `for` loop in `useFrame` avoids per-frame closure allocation and execution overhead.
*   Measured a ~20-25% improvement in execution speed of the logic via a microbenchmark (`node --experimental-strip-types` benchmarking the original `.forEach` with dynamic math vs precalculated constants in a `for` loop).
