let voices = [];
let currentVoice = 0;

let Voice = function() {
    this.osc = new p5.Oscillator();
    this.osc.setType("triangle");
    this.env = new p5.Envelope();
    this.env.setADSR(0.05, 0.1, 0.5, 2);
    this.env.setRange(0.9, 0);
    this.osc.start();
    this.osc.freq(440);
    this.osc.amp(this.env);
    // reverb.process(this.osc, 4, 2);
    voices.push(this);
};