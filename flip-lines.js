flip = function(col) {
    let flipString = ``;
    switch (col) {
        case "blue": 
        flipString = `gl_FragColor.rgb = gl_FragColor.gbr;`;
        break;
        case "red":
        flipString = ``;
        break;
        case "green":
        flipString = `gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 3.45);`;
        break;
    }
    smoothLine3D.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    ${blendingMath}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float rando = rand(pos);
        vec2 fwh = vec2(wh.x*2., wh.y+(wh.x*2.));
        vec2 uv = uvs * fwh;
        uv -= fwh * 0.5;
        float radius = wh.x;
        vec2 size = fwh * 0.5 - radius;
        radius *= 2.;
        float col = length(max(abs(uv), size) - size) - radius;
        col = min(col * -1. * (1. / radius), 1.0);
        col = pow(col, 3.) * 0.75 + pow(col, 43.);
        col = smoothstep(0., 1., col);
        // col = mix(pow(col, 10.)*0.25, col, sin(time*0.1+pos.y*0.5e1)*0.5+0.5);
                // c2l =x(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
                col = mix(pow(col, 10.)*0.2, col, sin(-t*0.1+length(pos * vec2(16./9.,1.))*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        ${flipString}
    }
    // endGLSL
`;
smoothLine3D.vertText = smoothLine3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothLine3D.fragText = smoothLine3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothLine3D.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("smooth-line-3D");
    gl.useProgram(currentProgram);
}
};



reformGraph = function() {
    // g = new Graph();
    g.edges = [];
    if (!walkers[0].walking && !walkers[0].sleeping) {
        walkers[0].startWalking();
    }
    let a = walkers[0].v;
    let b = walkers[0].goalV;
    a.edges = [];
    b.edges = [];
    for (let i = 0; i < g.vertices.length; i++) {
        g.vertices[i].edges = [];
    }
    // g.vertices.push(a, b);
    g.createEdge(a, b);
    for (let i = 0; i < 200; i++) {
        let r1 = floor(random(g.vertices.length));
        let v1 = g.vertices[r1].pos;
        let candidates = [];
        let choice;
        for (let j = 0; j < 50; j++) {
            let r2 = floor(random(g.vertices.length));
            if (r2 !== r1) {
                candidates.push(r2);
            }
        }
        let d = Infinity;
        for (let j = 0; j < candidates.length; j++) {
            let v2 = g.vertices[candidates[j]].pos;
            let dd = dist(v1.x, v1.y, v2.x, v2.y);
            if (dd < d) {
                choice = candidates[j];
                d = dd;
            }
        }
        g.createEdge(g.vertices[r1], g.vertices[choice]);
    }
};

if (false) {

reformGraph = function() {
    // g = new Graph();
    g.edges = [];
    if (!walkers[0].walking && !walkers[0].sleeping) {
        walkers[0].startWalking();
    }
    let a = walkers[0].v;
    let b = walkers[0].goalV;
    a.edges = [];
    b.edges = [];
    let d, x, y;
    if (!walkers[0].walking) {
        x = walkers[0].v.pos.x;
        y = walkers[0].v.pos.y;
    } else {
        d = map(walkers[0].walked, 0, walkers[0].distanceToWalk, 0, 1);
        x = lerp(walkers[0].v.pos.x, walkers[0].goalV.pos.x, d);
        y = lerp(walkers[0].v.pos.y, walkers[0].goalV.pos.y, d);
    }
    for (let i = 0; i < g.vertices.length; i++) {
        g.vertices[i].edges = [];
    }
    // g.vertices.push(a, b);
    g.createEdge(a, b);
    for (let i = 0; i < g.vertices.length; i++) {
        let v = g.vertices[i].pos;
        let d = dist(v.x, v.y, x, y);
        if (d > 1.5) {
            do {
            let newX = map(Math.random(), 0, 1, -0.9, 0.9);
            let newY = map(Math.random(), 0, 1, -0.9, 0.9);
            newX *= (16/9);
            newX += x, newY += y;
            v.x = newX, v.y = newY;
            } while (dist(v.x, v.y, x, y) < 1.5);
        }
    }
    for (let i = 0; i < 400; i++) {
        let r1 = floor(random(g.vertices.length));
        let v1 = g.vertices[r1].pos;
        let candidates = [];
        let choice;
        for (let j = 0; j < 12; j++) {
            let r2 = floor(random(g.vertices.length));
            if (r2 !== r1) {
                candidates.push(r2);
            }
        }
        let d = Infinity;
        for (let j = 0; j < candidates.length; j++) {
            let v2 = g.vertices[candidates[j]].pos;
            let dd = dist(v1.x, v1.y, v2.x, v2.y);
            if (dd < d) {
                choice = candidates[j];
                d = dd;
            }
        }
        g.createEdge(g.vertices[r1], g.vertices[choice]);
    }
};

}



reformGraph2 = function() {
    // g = new Graph();
    g.edges = [];
    g.vertices = [];
    if (!walkers[0].walking && !walkers[0].sleeping) {
        walkers[0].startWalking();
    }
    let a = walkers[0].v;
    let b = walkers[0].goalV;
    a.edges = [];
    b.edges = [];
    g.vertices.push(a, b);
    g.createEdge(a, b);
    let padding = 100;
    for (let i = 0; i < 200; i++) {
        let d = p + 40;
        let x = map(Math.random(), 0, 1, -0.9, 0.9);
        let y = map(Math.random(), 0, 1, -0.9, 0.9);
        x *= (16/9);
        let v = new Vertex(x, y, g.vertices);
    }
    for (let i = 0; i < 200; i++) {
        let r1 = floor(random(g.vertices.length));
        let v1 = g.vertices[r1].pos;
        // let r2;
        let candidates = [];
        let choice;
        for (let j = 0; j < 50; j++) {
            let r2 = floor(random(g.vertices.length));
            if (r2 !== r1) {
                candidates.push(r2);
            }
        }
        let d = Infinity;
        for (let j = 0; j < candidates.length; j++) {
            let v2 = g.vertices[candidates[j]].pos;
            let dd = dist(v1.x, v1.y, v2.x, v2.y);
            if (dd < d) {
                choice = candidates[j];
                d = dd;
            }
        }
        g.createEdge(g.vertices[r1], g.vertices[choice]);
    }
    walkers[0].v = g.edges[0].a;
    walkers[0].goalV = g.edges[0].b;
};
reformGraph2();

reformGraphHard = function() {
    // g = new Graph();
    g.edges = [];
    g.vertices = [];
    let padding = 100;
    for (let i = 0; i < 200; i++) {
        let d = p + 40;
        let x = map(Math.random(), 0, 1, -0.9, 0.9);
        let y = map(Math.random(), 0, 1, -0.9, 0.9);
        x *= (16/9);
        let v = new Vertex(x, y, g.vertices);
    }
    for (let i = 0; i < 200; i++) {
        let r1 = floor(random(g.vertices.length));
        let v1 = g.vertices[r1].pos;
        // let r2;
        let candidates = [];
        let choice;
        for (let j = 0; j < 50; j++) {
            let r2 = floor(random(g.vertices.length));
            if (r2 !== r1) {
                candidates.push(r2);
            }
        }
        let d = Infinity;
        for (let j = 0; j < candidates.length; j++) {
            let v2 = g.vertices[candidates[j]].pos;
            let dd = dist(v1.x, v1.y, v2.x, v2.y);
            if (dd < d) {
                choice = candidates[j];
                d = dd;
            }
        }
        g.createEdge(g.vertices[r1], g.vertices[choice]);
    }
    walkers[0].v = g.edges[0].a;
    walkers[0].goalV = g.edges[0].b;
};
//reformGraphHard();