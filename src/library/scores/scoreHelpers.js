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

export function drawMirroredVideo(ctx, video, videoWidth, videoHeight) {
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-videoWidth, 0);
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  ctx.restore();
}
