let cloudyPoints = new ShaderProgram("cloudy-points");

cloudyPoints.vertText = `
    // beginGLSL
    ${pi}
    ${matrixTransforms}
    attribute vec4 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float albedo;
    void main(void) {
        albedo = coordinates.w;
        float ratio = resolution.y / resolution.x;
        vec4 pos = vec4(coordinates.xyz, 1.0);
        // pos.x *= 16./9.;
        // pos = translate(0., 0., 2.) * yRotate(time*5e-4) * xRotate(time*5e-4) * pos;
        pos = zRotate(time*0.5e-2) * pos;
        pos = translate(0.5, 0.0, 0.0) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 256.0;
        // gl_PointSize = 15.0;
    }
    // endGLSL
`;
cloudyPoints.fragText = `
    // beginGLSL
    precision mediump float;
    varying float albedo;
    ${mapFunction}
    ${rand}
    void main(void) {
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
        float rando = rand(pos);
        float x = 1.0-length(pos*2.);
        x = 1.0-dot(pos*2., pos*2.);
        x = max(0., x) * max(0., x);
        // x += floor(x+1.)-floor(x+0.99);
        // gl_FragColor = vec4(vec3(1., 0., x).brr, x*0.125);
        float tint = albedo;
        tint = pow(tint, 7.);
        x *= 1.-tint;
        gl_FragColor = vec4(vec3(0.5, 0., 0.)*tint, x*0.5);
    }
    // endGLSL
`;
cloudyPoints.init();

let cloudyPoints2 = new ShaderProgram("cloudy-points-2");

cloudyPoints2.vertText = `
    // beginGLSL
    ${pi}
    ${matrixTransforms}
    ${mapFunction}
    attribute vec4 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float albedo;
    varying float alpha;
    void main(void) {
        alpha = coordinates.z;
        albedo = coordinates.w;
        float ratio = resolution.y / resolution.x;
        vec4 pos = vec4(coordinates.xy, 1.0, 1.0);
        // pos.x *= 16./9.;
        // pos = translate(0., 0., 2.) * yRotate(time*5e-4) * xRotate(time*5e-4) * pos;
        pos = zRotate(time*0.5e-2) * pos;
        pos = translate(0.5, 0.0, 0.0) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.);
        gl_PointSize = 156.0;
        gl_PointSize = map(albedo, 0., 1., 256., 50.) * alpha;
        // gl_PointSize = 15.0;
    }
    // endGLSL
`;
cloudyPoints2.fragText = `
    // beginGLSL
    precision mediump float;
    varying float alpha;
    varying float albedo;
    ${mapFunction}
    ${rand}
    void main(void) {
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
        float rando = rand(pos);
        float x = 1.0-length(pos*2.);
        x = smoothstep(0., 1., x);
        // x = 1.0-dot(pos*2., pos*2.);
        // x = max(0., x) * max(0., x);
        // x += floor(x+1.)-floor(x+0.99);
        // gl_FragColor = vec4(vec3(1., 0., x).brr, x*0.125);
        float tint = albedo;
        // tint = pow(tint, 7.);
        // x *= 1.-tint;
        gl_FragColor = vec4(vec3(1., pow(x,5.)*0.25, pow(x,5.)*0.25), x*tint*2.);
    }
    // endGLSL
`;
cloudyPoints2.init();

makeClouds = function() {
    function map(n, start1, stop1, start2, stop2) {
        return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    }
    clouds = [];
    // let padding = 100;
    // let d = p + 40;
    for (let i = 0; i < 2850; i++) {
        let x = map(Math.random(), 0, 1, -3, 3);
        let y = map(Math.random(), 0, 1, -3, 3);
        let z = map(Math.random(), 0, 1, 0.5, 0.95);
        let tint = map(Math.random(), 0, 1, 0, 1);
        x *= (16/9);
        clouds.push([x, y, z, tint]);
    }
};
makeClouds();


setCamera = function() {
    let d, x, y;
    if (!walkers[0].walking) {
        x = walkers[0].v.pos.x;
        y = walkers[0].v.pos.y;
    } else {
        d = map(walkers[0].walked, 0, walkers[0].distanceToWalk, 0, 1);
        x = lerp(walkers[0].v.pos.x, walkers[0].goalV.pos.x, d);
        y = lerp(walkers[0].v.pos.y, walkers[0].goalV.pos.y, d);
    }
    camera = {
        x: x, y: y
    };
    friction = 0.1;
};
// setCamera();

updateCamera = function(x, y) {
    let p = camera;
    let vx = (p.x - p.oldx)*friction,
        vy = (p.y - p.oldy)*friction;
    p.oldx = p.x;
    p.oldy = p.y;
    // p.oldx = x, p.oldy = y;
    p.x += x * vx;
    p.y += y * vy;
};


collisions = [];

addCollision = function(x, y, v) {
    let alpha = map(v, 0, 0.03, 0.5, 1);
    // logJavaScriptConsole(alpha);
    let velocity = map(v, 0, 0.03, 0.95, 0.8);
    collisions.push([x, y, 1, velocity, alpha]);
};

updateCollisions = function() {
    for (let i = collisions.length-1; i >= 0 ; i--) {
        collisions[i][2] *= collisions[i][3];
        if (collisions[i][2] <= 0.001) {
            collisions.splice(i, 1);
        }
    }
};