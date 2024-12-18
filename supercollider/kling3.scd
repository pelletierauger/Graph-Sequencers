// low
(
SynthDef(\kling, {
    arg vel = 0;
    var sc = BufRateScale.ir(b);
    var rate = sc * (Rand(0.0,0.5)+9).midiratio;
    var sig = PlayBuf.ar(2, b, rate: rate, 
                  doneAction: 0);
    var sig2 = PlayBuf.ar(2, d, rate: rate, 
                  doneAction: 2);
    var pan = Rand(-0.2,0.2);
    var ff = (vel+0.001).linexp(
                  0.0001,0.03,900,3000);
    ff = max(100, min(10000, ff));
    sig = Balance2.ar(sig[0], sig[1], -0.65);
    sig2 = Balance2.ar(sig2[0], sig2[1], -0.65);
    sig2 = VadimFilter.ar(sig2, 4000, 0, 1);
    sig = sig * 4 + 
              (sig2 * vel.linlin(0.0001, 0.03, 0.2, 0.5));
    sig = VadimFilter.ar(sig, ff, 0, 1);
    sig = sig * XLine.kr(
            1, 0.001, 
            (vel+0.0001).linexp(0.0001, 0.03, 2, 9),
            doneAction: 2
        ) * 3;
    // sig = sig * 
    // (vel+0.0001).linexp(0.0001,0.03,1.75,2.5);
    Out.ar(0, sig * 0.75);
}).add;
//~js.("walkers[0].teleport()");
~js.("reformGraph()");
~js.("flip('blue')");
~s.();
)


// mid
(
SynthDef(\kling, {
    arg vel = 0;
    var bal = Balance2, vad = VadimFilter;
    var sc = BufRateScale.ir(b);
    var rate = sc * (Rand(0, 0.5)+19).midiratio;
    var sig = PlayBuf.ar(2, b, rate: rate, 
                  doneAction: 0);
    var sig2 = PlayBuf.ar(2, d, rate: rate, 
                  doneAction: 2);
    var pan = Rand(-0.2,0.2);
    var ff = (vel+0.001);
    ff = ff.linexp(0.0001,0.03,2000,4000);
    ff = max(100, min(10000, ff));
    sig = bal.ar(sig[0], sig[1], -0.65);
    sig2 = bal.ar(sig2[0], sig2[1], -0.65);
    sig2 = vad.ar(sig2, 6000, 0, 1);
    sig = sig + 
          (sig2*vel.linlin(0.0001,0.03,0.2,0.5));
    sig = vad.ar(sig, ff, 0, 1);
    sig = sig * 
          (vel+0.0001).linexp(0.0001,0.03,1.75,2.5);
    Out.ar(0, sig * 2 * 0.5);
}).add;
//~js.("walkers[0].teleport()");
~js.("reformGraph()");
~js.("flip('red')");
~s.();
)

// high
(
SynthDef(\kling, {
    arg vel = 0;
    var bal = Balance2, vad = VadimFilter;
    var sc = BufRateScale.ir(b);
    var rate = sc * (Rand(0.0,0.5)+24).midiratio;
    var sig = PlayBuf.ar(2, b, rate: rate, 
                  doneAction: 0);
    var sig2 = PlayBuf.ar(2, d, rate: rate, 
                  doneAction: 2);
    var pan = Rand(-0.2,0.2);
    var ff = vel+0.001;
    ff = ff.linexp(0.0001,0.03,2000,4000);
    ff = max(100,min(10000,ff));
    sig = bal.ar(sig[0], sig[1], -0.65);
    sig2 = bal.ar(sig2[0], sig2[1], -0.65);
    sig2 = vad.ar(sig2, 5000, 0, 1);
    sig = sig +
          (sig2 * vel.linlin(0.0001,0.03,0.2,0.5));
    sig = vad.ar(sig,ff,0,1);
    sig = sig *
          (vel+0.0001).linexp(0.0001,0.03,1.75,2.5);
    Out.ar(0, sig * 1.5 * 1.5);
}).add;
~js.("reformGraph()");
//~js.("walkers[0].teleport()");
~js.("flip('green')");
~s.();
)



(
~s = {
{
var f = ~toFreq.("B2")*(-1.midiratio);
var l = Line.kr(1,0,17);
var op1 = SinOsc.ar(f*18)*42000*l;
WhiteNoise.ar()*0.0125!2*Line.kr(1,0,3,doneAction:2);}.play;
};
~s.();
)

~s.();