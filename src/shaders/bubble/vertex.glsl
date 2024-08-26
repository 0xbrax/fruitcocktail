precision mediump float;

attribute vec2 aPosition;
attribute float aSize;
attribute float aSpeed;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;
uniform float uPixelRatio;
uniform float uTime;
uniform float uScale;
uniform float uMaxX;
uniform float uMaxY;

uniform sampler2D uPerlin;

varying float vPositionY;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}



void main() {
    vec2 newPosition = aPosition;
    float normalizedY = aPosition.y / uMaxY;

    newPosition.y = newPosition.y - (uTime * 1.5 * aSpeed);

    float noiseX = texture2D(uPerlin, vec2(0.53, normalizedY)).a - 0.4; // one channel only
    float noiseStrength = 0.25;
    noiseX *= noiseStrength;
    newPosition.x = newPosition.x + (uTime * noiseX);

    // positions reset for infinite loop
    newPosition.y = mod(newPosition.y, uMaxY);
    newPosition.x = mod(newPosition.x, uMaxX);



    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(newPosition, 1.0)).xy, 0.0, 1.0);
    gl_PointSize = 30.0 * uPixelRatio * uScale * aSize;

    vPositionY = remap(newPosition.y, 0.0, uMaxY, 0.0, 0.5);
}