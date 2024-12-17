// modvel
(
SynthDef(\kling, {
    arg vel = 0;
    var sc = BufRateScale.ir(b);
    var rate = sc * (Rand(0.0,0.5)+9).midiratio;
    var sig = PlayBuf.ar(2, b, rate: rate, doneAction: 0);
    var sig2 = PlayBuf.ar(2, d, rate: rate, doneAction: 2);
    var pan = Rand(-0.2,0.2);
    sig = Balance2.ar(sig[0], sig[1], -0.65);
    sig2 = Balance2.ar(sig2[0], sig2[1], -0.65);
    sig2 = VadimFilter.ar(sig2, 4000, 0, 1);
    sig = sig * 4 + (sig2 * vel.linlin(0.0001, 0.03, 0.2, 0.5));
    sig = VadimFilter.ar(sig, max(100, min(10000,((vel+0.001).linexp(0.0001,0.03,900,3000)))), resonance: 0, type: 1);
    sig = sig * XLine.kr(1, 0.001, (vel+0.0001).linexp(0.0001, 0.03, 2, 9), doneAction: 2) * 3;
    // sig = sig * (vel+0.0001).linexp(0.0001,0.03,1.75,2.5);
    Out.ar(0, sig * 0.75);
}).add;
)