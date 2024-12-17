b = Buffer.read(s, "/Users/guillaumepelletier/Desktop/Signora-Demo/mso-bleep1.wav");
b = Buffer.read(s, "/Users/guillaumepelletier/Desktop/Signora-Demo/mso-bleep1b.wav");
c = Buffer.read(s, "/Users/guillaumepelletier/Desktop/Signora-Demo/mso-bleep2.wav");
d = Buffer.read(s, "/Users/guillaumepelletier/Desktop/Signora-Demo/mso-bleep3.wav");
d = Buffer.read(s, "/Users/guillaumepelletier/Desktop/Signora-Demo/mso-bleep4.wav");
b = Buffer.read(s, "/Users/guillaumepelletier/Desktop/Signora-Demo/mso-bleep1-96k.wav");
b.play
c.play;
s.unmute;

Synth.new(\kling)

(
SynthDef(\kling, {
    var sc = BufRateScale.ir(b);
    var sig = PlayBuf.ar(2, b, rate: sc * 0.midiratio, doneAction: 2);
    Out.ar(0, sig * 5);
}).add;
)

(
SynthDef(\kling, {
    arg punch = 0;
    var sc = BufRateScale.ir(b);
    var sig = PlayBuf.ar(2, b, rate: sc * -12.midiratio, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    pan = 0;
    sig = VadimFilter.ar(sig, max(4000, min(10000,(punch*60000))), resonance: 0, type: 1);
    sig = Balance2.ar(sig[0], sig[1], pan);
    Out.ar(0, sig * 2);
}).add;
)


(
SynthDef(\kling, {
    arg punch = 0;
    var sig = PlayBuf.ar(2, b, rate: 0.midiratio, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    sig = VadimFilter.ar(sig, Rand(1000,6000)+min(10000,(punch*60000)), resonance: 0, type: 1);
    // sig * 4;
    // sig = MiWarps.ar(
    //     sig, sig, lev1: 0.5, lev2: 2,
    //     algo: 3, timb: 0.4, osc:0, freq: ~toFreq.("E0"), easteregg:0) * 0.2;
    //     sig = [sig[0][0], sig[1][0]];
    sig = Balance2.ar(sig[0], sig[1], pan);
    Out.ar(0, sig * 0.5);
}).add;
)

(
OSCdef.new(
    \fromnode,
    {
        arg msg, time, addr, port;
        // [msg, time, addr, port].postln;
        // msg[1].postln;
        // d = Synth.new(\pinkTest, [\frequency, msg[1] * 2]);
        // d = Synth.new(\pulseTest, [\frequency, msg[1] * 0.5]);
        Synth.new(\kling, [\punch, msg[1]]);
    },
    '/hello/from/oscjs'
);
)


(
OSCdef.new(
    \fromnode,
    {
        arg msg, time, addr, port;
        // [msg, time, addr, port].postln;
        // msg[1].postln;
        // d = Synth.new(\pinkTest, [\frequency, msg[1] * 2]);
        // d = Synth.new(\pulseTest, [\frequency, ~toMidi.("A2")]);
        Synth.new(\kling, [\vel, msg[1], \buf, b]);
    },
    '/hello/from/oscjs'
);
)

(
OSCdef.new(
    \fromnode,
    {
        arg msg, time, addr, port;
        Synth.new(\klingB, [\vel, msg[1], \buf, [b, c].choose]);
    },
    '/hello/from/oscjs'
);
)

2.linlin(0,1,0,10)

(
SynthDef(\kling, {
    arg vel = 0;
    var sc = BufRateScale.ir(b);
    var sig = PlayBuf.ar(2, b, rate: sc * -5.midiratio, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    // sig = VadimFilter.ar(sig, max(100, min(20000,(punch*240000))), resonance: 0, type: 1);
    sig = VadimFilter.ar(sig, max(100, min(10000,((vel+0.001).linexp(0.0001,0.03,2000,10000)))), resonance: 0, type: 1);
    sig = sig * (vel+0.0001).linexp(0.0001,0.03,1.0,3.0);
    sig = Balance2.ar(sig[0], sig[1], pan);
    Out.ar(0, sig * 1);
}).add;
)


(
SynthDef(\klingB, {
    arg vel = 0, buf;
    var sc = BufRateScale.ir(buf);
    var sig = PlayBuf.ar(2, buf, rate: sc * (Rand(0,4)+24).midiratio, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    // sig = VadimFilter.ar(sig, max(100, min(20000,(punch*240000))), resonance: 0, type: 1);
    sig = VadimFilter.ar(sig, max(100, min(10000,((vel+0.001).linexp(0.0001,0.03,2000,6000)))), resonance: 0, type: 1);
    // sig = VadimFilter.ar(sig, 1500, 0, 5) * 8;
    // sig = sig * XLine.kr(1,0.001,1) * 3;
    // sig = sig * (vel+0.0001).linexp(0.0001,0.03,1.75,3.0);
    sig = Balance2.ar(sig[0], sig[1], -0.65);
    Out.ar(0, sig * 3);
}).add;
)

(-12..12).choose
// The winnner
(
SynthDef(\kling, {
    arg vel = 0;
    var sc = BufRateScale.ir(b);
    var sig = PlayBuf.ar(2, b, rate: sc * (Rand(0,4)+24).midiratio, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    // sig = VadimFilter.ar(sig, max(100, min(20000,(punch*240000))), resonance: 0, type: 1);
    sig = VadimFilter.ar(sig, max(100, min(10000,((vel+0.001).linexp(0.0001,0.03,2000,6000)))), resonance: 0, type: 1);
    // sig = VadimFilter.ar(sig, 1500, 0, 5) * 8;
    // sig = sig * XLine.kr(1,0.001,1) * 3;
    sig = sig * (vel+0.0001).linexp(0.0001,0.03,1.75,3.0);
    sig = Balance2.ar(sig[0], sig[1], -0.65);
    Out.ar(0, sig * 1);
}).add;
)



// modvel
(
SynthDef(\kling, {
    arg vel = 0;
    var sc = BufRateScale.ir(b);
    var rate = sc * (Rand(0.0,0.5)+24).midiratio;
    var sig = PlayBuf.ar(2, b, rate: rate, doneAction: 0);
    var sig2 = PlayBuf.ar(2, d, rate: rate, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    sig = Balance2.ar(sig[0], sig[1], -0.65);
    sig2 = Balance2.ar(sig2[0], sig2[1], -0.65);
    sig2 = VadimFilter.ar(sig2, 5000, 0, 1);
    sig = sig + (sig2 * vel.linlin(0.0001, 0.03, 0.2, 0.5));
    // sig = XFade2.ar(sig, sig2, vel.linlin(0.0001, 0.03, -1.0, 1.0));
    // sig = VadimFilter.ar(sig, max(100, min(20000,(punch*240000))), resonance: 0, type: 1);
    sig = VadimFilter.ar(sig, max(100, min(10000,((vel+0.001).linexp(0.0001,0.03,2000,4000)))), resonance: 0, type: 1);
    // sig = VadimFilter.ar(sig, 1500, 0, 5) * 8;
    // sig = sig * XLine.kr(1,0.001,1) * 3;
    sig = sig * (vel+0.0001).linexp(0.0001,0.03,1.75,2.5);
    Out.ar(0, sig * 1.5 * 1.5);
}).add;
)


// modvel
(
SynthDef(\kling, {
    arg vel = 0;
    var sc = BufRateScale.ir(b);
    var rate = sc * (Rand(0,4)+19).midiratio;
    var sig = PlayBuf.ar(2, b, rate: rate, doneAction: 0);
    var sig2 = PlayBuf.ar(2, d, rate: rate, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    sig = Balance2.ar(sig[0], sig[1], -0.65);
    sig2 = Balance2.ar(sig2[0], sig2[1], -0.65);
    sig2 = VadimFilter.ar(sig2, 6000, 0, 1);
    sig = sig + (sig2 * vel.linlin(0.0001, 0.03, 0.2, 0.5));
    // sig = XFade2.ar(sig, sig2, vel.linlin(0.0001, 0.03, -1.0, 1.0));
    // sig = VadimFilter.ar(sig, max(100, min(20000,(punch*240000))), resonance: 0, type: 1);
    sig = VadimFilter.ar(sig, max(100, min(10000,((vel+0.001).linexp(0.0001,0.03,2000,4000)))), resonance: 0, type: 1);
    // sig = VadimFilter.ar(sig, 1500, 0, 5) * 8;
    // sig = sig * XLine.kr(1,0.001,1) * 3;
    sig = sig * (vel+0.0001).linexp(0.0001,0.03,1.75,2.5);
    Out.ar(0, sig * 2 * 1.5);
}).add;
)

(
SynthDef(\kling, {
    arg vel = 0;
    var sc = BufRateScale.ir(b);
    var sig = PlayBuf.ar(2, b, rate: sc * 5.midiratio, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    // sig = VadimFilter.ar(sig, max(100, min(20000,(punch*240000))), resonance: 0, type: 1);
    sig = VadimFilter.ar(sig, max(100, min(10000,((vel+0.001).linexp(0.0001,0.03,2000,10000)))), resonance: 0, type: 1);
    sig = sig * (vel+0.0001).linexp(0.0001,0.03,1.0,3.0);
    sig = Balance2.ar(sig[0], sig[1], pan);
    Out.ar(0, sig * 0.5);
}).add;
)