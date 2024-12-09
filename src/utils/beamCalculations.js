export function calculateBeamDeflection(E, I, w, L, x) {
  // Calculate beam deflection using the simplified equation for a simply supported beam
  // v(x) = (wx/24EI)(L³ - 2Lx² + x³)
  const EI = E * I;
  return (w * x * (Math.pow(L, 3) - 2 * L * Math.pow(x, 2) + Math.pow(x, 3))) / (24 * EI);
}

export function generateDeflectionPoints(E, I, w, L, numPoints = 100) {
  const points = [];
  const step = L / numPoints;
  
  for (let x = 0; x <= L; x += step) {
    const deflection = calculateBeamDeflection(E, I, w, L, x);
    points.push({ x, y: deflection });
  }
  
  return points;
}