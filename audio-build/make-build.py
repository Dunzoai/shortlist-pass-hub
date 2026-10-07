# Writes audio-build/build.sh (the ffmpeg mix) from the narration timings and the cue list. Clip ms x 1.25 = real ms.
import json, shlex
SP = 1.25
N = json.load(open("audio-build/script.json"))
OFF = {1: 0, 2: 20000, 3: 58000, 4: 88000, 5: 118000}
cues = []   # (file, clip_ms_start, clip_ms_end or None, semitones)
def c(scene, f, a, b=None, st=0): cues.append((f, OFF[scene] + a, None if b is None else OFF[scene] + b, st))
for t in (20000, 58000, 88000, 118000): cues.append(("wipe", t, None, 0))
# scene 1
c(1,"footsteps",1000,3600); c(1,"whoosh",5200); c(1,"swoosh",7000)
for i, t in enumerate((8000,9300,10300,11300,12300,13300)): c(1,"ping",t,None,2*i)
for t in (8300,9300,10300,11300,12300): c(1,"pop",t)
c(1,"chime",13500); c(1,"pop",17000)
# scene 2
c(2,"crickets",0,3300); c(2,"whoosh",3300); c(2,"bark",5000); c(2,"pop",6800); c(2,"swipe",9800); c(2,"typing",10500,13500); c(2,"send",13500)
c(2,"pop",15200); c(2,"pop",18000); c(2,"pop",20500); c(2,"typing",24000,24700); c(2,"pop",26000); c(2,"chime",28000)
c(2,"swipe",31000); c(2,"heart",32500); c(2,"lamp",35000); c(2,"snore",36300)
# scene 3
c(3,"footsteps",800,3200); c(3,"pop",3600); c(3,"pop",6200); c(3,"footsteps",9000,10800); c(3,"buzzer",11500); c(3,"pop",12000)
c(3,"swipe",14200); c(3,"notify",14800); c(3,"tap",21000); c(3,"chime",21200); c(3,"swipe",24000)
for t in (24800,25300,25800,26300,26800,27300): c(3,"heart",t)
# scene 4
c(4,"keyloop",500,16300)
for t in (2500,2880,3260,3640): c(4,"whoosh",t)
c(4,"pop",6500)
for t in (7600,8020,8440,8860,9280): c(4,"whoosh",t)
c(4,"rustle",11300); c(4,"stamp",14200); c(4,"tap",16300); c(4,"pop",17000); c(4,"ding",17500)
c(4,"footsteps",20500,25600); c(4,"slide",25200); c(4,"bag",26300)
for t in (28000,28450,28900): c(4,"heart",t)
c(4,"truck",20000,30000)
# scene 5
c(5,"footsteps",800,3200); c(5,"pop",3500)
for t in (8000,10200,12400): c(5,"tap",t); c(5,"done",t+120)   # 150 ms later = 120 clip ms
for k in range(6): c(5,"heart",14000+k*304)                     # every 380 real ms = 304 clip ms
c(5,"endchime",18000)

ins, fl, voices, sfxs = [], [], [], []
def add(path): ins.append(path); return len(ins) - 1
for i, n in enumerate(N):
    k = add(f"audio-build/voice/{n['id']}.mp3"); at = n["start_real_ms"]
    fl.append(f"[{k}:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay={at}|{at}[v{i}]"); voices.append(f"[v{i}]")
for j, (f, a, b, st) in enumerate(cues):
    k = add(f"audio-build/sfx/{f}.mp3"); at = round(a * SP); chain = "aformat=sample_rates=44100:channel_layouts=stereo"
    if st: chain += f",asetrate={round(44100*2**(st/12))},aresample=44100"
    if b is not None:
        d = (b - a) * SP / 1000
        chain += f",aloop=loop=-1:size=2000000,atrim=0:{d:.3f},afade=t=in:d=0.08,afade=t=out:st={max(0,d-0.15):.3f}:d=0.15"
    fl.append(f"[{k}:a]{chain},adelay={at}|{at}[s{j}]"); sfxs.append(f"[s{j}]")
m = add("audio-build/music/bed.mp3")
fl.append("".join(voices) + f"amix=inputs={len(voices)}:normalize=0:dropout_transition=0,asplit=2[vox][vsc]")
fl.append("".join(sfxs) + f"amix=inputs={len(sfxs)}:normalize=0:dropout_transition=0,volume=-12dB[fx]")
fl.append(f"[{m}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=-22dB,apad,atrim=0:175[mus]")
fl.append("[mus][vsc]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=500[duck]")
fl.append("[vox][fx][duck]amix=inputs=3:normalize=0:dropout_transition=0,apad,atrim=0:175,loudnorm=I=-16:TP=-1.5:LRA=11[out]")
open("audio-build/filter.txt", "w").write(";\n".join(fl))
cmd = "#!/bin/bash\n# Rebuilds audio-build/hoa-clip-audio.mp3 (175 s, 128k, about -16 LUFS). Run from the repo root: bash audio-build/build.sh\nset -e\n"
cmd += "ffmpeg -y -loglevel error " + " ".join(f"-i {shlex.quote(p)}" for p in ins) + " -filter_complex_script audio-build/filter.txt -map '[out]' -t 175 -ar 44100 -ac 2 -b:a 128k audio-build/hoa-clip-audio.mp3\n"
open("audio-build/build.sh", "w").write(cmd)
print(len(ins), "inputs,", len(cues), "effect cues")
