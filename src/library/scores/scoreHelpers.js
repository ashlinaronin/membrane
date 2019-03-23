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

export function drawMirroredVideoWithMask(
  ctx,
  video,
  videoWidth,
  videoHeight,
  x = 0,
  y = 0,
  // mask is array of point "2-tuples"
  mask = [[0, 0], [videoWidth / 2, videoHeight]]
) {
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-videoWidth, 0);
  ctx.drawImage(video, -x, -y, videoWidth, videoHeight);
  ctx.restore();

  const [maskTopLeft, maskBottomRight] = mask;
  ctx.fillStyle = "white";
  ctx.fillRect(
    maskTopLeft[0],
    maskTopLeft[1],
    maskBottomRight[0],
    maskBottomRight[1]
  );
}
