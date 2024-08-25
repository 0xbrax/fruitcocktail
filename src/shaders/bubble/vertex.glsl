attribute vec2 aVertexPosition;
attribute float aSize;
attribute float aSpeed;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;
uniform float uTime;
uniform float uScale;
uniform sampler2D uPerlin;
uniform float uMaxY;

varying float vPositionY;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}



void main() {
    vec2 newPosition = aVertexPosition;

    newPosition.y = newPosition.y - (uTime * 1.5 * aSpeed);
    newPosition.y = mod(newPosition.y, uMaxY);



    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(newPosition, 1.0)).xy, 0.0, 1.0);
    gl_PointSize = 30.0 * uScale * aSize;

    vPositionY = remap(newPosition.y, 0.0, uMaxY, 0.0, 0.5);
}