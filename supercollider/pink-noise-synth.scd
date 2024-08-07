(
SynthDef.new(\pinkTest, {
    arg freq = 220, mod = 3;
    var sig1, sig2, lfo, lfo2, env;
    env = XLine.kr(0.15, 0.001, 10, 1, 0, 2);
    // env2 = XLine.kr(0.35, 0.001, 7, 1, 0, 2);
    lfo = SinOsc.kr(mod);
    lfo2 = SinOsc.kr(ExpRand(20,800), mul: 0.75, add:1);
    env = env * lfo;
    // sig1 = LFTri.ar((frequency + 1)) * env;
    // sig2 = LFTri.ar(frequency) * env;

    sig1 = PinkNoise.ar(mul: 0.2);
    sig2 = PinkNoise.ar(mul: 0.2);
    sig1 = Ringz.ar(sig1, freq, 15, 0.2) * env;
    sig2 = Ringz.ar(sig2, freq + 1, 15, 0.2) * env;


    // sig1 = FreeVerb.ar(sig1, mix: 0.3, room: 0.95, damp: 0.15, mul: 1, add: 0);
    // sig2 = FreeVerb.ar(sig2, mix: 0.3, room: 0.95, damp: 0.15, mul: 1, add: 0);
    Out.ar(0, sig1);
    Out.ar(1, sig2);
}).add;
)

s.boot;

(
SynthDef.new(\pulseTest, {
    arg freq = 220, mod = 3;
    var sig1, sig2, lfo, lfo2, env;
    env = XLine.kr(0.25, 0.001, 3, 1, 0, 2);
    lfo = SinOsc.kr(mod);
    lfo2 = SinOsc.kr(ExpRand(20,800), mul: 0.75, add:1);
    env = env * lfo;
    sig1 = LFTri.ar((freq + 1)) * env;
    sig2 = LFTri.ar(freq) * env;
    sig1 = FreeVerb.ar(sig1, mix: 0.3, room: 0.95, damp: 0.15, mul: 1, add: 0);
	sig2 = FreeVerb.ar(sig2, mix: 0.3, room: 0.95, damp: 0.15, mul: 1, add: 0);
    Out.ar(0, sig1);
    Out.ar(1, sig2);
}).add;
)


(
OSCdef.new(
    \fromnode,
    {
        arg msg, time, addr, port;
        d = Synth.new(\pinkTest, [
            \freq, msg[1] * [1, 2, 4].choose,
            \mod, [0.1, 0.5, 1, 3, 6].choose
        ]);
		d = Synth.new(\pulseTest, [
            \freq, msg[1] * [0.5, 1, 2].choose,
            \mod, [0.1, 0.5, 1, 3, 6].choose
        ]);
    },
    '/hello/from/oscjs'
);
)