let Vertex = function(x, y, g) {
    this.pos = { x: x, y: y };
    this.edges = [];
    g.push(this);
    var frequencies = [98.00, 123.47, 146.83, 196.00, 246.94, 293.66];
    let r = floor(random(frequencies.length));
    this.freq = frequencies[r];
    // this.voice = new p5.Oscillator();
    // this.voice.setType("triangle");
    // this.env = new p5.Envelope();
    // this.env.setADSR(0.05, 0.1, 0.5, 2);
    // this.env.setRange(0.9, 0);
    // this.voice.start();
    // this.voice.freq(frequencies[r]);
    // this.voice.amp(this.env);
};

Vertex.prototype.show = function() {
    stroke(0);
    // noFill();
    fill(200);
    ellipse(this.pos.x, this.pos.y, 15);
};

Vertex.prototype.addEdge = function(e) {
    this.edges.push(e);
};