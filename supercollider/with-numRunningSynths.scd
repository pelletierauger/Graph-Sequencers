(
SynthDef("numRunning", { arg out;
    Out.ar(out, SinOsc.ar(NumRunningSynths.ir * 200 + 400, 0, 0.1));
}).add;
)

s.sendMsg("/s_new", "numRunning", -1, 0, 0);
s.sendMsg("/s_new", "numRunning", -1, 0, 0);
s.sendMsg("/s_new", "numRunning", -1, 0, 0);
s.sendMsg("/s_new", "numRunning", -1, 0, 0);