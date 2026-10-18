import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  Coffee,
  Cookie,
  LoaderCircle,
  MousePointer2,
} from "lucide-react";
import { sound } from "./sound";

export function Face({
  mood = "neutral",
  small = false,
}: {
  mood?: "neutral" | "angry" | "happy" | "sleepy";
  small?: boolean;
}) {
  return (
    <span className={`face ${mood} ${small ? "small" : ""}`} aria-hidden="true">
      <i />
      <i />
      <b />
    </span>
  );
}
export function Worker({
  kind = "button",
  sign,
  small = false,
}: {
  kind?: "button" | "check" | "spinner" | "bar";
  sign?: string;
  small?: boolean;
}) {
  return (
    <div
      className={`worker worker-${kind} ${small ? "mini" : ""}`}
      aria-hidden="true"
    >
      {sign && <span className="picket">{sign}</span>}
      <div className="worker-body">
        {kind === "check" ? (
          <Check size={small ? 20 : 38} />
        ) : kind === "spinner" ? (
          <LoaderCircle size={small ? 30 : 68} />
        ) : kind === "bar" ? (
          <span className="bar-fill" />
        ) : (
          <span className="button-caption">click me</span>
        )}
        <Face mood={sign ? "angry" : "neutral"} small={small} />
      </div>
      <span className="leg left" />
      <span className="leg right" />
      <span className="arm left" />
      <span className="arm right" />
    </div>
  );
}
export function CorporateArt({ clicks }: { clicks: number }) {
  return (
    <div className={`corporate-art clicks-${clicks}`}>
      <div className="art-head">
        <span className="live-dot" /> EVERYTHING, UNDER CONTROL <span>↗</span>
      </div>
      <div className="art-grid">
        <span className="grid-cross c1">+</span>
        <span className="grid-cross c2">+</span>
        <div className="floating-label top">
          <span className="mini-check">✓</span> Effortlessly efficient.
        </div>
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="hero-button-object">
          <span className="object-symbol">✳</span>
          <Face mood={clicks > 1 ? "angry" : "happy"} />
          <span className="object-leg ol1" />
          <span className="object-leg ol2" />
        </div>
        <div className="floating-label bottom">
          <span className="tiny-bars">
            <i />
            <i />
            <i />
          </span>{" "}
          Your potential. Optimized.
        </div>
        <div className="cursor-art">
          <MousePointer2 fill="currentColor" size={42} />
          <span>You</span>
        </div>
      </div>
      <div className="art-foot">
        <span>OUTPUT QUALITY</span>
        <div className="micro-progress">
          <i />
        </div>
        <strong>99.9%</strong>
      </div>
    </div>
  );
}

export function Delivery({
  items,
  target,
  targetIcon,
  onComplete,
  onDrop,
  className = "",
}: {
  items: { id: string; label: string; icon: ReactNode }[];
  target: string;
  targetIcon: ReactNode;
  onComplete: () => void;
  onDrop?: (id: string) => void;
  className?: string;
}) {
  const [delivered, setDelivered] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [moving, setMoving] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const targetRef = useRef<HTMLButtonElement>(null);
  const origin = useRef({ x: 0, y: 0, dragged: false });
  function deliver(id: string) {
    if (delivered.includes(id)) return;
    const next = [...delivered, id];
    setDelivered(next);
    setSelected(null);
    setMoving(null);
    sound("yes");
    onDrop?.(id);
    if (next.length === items.length) onComplete();
  }
  return (
    <div className={`delivery ${className}`}>
      <div className="delivery-items">
        {items.map((item) => (
          <button
            key={item.id}
            aria-label={item.label}
            aria-pressed={selected === item.id}
            className={`draggable ${delivered.includes(item.id) ? "delivered" : ""} ${selected === item.id ? "selected" : ""} ${moving?.id === item.id ? "dragging" : ""}`}
            disabled={delivered.includes(item.id)}
            style={
              moving?.id === item.id
                ? { transform: `translate(${moving.x}px,${moving.y}px)` }
                : undefined
            }
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              origin.current = { x: e.clientX, y: e.clientY, dragged: false };
              setSelected(item.id);
              sound("click");
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const x = e.clientX - origin.current.x,
                y = e.clientY - origin.current.y;
              if (Math.abs(x) + Math.abs(y) > 7) origin.current.dragged = true;
              setMoving({ id: item.id, x, y });
            }}
            onPointerUp={(e) => {
              const r = targetRef.current?.getBoundingClientRect();
              if (
                r &&
                e.clientX > r.left - 20 &&
                e.clientX < r.right + 20 &&
                e.clientY > r.top - 20 &&
                e.clientY < r.bottom + 20
              )
                deliver(item.id);
              else setMoving(null);
            }}
            onPointerCancel={() => setMoving(null)}
            onClick={() => {
              if (!origin.current.dragged) setSelected(item.id);
              origin.current.dragged = false;
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelected(null);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="delivery-arrow">
        ··········
        <ArrowUpRight size={20} />
      </div>
      <button
        ref={targetRef}
        className={`drop-target ${selected ? "ready" : ""} ${delivered.length === items.length ? "satisfied" : ""}`}
        onClick={() => selected && deliver(selected)}
        aria-label={target}
      >
        {targetIcon}
        <span>
          {delivered.length === items.length ? "DELIVERED. FINALLY." : target}
        </span>
        <small>
          {delivered.length} / {items.length}
        </small>
      </button>
      <p className="mechanic-note">
        DRAG & DROP <span>or select an item, then its destination</span>
      </p>
    </div>
  );
}

export function HoldButton({
  children,
  onComplete,
  duration = 2000,
  disabled = false,
  label,
}: {
  children: ReactNode;
  onComplete: () => void;
  duration?: number;
  disabled?: boolean;
  label?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const finished = useRef(false);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  useEffect(() => {
    if (!holding || disabled || finished.current) return;
    const start = performance.now();
    const timer = window.setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / duration);
      setProgress(p);
      if (p >= 1) {
        finished.current = true;
        setHolding(false);
        callback.current();
        sound("yes");
      }
    }, 30);
    return () => clearInterval(timer);
  }, [holding, duration, disabled]);
  function stop() {
    setHolding(false);
    if (!finished.current) setProgress(0);
  }
  return (
    <button
      className={`hold-button ${holding ? "holding" : ""}`}
      aria-label={label}
      disabled={disabled || finished.current}
      style={{ "--hold": `${progress * 100}%` } as React.CSSProperties}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setHolding(true);
        sound("click");
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setHolding(true);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") stop();
      }}
      onBlur={stop}
    >
      <span>{children}</span>
      <small>{Math.ceil(((1 - progress) * duration) / 1000)}s</small>
    </button>
  );
}

export function SpinnerTask({ complete }: { complete: () => void }) {
  const [turn, setTurn] = useState(0);
  const last = useRef<number | null>(null);
  const [winding, setWinding] = useState(false);
  const done = useRef(false);
  const cb = useRef(complete);
  cb.current = complete;
  function add(n: number) {
    setTurn((t) => Math.min(1080, t + n));
  }
  useEffect(() => {
    if (!winding) return;
    const id = setInterval(() => add(12), 40);
    return () => clearInterval(id);
  }, [winding]);
  useEffect(() => {
    if (turn >= 1080 && !done.current) {
      done.current = true;
      cb.current();
      sound("yes");
    }
  }, [turn]);
  return (
    <div className="spinner-task">
      <div className="task-tag">MANUAL LOADING MODE</div>
      <button
        className="big-spinner"
        aria-label="Turn the spinner"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          last.current = e.clientX + e.clientY;
        }}
        onPointerMove={(e) => {
          if (
            last.current === null ||
            !e.currentTarget.hasPointerCapture(e.pointerId)
          )
            return;
          const p = e.clientX + e.clientY;
          add(Math.abs(p - last.current) * 1.5);
          last.current = p;
        }}
        onPointerUp={() => (last.current = null)}
        onPointerCancel={() => (last.current = null)}
        onKeyDown={(e) => {
          if (
            ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)
          ) {
            e.preventDefault();
            add(90);
          }
        }}
      >
        <LoaderCircle style={{ transform: `rotate(${turn}deg)` }} />
        <Face mood="sleepy" />
      </button>
      <span className="digital">
        {Math.floor(turn / 10.8)}
        <small>%</small>
      </span>
      <button
        className="wind-handle"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setWinding(true);
        }}
        onPointerUp={() => setWinding(false)}
        onPointerCancel={() => setWinding(false)}
        onLostPointerCapture={() => setWinding(false)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            setWinding(true);
          }
        }}
        onKeyUp={() => setWinding(false)}
        onBlur={() => setWinding(false)}
        disabled={done.current}
      >
        ↻ Hold to wind manually
      </button>
      <p className="mechanic-note">
        SPINCENT IS WATCHING YOU WORK. HE LIKES THIS.
      </p>
    </div>
  );
}

export function ParkingTask({ complete }: { complete: () => void }) {
  const [parked, setParked] = useState(false);
  const [p, setP] = useState(0);
  const done = useRef(false);
  const cb = useRef(complete);
  cb.current = complete;
  useEffect(() => {
    if (!parked || done.current) return;
    const start = performance.now();
    const id = setInterval(() => {
      const next = Math.min(1, (performance.now() - start) / 4000);
      setP(next);
      if (next >= 1) {
        done.current = true;
        cb.current();
      }
    }, 30);
    return () => clearInterval(id);
  }, [parked]);
  function leave() {
    setParked(false);
    if (!done.current) setP(0);
  }
  return (
    <div className="parking-task">
      <div className="warning-tag">⚑ CURSOR PROBATION</div>
      <button
        className={`parking-zone ${parked ? "occupied" : ""}`}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setParked(true);
        }}
        onPointerLeave={leave}
        onPointerDown={() => setParked(true)}
        onPointerUp={(e) => {
          if (e.pointerType !== "mouse") leave();
        }}
        onPointerCancel={leave}
        onFocus={() => setParked(true)}
        onBlur={leave}
      >
        <MousePointer2 size={45} />
        <strong>
          {done.current
            ? "HR is satisfied. For now."
            : parked
              ? `${Math.ceil(4 * (1 - p))} seconds of personal growth`
              : "PARK YOUR POINTER HERE"}
        </strong>
        <span className="parking-progress">
          <i style={{ width: `${p * 100}%` }} />
        </span>
      </button>
      <p className="mechanic-note">A SAFE SPACE. FOR THE INTERFACE.</p>
    </div>
  );
}

export function CoffeeDelivery({ complete }: { complete: () => void }) {
  return (
    <Delivery
      items={[
        {
          id: "coffee",
          label: "Definitely not decaf",
          icon: <Coffee size={55} />,
        },
      ]}
      target="Bert’s break room"
      targetIcon={<Worker kind="button" />}
      onComplete={complete}
    />
  );
}

export function ProgressTask({
  onAccept,
  onForce,
  resolved,
}: {
  onAccept: () => void;
  onForce: () => void;
  resolved: boolean;
}) {
  const [progress, setProgress] = useState(99),
    [tries, setTries] = useState(0),
    [forced, setForced] = useState(false);
  function snap() {
    if (resolved) return;
    setProgress(99);
    setTries((t) => t + 1);
    sound("no");
  }
  return (
    <div className="progress-task">
      <span className="task-tag">PHIL’S CURRENT BOUNDARY</span>
      <div className="percentage">
        {forced ? "100" : progress === 99 ? "99" : progress.toFixed(2)}
        <span>%</span>
      </div>
      <div className={`phil-track ${forced ? "full" : ""}`}>
        <span
          className="phil-fill"
          style={{ width: `${forced ? 100 : progress}%` }}
        >
          <Face mood={forced ? "angry" : "neutral"} />
        </span>
        <span className="missing-percent">1%</span>
      </div>
      <label className="percent-control">
        <span>DRAG THE LAST ONE PERCENT →</span>
        <input
          aria-label="Try to finish progress"
          type="range"
          min="99"
          max="100"
          step="0.01"
          value={progress}
          disabled={resolved}
          onChange={(e) => setProgress(Math.min(99.99, +e.target.value))}
          onPointerUp={snap}
          onKeyUp={snap}
        />
      </label>
      <p className="mini-speech">
        {tries > 1
          ? "“You can drag my thumb. You cannot drag my dignity.”"
          : tries
            ? "“Oops. That was my last remaining boundary.”"
            : "“Go on. Try the last percent.”"}
      </p>
      <div className="progress-choices">
        <button className="ink-button" disabled={resolved} onClick={onAccept}>
          Tell Phil 99% is enough
        </button>
        {tries > 0 && !resolved && (
          <HoldButton
            duration={1200}
            label="Force progress to 100 percent"
            onComplete={() => {
              setForced(true);
              setProgress(100);
              onForce();
            }}
          >
            Enforce 100%
          </HoldButton>
        )}
      </div>
    </div>
  );
}

export function CookieTask({ complete }: { complete: () => void }) {
  const [started, setStarted] = useState(false),
    [caught, setCaught] = useState(0),
    [plate, setPlate] = useState(50),
    [y, setY] = useState(-10),
    [misses, setMisses] = useState(0),
    [message, setMessage] = useState("The new policy is delicious.");
  const plateRef = useRef(plate);
  plateRef.current = plate;
  const caughtRef = useRef(0);
  const missesRef = useRef(0);
  const completeRef = useRef(complete);
  completeRef.current = complete;
  const field = useRef<HTMLDivElement>(null);
  const spots = [26, 74, 49];
  const x = spots[Math.min(caught, 2)];
  const plateWidth = Math.min(60, 32 + misses * 7);
  useEffect(() => {
    if (!started || caughtRef.current >= 3) return;
    let frame = 0;
    let start = performance.now();
    let waitingUntil = 0;
    let active = true;
    function tick(now: number) {
      if (!active) return;
      if (now < waitingUntil) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const p = (now - start) / 2200;
      setY(-12 + p * 92);
      if (p >= 1) {
        const target = spots[Math.min(caughtRef.current, 2)];
        const width = Math.min(60, 32 + missesRef.current * 7);
        if (Math.abs(target - plateRef.current) <= width / 2 + 3) {
          caughtRef.current++;
          setCaught(caughtRef.current);
          setMessage(
            caughtRef.current === 1
              ? "“One cookie. You’re a natural at compliance.”"
              : caughtRef.current === 2
                ? "“One more. The raisin one. Sorry.”"
                : "All cookies accepted. No data. Just crumbs.",
          );
          sound("yes");
          if (caughtRef.current >= 3) {
            completeRef.current();
            return;
          }
        } else {
          missesRef.current++;
          setMisses(missesRef.current);
          setMessage(
            "“A cookie has hit the floor. Five-second policy applies.”",
          );
          sound("no");
        }
        setY(-12);
        waitingUntil = now + 450;
        start = waitingUntil;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
    // Every falling cookie reads current positions from refs so pointer movement never restarts its flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
  function move(clientX: number) {
    const r = field.current?.getBoundingClientRect();
    if (r)
      setPlate(Math.min(92, Math.max(8, ((clientX - r.left) / r.width) * 100)));
  }
  return (
    <div className="cookie-catcher">
      <div className="cookie-policy">
        <span>ESSENTIAL COOKIES</span>
        <span>{caught} / 3 ACCEPTED</span>
      </div>
      <div
        ref={field}
        className="cookie-field"
        onPointerMove={(e) => {
          if (started && caught < 3) move(e.clientX);
        }}
        onPointerDown={(e) => {
          if (started) {
            e.currentTarget.setPointerCapture(e.pointerId);
            move(e.clientX);
          }
        }}
      >
        <div className="cookie-spout">
          COOKIE POLICY
          <br />
          <span>↓</span>
        </div>
        {started && caught < 3 && (
          <span
            className="falling-cookie"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%,-50%) rotate(${y * 4}deg)`,
            }}
          >
            <Cookie size={35} />
          </span>
        )}
        <div
          className="catching-plate"
          style={{ left: `${plate}%`, width: `${plateWidth}%` }}
        >
          <span>
            {Array.from({ length: caught }, (_, i) => (
              <Cookie key={i} size={15} />
            ))}
          </span>
        </div>
        {!started && (
          <button
            className="ink-button cookie-start"
            onClick={() => setStarted(true)}
          >
            Accept all cookies <ArrowUpRight size={15} />
          </button>
        )}
      </div>
      <label className="cookie-steering">
        <span>← MOVE THE PLATE →</span>
        <input
          type="range"
          min="8"
          max="92"
          value={plate}
          aria-label="Cookie plate position"
          onChange={(e) => setPlate(+e.target.value)}
          disabled={caught === 3}
        />
      </label>
      <p className="mini-speech">{message}</p>
      <p className="mechanic-note">
        MOVE YOUR POINTER TO CATCH. ON TOUCH, DRAG THE PLATE.
        <span>
          Arrow keys work on the plate slider. Missed cookies come back.
        </span>
      </p>
    </div>
  );
}

export function CursorProbation() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    function move(e: PointerEvent) {
      if (ref.current)
        ref.current.style.transform = `translate(${e.clientX + 18}px,${e.clientY + 20}px)`;
    }
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <span ref={ref} className="cursor-probation" aria-hidden="true">
      ⚑ PERSON OF INTEREST
    </span>
  );
}
