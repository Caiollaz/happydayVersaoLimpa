// Generates the demo soundtrack from scratch.
//
// The site shipped with two commercial tracks (Scorpions, Katy Perry) — fine
// for a private gift, impossible for a product that charges money. Rather
// than source "royalty-free" music whose provenance we'd have to take on
// faith, these are synthesized here: audio written by this file has no
// rights holder to argue with.
//
// Two pieces, both instrumental loops:
//   nossa-cancao   — the site player. Warm, slow, major-ish.
//   retrospectiva  — the story player. Brighter, more motion.
//
// Deterministic: same seed, same waveform, every run.
//
// Run with: node scripts/gen-audio.mjs   (needs ffmpeg or lame on PATH)
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "audio");

const RATE = 44100;

/* ------------------------------------------------------------------ *
 * Notes
 * ------------------------------------------------------------------ */

/** MIDI note number → Hz. 69 = A4 = 440. */
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

const N = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
/** "A3" → midi number. */
function note(name) {
  const letter = name[0];
  const octave = Number(name.slice(1));
  return 12 * (octave + 1) + N[letter];
}

/* ------------------------------------------------------------------ *
 * Voices
 * ------------------------------------------------------------------ */

/**
 * A struck-string tone: a few detuned partials under a percussive
 * envelope. Not a real piano, but it reads as one at low volume, which is
 * all these tracks need to do behind a photo gallery.
 */
function pluck(buf, startSec, durSec, freq, gain) {
  const start = Math.floor(startSec * RATE);
  const len = Math.floor(durSec * RATE);
  // Higher notes decay faster, the way real strings do.
  const decay = 2.6 + 220 / freq;

  for (let i = 0; i < len; i++) {
    const t = i / RATE;
    const env = Math.exp(-t * decay) * (1 - Math.exp(-t * 420));

    const s =
      Math.sin(2 * Math.PI * freq * t) * 1.0 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.28 +
      Math.sin(2 * Math.PI * freq * 3 * t) * 0.12 +
      // A hair of detune keeps it from sounding like a test tone.
      Math.sin(2 * Math.PI * freq * 1.004 * t) * 0.35;

    const at = start + i;
    if (at < buf.length) buf[at] += s * env * gain;
  }
}

/** A slow swelling pad — the harmonic bed the plucks sit on. */
function pad(buf, startSec, durSec, freq, gain) {
  const start = Math.floor(startSec * RATE);
  const len = Math.floor(durSec * RATE);
  const fade = Math.floor(len * 0.35);

  for (let i = 0; i < len; i++) {
    const t = i / RATE;
    // Fade both ends so chords blend instead of clicking.
    const env =
      Math.min(1, i / fade) * Math.min(1, (len - i) / fade);
    // Two voices a few cents apart give the slow chorus movement.
    const s =
      Math.sin(2 * Math.PI * freq * t) +
      Math.sin(2 * Math.PI * freq * 1.006 * t) * 0.8 +
      Math.sin(2 * Math.PI * freq * 0.5 * t) * 0.5;

    const at = start + i;
    if (at < buf.length) buf[at] += s * env * gain;
  }
}

/** Cheap reverb: a couple of decaying taps. Adds room without a convolver. */
function addTail(buf, delaySec, mix) {
  const d = Math.floor(delaySec * RATE);
  for (let i = buf.length - 1; i >= d; i--) {
    buf[i] += buf[i - d] * mix;
  }
}

/* ------------------------------------------------------------------ *
 * Pieces
 * ------------------------------------------------------------------ */

/** Chords as scale degrees over a root, voiced low. */
function compose({ bpm, bars, progression, melody, seedGain }) {
  const beat = 60 / bpm;
  const bar = beat * 4;
  const total = Math.ceil(bars * bar) + 3;
  const buf = new Float32Array(Math.floor(total * RATE));

  for (let b = 0; b < bars; b++) {
    const chord = progression[b % progression.length];
    const at = b * bar;

    // Pad: root, third, fifth.
    for (const n of chord) {
      pad(buf, at, bar * 1.05, hz(note(n)), 0.05 * seedGain);
    }

    // Bass on the downbeat.
    pluck(buf, at, bar, hz(note(chord[0]) - 12), 0.11 * seedGain);

    // Melody: an arpeggio pattern over the chord's own notes.
    melody.forEach((step, i) => {
      if (step < 0) return;
      const n = chord[step % chord.length];
      const octave = step >= chord.length ? 12 : 0;
      pluck(
        buf,
        at + i * (bar / melody.length),
        bar / melody.length + 0.6,
        hz(note(n) + 12 + octave),
        0.075 * seedGain,
      );
    });
  }

  addTail(buf, 0.23, 0.26);
  addTail(buf, 0.47, 0.14);

  // Fade the first and last two seconds so the loop doesn't click.
  const fade = 2 * RATE;
  for (let i = 0; i < fade; i++) {
    buf[i] *= i / fade;
    buf[buf.length - 1 - i] *= i / fade;
  }

  return buf;
}

/* ------------------------------------------------------------------ *
 * Output
 * ------------------------------------------------------------------ */

function toWav(samples) {
  // Normalize to just under full scale, then soft-clip.
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const scale = peak > 0 ? 0.89 / peak : 1;

  const pcm = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.tanh(samples[i] * scale);
    pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 32767))), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);   // PCM
  header.writeUInt16LE(1, 22);   // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

function encodeMp3(wavPath, mp3Path) {
  try {
    execFileSync("ffmpeg", ["-y", "-i", wavPath, "-codec:a", "libmp3lame",
                            "-b:a", "128k", mp3Path], { stdio: "pipe" });
  } catch {
    execFileSync("lame", ["-b", "128", "--quiet", wavPath, mp3Path]);
  }
}

const TRACKS = {
  "nossa-cancao": {
    bpm: 68,
    bars: 32,
    // Am – F – C – G: the four chords every love song is built on.
    progression: [
      ["A3", "C4", "E4"],
      ["F3", "A3", "C4"],
      ["C3", "E3", "G3"],
      ["G3", "B3", "D4"],
    ],
    melody: [0, 2, 1, -1, 2, 0, 3, -1],
    seedGain: 1,
  },
  retrospectiva: {
    bpm: 92,
    bars: 40,
    // C – G – Am – F: brighter, more forward motion for the story player.
    progression: [
      ["C4", "E4", "G4"],
      ["G3", "B3", "D4"],
      ["A3", "C4", "E4"],
      ["F3", "A3", "C4"],
    ],
    melody: [0, 1, 2, 3, 2, 1, 2, -1],
    seedGain: 0.95,
  },
};

mkdirSync(OUT, { recursive: true });

for (const [name, spec] of Object.entries(TRACKS)) {
  const wav = join(OUT, `${name}.wav`);
  const mp3 = join(OUT, `${name}.mp3`);

  writeFileSync(wav, toWav(compose(spec)));
  encodeMp3(wav, mp3);
  rmSync(wav);

  const secs = (spec.bars * (60 / spec.bpm) * 4).toFixed(0);
  console.log(`${name}.mp3  ~${secs}s`);
}

console.log("\nTrilha gerada. Sem direitos de terceiros.");
