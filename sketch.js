let looping = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/sketch";
let maxFrames = 20;
let g, w;
// let wave;

function setup() {
    socket = io.connect('http://localhost:8080');
    cnvs = createCanvas(windowWidth, windowWidth / 16 * 9);
    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');
    frameRate(30);
    background(200);
    fill(0);
    stroke(0);
    // noStroke();
    g = new Graph();
    if (!looping) {
        noLoop();
    }
    let padding = 100;
    for (let i = 0; i < 20; i++) {
        let x = random(padding, width - padding);
        let y = random(padding, height - padding);
        let v = new Vertex(x, y, g.vertices);
    }
    for (let i = 0; i < 30; i++) {
        let r1 = floor(random(g.vertices.length));
        let r2 = floor(random(g.vertices.length));
        g.createEdge(g.vertices[r1], g.vertices[r2]);
    }
    let rW = floor(random(g.vertices.length));
    w = new Walker(g.vertices[rW]);
    // wave = new p5.Oscillator();
    // wave.setType("sine");
    // wave.start();
    // wave.amp(0.4);
    // wave.freq(440);
}

function draw() {
    background(200);

    g.move();
    g.show();
    w.show();
    if (frameCount % 5 == 0) {
        w.jump();
        w.v.env.play();
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
}