let Vertex = function(x, y, g) {
    this.pos = { x: x, y: y };
    this.edges = [];
    g.push(this);
    // var frequencies = [98.00, 123.47, 146.83, 196.00, 246.94, 293.66];
    let r = floor(random(6));
    // let r = floor(random(frequencies.length));
    this.freq = r;
    // this.freq = frequencies[r];
    // this.voice = new p5.Oscillator();
    // this.voice.setType("triangle");
    // this.env = new p5.Envelope();
    // this.env.setADSR(0.05, 0.1, 0.5, 2);
    // this.env.setRange(0.9, 0);
    // this.voice.start();
    // this.voice.freq(frequencies[r]);
    // this.voice.amp(this.env);
    this.functions = false;
};

Vertex.prototype.show = function() {
    stroke(0);
    // noFill();
    fill(255);
    ellipse(this.pos.x, this.pos.y, 15);
    if (this.functions) {
        // stroke(0);
        // noFill();
        // fill(200);
        ellipse(this.pos.x, this.pos.y, 25);

        ellipse(this.pos.x, this.pos.y, 20);
        fill(0);
        strokeWeight(0.5);
        if (this.functions == 1) {
            text("I", this.pos.x - 3, this.pos.y + 4);
        } else if (this.functions == 2) {
            text("ii", this.pos.x - 6, this.pos.y + 4);
        } else if (this.functions == 4) {
            text("IV", this.pos.x - 6, this.pos.y + 4);
        }
        strokeWeight(1);
    }
};

Vertex.prototype.addEdge = function(e) {
    this.edges.push(e);
};

Vertex.prototype.addFunction = function(n) {
    this.functions = n;
};