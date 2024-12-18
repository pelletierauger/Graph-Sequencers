(
var dir = "/Volumes/Volumina/Clouds/Clouds - Sample Pack 005/Hit/";
var sf = PathName.new(dir);
~hits = [];
sf.entries.do({| path, i |
    if (path.extension == "wav", {
        ~hits = ~hits.add(Buffer.read(s, path.fullPath));
        // path.postln;
    });
});
~hits.size;
)

~hits.size;


Synth(\samplerStereo, [\buf, ~hits[4], \amp, 0.03]);

~s = {Synth(\samplerStereo, [\buf, ~hits[0], \amp, 0.03])};

~s = {Synth(\samplerStereo, [\buf, ~hits[4], \amp, 0.03])};
~s = {Synth(\samplerStereo, [\buf, ~hits.choose, \amp, 0.03])};

(
SynthDef(\samplerStereo, {
    arg buf, rate = 1, spos = 0, pan = 0, amp = 1, out = 0;
    var sig = PlayBuf.ar(
        numChannels: 2,
        bufnum: buf,
        rate: rate * BufRateScale.ir(buf),
        startPos: spos * BufSampleRate.ir(buf),
        doneAction: 2
    ) * amp;
    sig = Pan2.ar(sig, pan);
    Out.ar(out, sig);
}).add;
)