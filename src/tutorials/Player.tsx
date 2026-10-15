import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import { Seg } from '../ui/kit';
import { audioFor, browserSpeechAvailable, estimateMs, loadManifest, markWatched, speakBrowser, type AudioManifest } from './narration';

export interface TutorialStep {
  id: string;
  say: string;
}
export interface TutorialDef {
  id: string;
  title: string;
  minutes: number;
  level: string;
  studio: string | null;
  steps: TutorialStep[];
}
/** A scene renders the model state for progress t ∈ [0,1] through one step. */
export type SceneFn = (stepId: string, t: number) => ReactNode;

type Voice = 'best' | 'browser' | 'off';
const PREF = 'iris.tutorialVoice';
function loadVoicePref(): { voice: Voice; rate: number } {
  try {
    const p = JSON.parse(localStorage.getItem(PREF) ?? '{}');
    return { voice: p.voice === 'off' || p.voice === 'browser' ? p.voice : 'best', rate: [0.8, 1, 1.25].includes(p.rate) ? p.rate : 1 };
  } catch {
    return { voice: 'best', rate: 1 };
  }
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function TutorialPlayer({ tutorial, scene, onClose, autoStart = false }: { tutorial: TutorialDef; scene: SceneFn; onClose?(): void; autoStart?: boolean }) {
  const { reducedMotion } = useApp();
  const [manifest, setManifest] = useState<AudioManifest | null>(null);
  const [{ voice, rate }, setPref] = useState(loadVoicePref);
  const [step, setStep] = useState(0);
  const [t, setT] = useState(autoStart ? 0 : 1);
  const [playing, setPlaying] = useState(autoStart);
  const [finished, setFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopSpeech = useRef<() => void>(() => {});
  const raf = useRef<number | null>(null);
  const advanceTimer = useRef<number | null>(null);
  const playingRef = useRef(autoStart);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    loadManifest().then(setManifest);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(PREF, JSON.stringify({ voice, rate }));
    } catch {
      /* ignore */
    }
  }, [voice, rate]);

  const s = tutorial.steps[step];
  const mp3 = audioFor(manifest, tutorial.id, s.id, s.say);
  const source: 'elevenlabs' | 'browser' | 'captions' = voice === 'off' ? 'captions' : voice === 'best' && mp3 ? 'elevenlabs' : browserSpeechAvailable() ? 'browser' : 'captions';

  const stopAll = useCallback(() => {
    audioRef.current?.pause();
    stopSpeech.current();
    if (raf.current) cancelAnimationFrame(raf.current);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      stopAll();
      setFinished(false);
      setStep(Math.max(0, Math.min(tutorial.steps.length - 1, i)));
      // While paused, show the step's finished picture; while playing, animate from the start.
      setT(playingRef.current ? 0 : 1);
    },
    [stopAll, tutorial.steps.length],
  );

  // Drive one step: narration + progress clock.
  useEffect(() => {
    if (!playing) return;
    let ended = false;
    const onStepEnd = () => {
      if (ended) return;
      ended = true;
      setT(1);
      advanceTimer.current = window.setTimeout(() => {
        if (step < tutorial.steps.length - 1) {
          setStep(step + 1);
          setT(0);
        } else {
          setPlaying(false);
          setFinished(true);
          markWatched(tutorial.id);
        }
      }, 700);
    };
    const est = estimateMs(s.say, rate);
    const t0 = performance.now();
    if (source === 'elevenlabs' && mp3) {
      const a = new Audio(mp3);
      a.playbackRate = rate;
      audioRef.current = a;
      a.onended = onStepEnd;
      a.onerror = () => {
        // fall back to the clock if the file cannot play
        a.onended = null;
      };
      a.play().catch(() => {
        /* autoplay blocked: the clock below still advances */
      });
    } else if (source === 'browser') {
      stopSpeech.current = speakBrowser(s.say, rate, onStepEnd);
    }
    const tick = () => {
      const a = audioRef.current;
      let p: number;
      if (source === 'elevenlabs' && a && a.duration > 0 && !a.paused) p = a.currentTime / a.duration;
      else p = (performance.now() - t0) / est;
      if (source !== 'browser' || p < 0.97) setT(Math.min(source === 'browser' ? 0.97 : 1, p));
      if (p >= 1 && source === 'captions') onStepEnd();
      if (p >= 1.6 && source !== 'captions') onStepEnd(); // safety: narration never reported its end
      if (!ended) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      ended = true;
      stopAll();
      audioRef.current = null;
    };
  }, [playing, step, source, mp3, rate, s.say, stopAll, tutorial.steps.length]);

  useEffect(() => () => stopAll(), [stopAll]);

  useEffect(() => {
    if (step === tutorial.steps.length - 1) markWatched(tutorial.id);
  }, [step, tutorial.id, tutorial.steps.length]);

  const shownT = reducedMotion ? 1 : ease(Math.max(0, Math.min(1, t)));
  return (
    <div className="tutorial" data-testid="tutorial-player" aria-roledescription="tutorial">
      <div className="tutorial-head">
        <div>
          <div className="tiny muted">{tutorial.level} · about {tutorial.minutes} min</div>
          <h2 style={{ margin: 0 }}>{tutorial.title}</h2>
        </div>
        {onClose && (
          <button className="btn sm" onClick={() => { stopAll(); onClose(); }} aria-label="Close tutorial">
            Close
          </button>
        )}
      </div>
      <div className="tutorial-stage" aria-hidden={false}>
        {scene(s.id, shownT)}
      </div>
      <div className="tutorial-caption" aria-live="polite" data-testid="tutorial-caption">
        <span className="pill info">
          Step {step + 1} of {tutorial.steps.length}
        </span>{' '}
        {s.say}
      </div>
      <div className="tutorial-progress" role="tablist" aria-label="Tutorial steps">
        {tutorial.steps.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={i === step} aria-label={`Go to step ${i + 1}`} className={i < step ? 'done' : i === step ? 'current' : ''} onClick={() => goTo(i)}>
            {i === step && <span style={{ width: `${Math.round(shownT * 100)}%` }} />}
          </button>
        ))}
      </div>
      <div className="row tutorial-controls">
        <button className="btn sm" onClick={() => goTo(step - 1)} disabled={step === 0} aria-label="Previous step">
          ◀ Back
        </button>
        <button
          className="btn primary"
          data-testid="tutorial-play"
          onClick={() => {
            if (finished) {
              goTo(0);
              setPlaying(true);
            } else if (playing) {
              stopAll();
              setPlaying(false);
            } else {
              setT(0);
              setPlaying(true);
            }
          }}
        >
          {finished ? '↺ Watch again' : playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button className="btn sm" onClick={() => goTo(step + 1)} disabled={step === tutorial.steps.length - 1} aria-label="Next step" data-testid="tutorial-next">
          Next ▶
        </button>
        <button className="btn sm ghost" onClick={() => { stopAll(); setT(0); if (playing) { setPlaying(false); setTimeout(() => setPlaying(true), 0); } }}>
          Replay step
        </button>
        <span style={{ flex: 1 }} />
        <Seg label="Narration" value={voice} onChange={(v) => { stopAll(); setPref({ voice: v, rate }); setPlaying(false); }} options={[{ value: 'best', label: '🔊 Voice' }, { value: 'browser', label: 'Browser voice' }, { value: 'off', label: 'Captions only' }]} />
        <Seg label="Speed" value={String(rate) as '1'} onChange={(v) => { stopAll(); setPref({ voice, rate: Number(v) }); setPlaying(false); }} options={[{ value: '0.8', label: '0.8×' }, { value: '1', label: '1×' }, { value: '1.25', label: '1.25×' }]} />
      </div>
      <div className="tiny muted">
        {source === 'elevenlabs' ? 'Narration: ElevenLabs recording.' : source === 'browser' ? (voice === 'best' ? 'Narration: your browser’s built-in voice (studio recordings not generated yet).' : 'Narration: your browser’s built-in voice.') : 'Captions only.'}
        {reducedMotion && ' Reduced motion is on: each step shows its final picture without animation.'}
      </div>
      {finished && tutorial.studio && (
        <div className="feedback good" style={{ marginTop: 8 }}>
          <strong>Now try it yourself.</strong>{' '}
          <a className="btn sm primary" href={href(`lab/${tutorial.studio}${tutorial.studio === 'LAB01' ? '?mode=mission' : ''}`)}>
            Open {tutorial.studio}
          </a>
        </div>
      )}
    </div>
  );
}
