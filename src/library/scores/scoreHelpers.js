export function generateTrianglePoints(x, y, r) {
  return [
    [x, y - r / 2],
    [x - r, y + r / 2],
    [x + r, y + r / 2],
    [x, y] // center point, just used for collision detection
  ];
}

export function drawTriangle(ctx, trianglePoints, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(trianglePoints[0][0], trianglePoints[0][1]);
  ctx.lineTo(trianglePoints[1][0], trianglePoints[1][1]);
  ctx.lineTo(trianglePoints[2][0], trianglePoints[2][1]);
  ctx.fill();
}

// circle object has x, y, radius, color
export function drawCircle(ctx, circle) {
  ctx.fillStyle = circle.color;
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();
}

// Draw multiple circles as one path- much more performant than using individual paths,
// especially with high object counts
// `points` is an array of [x,y] tuple arrays
export function drawManyCircles(ctx, points, color, radius) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    ctx.moveTo(points[i][0], points[i][1]);
    ctx.arc(points[i][0], points[i][1], radius, 0, 2 * Math.PI);
  }
  ctx.fill();
}

export function drawMirroredVideo(
  ctx,
  video,
  videoWidth,
  videoHeight,
  x = 0,
  y = 0
) {
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-videoWidth, 0);
  ctx.drawImage(video, -x, -y, videoWidth, videoHeight);
  ctx.restore();
}
