let looping = false;
let traversing = false;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/sketch";
let maxFrames = 20;
let g, w;
// let wave;
let p = 20;
// let reverb;
let traversed = 0;

function setup() {
    socket = io.connect('http://localhost:8080');
    cnvs = createCanvas(windowWidth, windowHeight);
    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');
    textFont('Inconsolata');

    // reverb = new p5.Reverb();
    frameRate(30);
    background(255);
    fill(0);
    stroke(0);
    // noStroke();
    g = new Graph();
    if (!looping) {
        noLoop();
    }

    for (let i = 0; i < 30; i++) {
        let voice = new Voice();
    }

    let padding = 100;
    // for (let i = 0; i < 100; i++) {
    //     let d = p + 40;
    //     // let p = d + 30;
    //     let x = random((width - height) * 0.5 + d, (((width - height) * 0.5) + d + height - (d * 2) * 0.5) - d);
    //     let y = random(d, height - d);
    //     let v = new Vertex(x, y, g.vertices);
    // }
    // for (let i = 0; i < 99; i++) {
    //     let r1 = floor(random(g.vertices.length));
    //     let r2 = floor(random(g.vertices.length));
    //     g.createEdge(g.vertices[r1], g.vertices[r2]);
    // }
    for (let i = 0; i < 100; i++) {
        let x = (cos(i) * i * frameCount) + width / 2;
        let y = (sin(i) * i * frameCount) + height / 2;
        let v = new Vertex(x, y, g.vertices);
    }
    for (let i = 0; i < 99; i++) {
        let r1 = i;
        let r2 = i + 1;
        g.createEdge(g.vertices[r1], g.vertices[r2]);
    }
    for (let i = 0; i < 2; i++) {
        let ran = floor(random(g.vertices.length));
        g.vertices[ran].addFunction(1);
        ran = floor(random(g.vertices.length));
        g.vertices[ran].addFunction(1);
        ran = floor(random(g.vertices.length));
        g.vertices[ran].addFunction(2);
        ran = floor(random(g.vertices.length));
        g.vertices[ran].addFunction(4);
    }
    for (let i = 0; i < 3; i++) {
        let rW = floor(random(g.vertices.length));
        w = new Walker(g.vertices[rW]);
    }

    // wave = new p5.Oscillator();
    // wave.setType("sine");
    // wave.start();
    // wave.amp(0.4);
    // wave.freq(440);
}

function draw() {
    background(255);
    stroke(0);
    noFill();
    rect((width - height) * 0.5, p, p + height - (p * 2) * 0.5, height - (p * 2));
    for (let i = 0; i < 100; i++) {
        let osc = 10 + frameCount * 0.0001;
        let x = (cos(i * osc) * i * 3.5) + width / 2;
        let y = (sin(i * osc) * i * 3.5) + height / 2;
        g.vertices[i].pos.x = x;
        g.vertices[i].pos.y = y;
        // let v = new Vertex(x, y, g.vertices);
    }
    g.move();
    g.show();
    if (traversing) {
        for (let i = 0; i < walkers.length; i++) {
            if (traversed > 4) {
                walkers[i].show();
            }
            if (looping) {
                if (!walkers[i].walking) {
                    walkers[i].startWalking();
                }
                if (walkers[i].walking) {
                    walkers[i].walk();
                }
            }
        }
        if (traversed < 10) {
            traversed++;
        }
    }



    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
}

function keyPressed() {
    if (keyCode === 32) {
        if (looping) {
            noLoop();
            looping = false;
        } else {
            loop();
            looping = true;
        }
    }
    if (key == 'p' || key == 'P') {
        frameExport();
    }
    if (key == 'r' || key == 'R') {
        window.location.reload();
    }
    if (key == 'm' || key == 'M') {
        redraw();
    }
    if (key == 'l' || key == 'L') {
        traversing = true;
    }
}