import P5 from "p5";

const width = 640;
const height = 420;
// const vs = `
//   attribute vec3 aPosition;
//   void main() {
//      vec4 positionVec4 = vec4(aPosition, 1.0);

//      gl_Position = positionVec4;
// }
// `;

// const fs = `
// uniform vec2 u_resolution;
// uniform float u_time;
// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     gl_FragColor=vec4(st.x,st.y,0.0,1.0);
// }
// `;

let vs = `
  precision highp float;

  attribute vec3 aPosition;

  void main() {
     vec4 positionVec4 = vec4(aPosition, 1.0);

     gl_Position = positionVec4;
}
`;

let fs = `
  precision highp float;
  uniform vec2 resolution;
  uniform sampler2D uSampler;
  uniform float time;

  float random(float n) {
    return fract(sin(n*318.154121)*31.134131);
}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    return o4.y * d.y + o4.x * (1.0 - d.y);
}

  void main() {

    vec2 texUv = gl_FragCoord.xy;
    texUv = resolution.x/resolution.y* texUv;
    texUv =  (gl_FragCoord.xy - gl_FragCoord.xy*.5) / resolution;
    texUv.y = 1.-texUv.y;

    // texUv = fract(texUv * 4.);

    vec2 texUv2 = texUv;
    vec2 texUv3 = texUv;

    float xxx = fract(time) * 100.;
    float xNoise = noise(vec3(texUv.x * xxx, texUv.y, time));
    xNoise = step(.4, xNoise) *.1;
    // texUv.x -= xNoise;

    float r = texture2D(uSampler, texUv - vec2(0., xNoise * .5)).r;
    float g = texture2D(uSampler, texUv - vec2(0., xNoise * .24)).g;
    float b = texture2D(uSampler, texUv - vec2(0., xNoise * .18)).b;

    b += .3;
    // g = 1. - g;

    // float xNoise2 = noise(vec3(.1, texUv.y*150., time)).1;
    // texUv.x -= xNoise;
    // float g = texture2D(uSampler, texUv2).y;
    vec4 color = pow(vec4(r, g, b, 1.), vec4(1.2, 1.1, 4.8, 1.));
    vec4 color2 = pow(vec4(r, g, b, 1.), vec4(1.2, 1.1, 4.8, 1.));
    float rrr = color2.x + color2.y + color2.z;
    rrr /= 3.5;

    gl_FragColor = color;
}
`;

const sketch = (p: P5) => {
  let videoImage: P5.Element | null = null;
  let theShader: any = null;

  p.setup = () => {
    p.createCanvas(width, height, p.WEBGL);
    videoImage = p.createCapture(p.VIDEO);
    // theShader = p.createShader(vs, fs);
    // theShader.setUniform("u_resolution", [width, height]);
    // theShader.setUniform("u_time", 0);
    // p.quad(-1, -1, -1, 1, 1, 1, 1, -1);
    // // videoImage.hide();

    p.noStroke();
    theShader = p.createShader(vs, fs);

    // p.shader(theShader);
  };

  p.draw = () => {
    if (videoImage !== null) {
      p.image(videoImage, -width * 0.5, -height * 0.5, 0, 0);
    }
    p.shader(theShader);
    p.quad(-1, -1, -1, 1, 1, 1, 1, -1);
    theShader.setUniform("resolution", [width, height]);
    theShader.setUniform("uSampler", videoImage);
    theShader.setUniform("time", p.frameCount * 0.1);

    // theShader.setUniform("u_time", p.frameCount * 0.01);
    // p.shader(theShader);
    // p.resetShader();
  };
};

export default sketch;
