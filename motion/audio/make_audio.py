#!/usr/bin/env python3
"""QuickTools promo — generative music bed + UI sound design (numpy).
Layers kept separate: voice (generated elsewhere) / music / sfx.
Usage: python3 make_audio.py <en|fr>   (reads timeline-<lang>.json)
Outputs: music-<lang>.wav, sfx-<lang>.wav, mix-<lang>.wav (voice+music+sfx)
"""
import json, sys, os
import numpy as np

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
lang = sys.argv[1] if len(sys.argv) > 1 else "en"
TL = json.load(open(os.path.join(HERE, f"../timeline-{lang}.json")))

dur_s = (TL["total"] + 1500) / 1000.0
N = int(dur_s * SR)
t = np.arange(N) / SR
music = np.zeros(N)
sfx = np.zeros(N)

def put(buf, at_s, sig):
    i = int(at_s * SR)
    if i < 0: return
    j = min(N, i + len(sig))
    buf[i:j] += sig[: j - i]

def env(n, a=0.01, r=0.08, total=None):
    e = np.ones(n)
    ai, ri = int(a * SR), int(r * SR)
    e[:ai] *= np.linspace(0, 1, ai)
    e[-ri:] *= np.linspace(1, 0, ri)
    return e

# ---------------- MUSIC ----------------
# Chord progression (one bar ~4.7s): Am → F → C → G, warm and sparse.
CHORDS = [
    [110.00, 220.00, 261.63, 329.63],   # Am
    [ 87.31, 174.61, 220.00, 261.63],   # F
    [130.81, 196.00, 261.63, 329.63],   # C
    [ 98.00, 196.00, 246.94, 293.66],   # G
]
BAR = dur_s / 8.0  # 8 bars over the whole film

def pad_chord(freqs, length, fade=1.6):
    n = int(length * SR)
    x = np.arange(n) / SR
    s = np.zeros(n)
    for k, f in enumerate(freqs):
        det = 1.0 + 0.0015 * ((k % 2) * 2 - 1)
        g = 0.5 if k < 2 else 0.34           # lows slightly louder
        s += g * np.sin(2 * np.pi * f * det * x)
        s += 0.16 * np.sin(2 * np.pi * f * 2 * x)   # airy octave
    e = np.ones(n)
    ai, ri = int(0.9 * SR), int(fade * SR)
    e[:ai] *= np.linspace(0, 1, ai) ** 2
    e[-ri:] *= np.linspace(1, 0, ri)
    return s * e * 0.16

for bar in range(8):
    put(music, bar * BAR, pad_chord(CHORDS[bar % 4], BAR + 0.4))

# Soft pluck arpeggio from scene B onward, brighter & faster in scene D.
def pluck(f, length=0.5, g=0.05):
    n = int(length * SR)
    x = np.arange(n) / SR
    return g * np.sin(2 * np.pi * f * x) * np.exp(-x * 7)

BPM = 92.0
step = 60.0 / BPM / 2  # 8th notes
ti = TL["b0"] / 1000.0
bar = 2
i = 0
while ti < (TL["e0"] + 1500) / 1000.0:
    inD = TL["d0"] / 1000.0 <= ti < (TL["d1"] + 800) / 1000.0
    chord = CHORDS[bar % 4]
    seq = [2, 3, 1, 3]                       # chord-tone pattern (octave up)
    f = chord[seq[i % 4]] * 2
    g = 0.055 * (1.5 if inD else 1.0)
    put(music, ti, pluck(f, 0.45, g))
    if inD:                                  # energy: off-beat fifth
        put(music, ti + step / 2, pluck(chord[3] * 3, 0.3, 0.03))
    ti += step
    i += 1
    if i % 8 == 0:
        bar += 1

# Gentle pulse (kick-ish) during scene D only.
def thump(at, f=58, g=0.16):
    n = int(0.34 * SR)
    x = np.arange(n) / SR
    put(music, at, g * np.sin(2 * np.pi * (f * np.exp(-x * 3)) * x) * np.exp(-x * 9))

beat = 60.0 / BPM
tb = TL["d0"] / 1000.0
while tb < TL["d1"] / 1000.0:
    thump(tb)
    tb += beat

# Duck under voice (55%), smooth ramps.
duck = np.ones(N)
for seg in [("a0", "a1"), ("b0", "b1"), ("c0", "c1"), ("d0", "d1"), ("e0", "e1")]:
    s, e = int(TL[seg[0]] / 1000 * SR), int(TL[seg[1]] / 1000 * SR)
    r = int(0.3 * SR)
    duck[max(0, s - r):s] *= np.linspace(1, 0.55, min(r, s))
    duck[s:e] = 0.55
    duck[e:e + r] = np.linspace(0.55, 1, r)
music *= duck

# Outro: let it breathe — fade arp is already gone; global fade last 2.2s
fade = int(2.2 * SR)
music[-fade:] *= np.linspace(1, 0, fade) ** 1.4

# ---------------- SFX ----------------
rng = np.random.default_rng(11)

def whoosh(at, f0=180, f1=2600, length=0.55, g=0.11):
    n = int(length * SR)
    x = np.arange(n) / SR
    noise = rng.standard_normal(n)
    fc = f0 * (f1 / f0) ** (x / length)      # log sweep
    # crude resonant bandpass: noise * narrow window around fc via 2-pole
    y = np.zeros(n); y1 = y2 = 0.0
    q = 0.86
    for i in range(n):
        w = 2 * np.pi * fc[i] / SR
        y1 = q * y1 + (1 - q) * (noise[i] - y2)
        y2 = q * y2 + (1 - q) * y1
        y[i] = y1 - y2
    w = np.sin(np.pi * x / length) ** 1.5
    put(sfx, at, y * w * g)

def tick(at, f=1250, g=0.045, length=0.05):
    n = int(length * SR)
    x = np.arange(n) / SR
    put(sfx, at, g * np.sin(2 * np.pi * f * x) * np.exp(-x * 90))

def click(at, g=0.09):
    n = int(0.03 * SR)
    x = np.arange(n) / SR
    put(sfx, at, g * rng.standard_normal(n) * np.exp(-x * 300) + g * 0.6 * np.sin(2 * np.pi * 2200 * x) * np.exp(-x * 260))

def chime(at, g=0.09):
    for k, f in enumerate([880.0, 1318.5]):
        n = int(0.7 * SR)
        x = np.arange(n) / SR
        put(sfx, at + k * 0.09, g * np.sin(2 * np.pi * f * x) * np.exp(-x * 5.5))

def pop(at, g=0.14):
    n = int(0.3 * SR)
    x = np.arange(n) / SR
    put(sfx, at, g * np.sin(2 * np.pi * 70 * np.exp(-x * 4) * x) * np.exp(-x * 10) + 0.05 * rng.standard_normal(n) * np.exp(-x * 120))

# Scene transitions
for key in ("b0", "c0", "d0"):
    whoosh(TL[key] / 1000 - 0.25)
whoosh(TL["e0"] / 1000 - 0.3, f0=140, f1=1800, length=0.8, g=0.09)

# Scene A beat ticks (chaos end + each beat start ≈ equal spans)
d = TL["a1"] - TL["a0"]
chaos = d * 0.22
span = (d - chaos) / 4
for i in range(4):
    tick((TL["a0"] + chaos + i * span) / 1000, f=1150 + i * 90)

# Flow: click on plan, confirm on result
dc = TL["c1"] - TL["c0"]
click((TL["c0"] + dc * 0.45) / 1000)
chime((TL["c0"] + dc * 0.86) / 1000)

# 43 count-up ticks + arrival pop
dd = TL["d1"] - TL["d0"]
n_ticks = 14
for i in range(n_ticks):
    p = i / n_ticks
    at = (TL["d0"] + 80 + (dd * 0.62) * (1 - (1 - p) ** 3)) / 1000
    tick(at, f=620 + p * 900, g=0.035)
pop((TL["d0"] + dd * 0.62) / 1000)

# Final chime on logo reveal
chime((TL["e0"] + 1500) / 1000, g=0.07)

sfx = np.tanh(sfx * 1.2) * 0.9

# ---------------- Mix with voice ----------------
def load_voice():
    import subprocess, tempfile
    names = [f"{lang}-{c}.mp3" for c in "abcde"]
    keys = [("a0", "a1"), ("b0", "b1"), ("c0", "c1"), ("d0", "d1"), ("e0", "e1")]
    out = np.zeros(N)
    for name, (k0, _) in zip(names, keys):
        raw = subprocess.run(
            ["ffmpeg", "-v", "error", "-i", os.path.join(HERE, "voice", name), "-f", "f32le", "-acodec", "pcm_f32le", "-ac", "1", "-ar", str(SR), "-"],
            capture_output=True, check=True).stdout
        sig = np.frombuffer(raw, dtype=np.float32)
        put(out, TL[k0] / 1000, sig)
    return out

voice = load_voice()

def wav(path, sig):
    sig = np.clip(sig, -0.98, 0.98)
    stereo = np.stack([sig, sig], axis=1)
    import wave
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((stereo * 32767).astype("<i2").tobytes())

def norm(x, target=0.9):
    m = np.max(np.abs(x))
    return x * (target / m) if m > 0 else x

music = norm(music, 0.5)
sfx = norm(sfx, 0.42)
voice = norm(voice, 0.95)

wav(os.path.join(HERE, f"music-{lang}.wav"), music)
wav(os.path.join(HERE, f"sfx-{lang}.wav"), sfx)
mix = voice + music * 0.9 + sfx
wav(os.path.join(HERE, f"mix-{lang}.wav"), norm(mix, 0.92))
print(f"audio {lang}: music + sfx + mix written ({dur_s:.1f}s)")
