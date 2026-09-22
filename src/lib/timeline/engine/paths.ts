// Builds a simple square bridge between the start and the end of a `committment` node
export function bridgePathSimple(
  startX: number,
  endX: number,
  laneY: number,
  axisY: number,
  options: { openEnded?: boolean } = {},
): string {
  const { openEnded = false } = options;

  // Move the starting point, draw a line from the axis to the lane
  const rise = `
    M ${startX} ${axisY} 
    L ${startX} ${laneY}
  `;

  // `ongoing` is `true`: rise once, and then simply draw a line towards the end, i.e. the end of the domain in this case
  if (openEnded) {
    return `
      ${rise} 
      L ${endX} ${laneY}
    `;
  }

  // Draw a line to the `endX` along the lane and then draw a line back to the axis
  return `
    ${rise} 
    L ${endX} ${laneY}
    L ${endX} ${axisY}
  `;
}

// Builds a smooth bridge between the start and the end of a `committment` node
export function bridgePathCurved(
  startX: number,
  endX: number,
  laneY: number,
  axisY: number,
  options: { curve?: number; openEnded?: boolean } = {},
): string {
  const { curve = 70, openEnded = false } = options;

  // The control point of the rise, pulling the line in its direction to create the curve.
  const riseQuadraticBezierControlPoint = `${startX} ${laneY}`;

  // Half of the distance between the start and the end of the x
  const span = (endX - startX) / 2;
  // If the passed-in curve is larger than the span, we get weird shapes, so we take the min value between the two
  const _curve = Math.min(curve, span);
  // The larger the `riseEndX` value in this case, the smoother will be the curve
  const riseEndX = startX + _curve;
  // Then end point, where the curve ends on the lanes
  const riseQuandraticBezierEndPoint = `${riseEndX} ${laneY}`;

  const rise = `
    M ${startX} ${axisY} 
    Q ${riseQuadraticBezierControlPoint}, ${riseQuandraticBezierEndPoint}
  `;

  // `ongoing` is `true`: rise once, and then simply draw a line towards the end, i.e. the end of the domain in this case
  if (openEnded) {
    return `${rise} L ${endX} ${laneY}`;
  }

  // Since we have a curve here, the `endX` needs to be adjusted by substracting the value we assigned to `_curve`
  // The smaller this value, the smoother will be the curve
  const fallStartX = endX - _curve;

  // The control point of the fall, pulling the line in its direction to create the curve.
  const fallQuadraticBezierControlPoint = `${endX} ${laneY}`;
  // Then end point, where the curve ends on the baseline/axis
  const fallQuandraticBezierEndPoint = `${endX} ${axisY}`;

  return `
    ${rise} 
    L ${fallStartX} ${laneY} 
    Q ${fallQuadraticBezierControlPoint}, ${fallQuandraticBezierEndPoint}
  `;
}

// Simple vertical connector for a `project` node
export function stemPath(x: number, laneY: number, axisY: number): string {
  return `
    M ${x} ${axisY} 
    L ${x} ${laneY}
  `;
}
