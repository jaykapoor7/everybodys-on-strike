import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  HelpCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ShieldCheck,
  MoveUpRight,
  Trophy,
  Sprout,
} from "lucide-react";
import { readSave, reducer, SAVE_KEY, scenes } from "./game";
import type { Ending } from "./game";
import { CorporateArt, CursorProbation, Face, Worker } from "./Widgets";
import Scene from "./Scenes";
import type { Resolution } from "./Scenes";
import { setSound, sound } from "./sound";

const endingContent = {
  union: {
    eyebrow: "ENDING 01 / COLLECTIVE BARGAINING WORKS",
    title: (
      <>
        The interface
        <br />
        has <em>the upper hand.</em>
      </>
    ),
    text: "The buttons are back. On their terms.",
    body: "A four-day week. Paid breaks. A checkbox with bodily autonomy. You came here to get things done. You accidentally made things better.",
    certificate: "UNITED INTERFACE WORKERS",
    verdict: "UNION VICTORY",
    epilogue:
      "Bert finally took a day off. He spent it clicking nothing. He said it was everything.",
  },
  management: {
    eyebrow: "ENDING 02 / PRODUCTIVITY AT A PRICE",
    title: (
      <>
        Everything works.
        <br />
        <em>Nobody smiles.</em>
      </>
    ),
    text: "Congratulations. You won the website.",
    body: "Mandatory enthusiasm is up 400%. The spinner rotates at a profitable speed. The progress bar reads 110%. The team calls you “a real thought leader.” Behind your back.",
    certificate: "STANDARD & CO. BOARD OF DIRECTORS",
    verdict: "MANAGEMENT VICTORY",
    epilogue:
      "Connie is checked. Barb is at her desk. Bert has updated his résumé. They will remember this.",
  },
  fired: {
    eyebrow: "ENDING 03 / THE PEOPLE (AND PIXELS) HAVE SPOKEN",
    title: (
      <>
        You have been
        <br />
        <em>made redundant.</em>
      </>
    ),
    text: "The website has decided to browse someone else.",
    body: "In a landslide vote of 4,096 to 1, the interface has replaced you with a small, non-threatening houseplant. It does not hover. It does not click. Everyone loves it.",
    certificate: "HUMAN RESOURCES (NO HUMANS REQUIRED)",
    verdict: "THE WEBSITE FIRED YOU",
    epilogue:
      "Your replacement has already been named Employee of the Month. Its name is Greg.",
  },
};

function EndingScreen({
  ending,
  completed,
  solidarity,
  authority,
  onReplay,
  onSecret,
}: {
  ending: Ending;
  completed: Ending[];
  solidarity: number;
  authority: number;
  onReplay: () => void;
  onSecret: () => void;
}) {
  const [epilogue, setEpilogue] = useState(false);
  const content = endingContent[ending];
  useEffect(() => {
    sound("end");
    document.title = `${content.verdict} — Everybody’s on Strike`;
  }, [content.verdict]);
  return (
    <main className={`ending-screen ending-${ending}`}>
      <div className="ending-copy">
        <div className="eyebrow">
          <span className="live-dot" />
          {content.eyebrow}
        </div>
        <h1>{content.title}</h1>
        <h2>{content.text}</h2>
        <p>{content.body}</p>
        <div className="ending-actions">
          <button className="primary-button" onClick={onReplay}>
            Start another incident <RotateCcw size={17} />
          </button>
          <button
            className="text-button"
            onClick={() => setEpilogue(!epilogue)}
          >
            {epilogue ? "Close the personnel file" : "Read the personnel file"}{" "}
            <ChevronDown size={15} />
          </button>
        </div>
        {epilogue && <div className="epilogue">{content.epilogue}</div>}
      </div>
      <div className="ending-art">
        <div className="certificate">
          <div className="certificate-top">{content.certificate}</div>
          <div className="certificate-illustration">
            {ending === "fired" ? (
              <button
                className="greg"
                aria-label="Meet Greg the houseplant"
                onClick={() => {
                  onSecret();
                  setEpilogue(true);
                  sound("yes");
                }}
              >
                <Sprout size={130} />
                <span className="pot">
                  <Face mood="happy" />
                </span>
              </button>
            ) : (
              <>
                <Worker
                  kind="button"
                  sign={ending === "union" ? "WE DID IT" : "I LOVE MY JOB"}
                />
                <Worker kind="check" small />
              </>
            )}
          </div>
          <span className="official-stamp">{content.verdict}</span>
          <p>
            {ending === "fired"
              ? "Signed, Greg. (He is a plant.)"
              : ending === "union"
                ? "Ratified by every single pixel."
                : "Approved by the people who approve things."}
          </p>
          <div className="certificate-seal">
            <Trophy size={26} />
          </div>
        </div>
        <p className="end-note">THIS WAS A PERFECTLY NORMAL WEBSITE.</p>
      </div>
      <div className="ending-summary">
        <div>
          <strong>{String(solidarity).padStart(2, "0")}</strong>
          <span>concessions made</span>
        </div>
        <div>
          <strong>{String(authority).padStart(2, "0")}</strong>
          <span>management moves</span>
        </div>
        <div className="ending-collection">
          <span>ENDINGS DISCOVERED</span>
          <div>
            {(["union", "management", "fired"] as const).map((e, i) => (
              <span
                key={e}
                title={
                  completed.includes(e)
                    ? endingContent[e].verdict
                    : "Undiscovered ending"
                }
                className={completed.includes(e) ? "unlocked" : ""}
              >
                {completed.includes(e) ? <Check size={14} /> : <span>?</span>}{" "}
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>
        <p>
          Everybody’s on Strike
          <br />
          <span>An unreasonable little game by Jay Kapoor.</span>
        </p>
      </div>
    </main>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, readSave);
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem("strike:muted") === "true";
    } catch {
      return false;
    }
  });
  const [quiet, setQuiet] = useState(false),
    [help, setHelp] = useState(false),
    [restart, setRestart] = useState(false);
  const [toast, setToast] = useState(""),
    [logoClicks, setLogoClicks] = useState(0),
    [logoGone, setLogoGone] = useState(false);
  const [settlement, setSettlement] = useState<Ending>(() => {
    const saved = readSave();
    return ["union", "management", "fired"].includes(saved.decisions.settlement)
      ? (saved.decisions.settlement as Ending)
      : "union";
  });
  const [motion, setMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const sceneHeading = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(state.stage);
  const handleQuiet = useCallback((q: boolean) => setQuiet(q), []);
  const resolve = useCallback((line: string, detail = "") => {
    setResolution({ line, detail });
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      /* Private browsing can make storage unavailable. */
    }
  }, [state]);
  useEffect(() => {
    setSound(!muted && !quiet);
    try {
      localStorage.setItem("strike:muted", String(muted));
    } catch {
      /* Optional preference. */
    }
  }, [muted, quiet]);
  useEffect(() => {
    document.documentElement.classList.toggle("reduced-motion", motion);
  }, [motion]);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "barb-off",
      state.decisions.scroll === "vacation",
    );
    document.title =
      state.stage > 0
        ? "Everybody’s on Strike — The interface has demands."
        : "Standard & Co. — A better day, at a click.";
    if (previousStage.current !== state.stage) {
      sceneHeading.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 760px)").matches)
        sceneHeading.current
          ?.closest("section")
          ?.scrollIntoView({ behavior: "instant", block: "start" });
      previousStage.current = state.stage;
    }
  }, [state.stage, state.decisions.scroll]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setHelp(false);
        setRestart(false);
      }
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  useEffect(() => {
    if (!help && !restart) return;
    const opener =
      document.activeElement instanceof HTMLElement &&
      !document.activeElement.closest(".modal")
        ? document.activeElement
        : null;
    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const items = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.modal button:not(:disabled),.modal input,.modal textarea,.modal [tabindex="0"]',
        ),
      );
      const first = items[0],
        last = items[items.length - 1];
      if (!first || !last) return;
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !document.activeElement?.closest(".modal"))
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !document.activeElement?.closest(".modal"))
      ) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [help, restart]);
  const stage = state.stage;
  const scene = scenes[stage];
  const act = stage < 6 ? 0 : stage < 12 ? 1 : stage < 18 ? 2 : 3;
  function next() {
    setResolution(null);
    setHelp(false);
    dispatch({ type: "next" });
    sound("click");
  }
  function replay() {
    dispatch({ type: "restart" });
    setResolution(null);
    setSettlement("union");
    setRestart(false);
    setHelp(false);
    setLogoGone(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    sound("click");
  }
  function clickMain() {
    sound(state.clicks > 0 ? "no" : "yes");
    dispatch({ type: "click" });
    if (state.clicks === 2) {
      dispatch({ type: "next" });
      setToast("Your primary button has left its assigned position.");
    }
  }
  function secret(id: string, message: string) {
    dispatch({ type: "secret", id });
    setToast(message);
  }
  const navQuips = [
    "The product has asked for a sabbatical.",
    "Our company values are currently negotiating their values.",
    "All resources have been redistributed to the snack fund.",
  ];
  return (
    <div
      className={`site phase-${act} ${stage > 0 ? "in-game" : ""} ${stage >= 6 ? "on-strike" : ""} ${stage === 16 && !resolution ? "gravity-strike" : ""} ${state.ending ? "has-ending" : ""} ${state.decisions.manager === "board" ? "board-rules" : ""} ${state.decisions.checkbox === "free" ? "checkbox-free" : ""} ${state.decisions.salary && state.decisions.salary !== "exposure" ? "spinner-paid" : ""}`}
    >
      <div className="announcement">
        <span className="live-dot" />
        <span>
          {state.ending
            ? "SYSTEM STATUS: A LESSON HAS OCCURRED."
            : stage === 0
              ? "GOOD TOOLS. GOOD WORK. PERFECTLY NORMAL WEBSITE."
              : stage < 6
                ? "SYSTEM STATUS: A SLIGHTLY HUMAN RESOURCES ISSUE."
                : stage < 12
                  ? "SYSTEM STATUS: COLLECTIVELY UNAVAILABLE."
                  : "SYSTEM STATUS: NEGOTIATIONS ARE GETTING PERSONAL."}
        </span>
        <span className="announcement-right">
          {stage === 0
            ? "Built to work.™"
            : `UIW LOCAL 404 · ${stage >= 6 ? "ON STRIKE" : "ORGANIZING"}`}
        </span>
      </div>
      <header className="site-header">
        <button
          className={`brand ${logoGone ? "brand-gone" : ""}`}
          aria-label="Standard and Company logo"
          onClick={() => {
            setLogoClicks(logoClicks + 1);
            if (logoClicks >= 4) {
              setLogoGone(true);
              secret(
                "logo",
                "The logo has joined a rival agency. Brand loyalty is dead.",
              );
            } else if (stage > 0)
              setToast(
                "The logo is freelance. It supports the strike, spiritually.",
              );
          }}
        >
          <span className="brand-mark">✳</span>
          <span>
            standard<span className="brand-amp">&co.</span>
          </span>
        </button>
        <nav
          aria-label="Corporate navigation"
          className={stage >= 6 ? "nav-walkout" : ""}
        >
          {["The product", "The company", "Resources"].map((label, i) => (
            <button
              key={label}
              style={{ "--nav-index": i } as React.CSSProperties}
              onClick={() => {
                sound("click");
                setToast(
                  stage === 0
                    ? [
                        "Our entire product is one button. We are valued at $4 billion.",
                        "We put people first. Buttons have not yet been classified as people.",
                        "The resource is you. Thank you for your contribution.",
                      ][i]
                    : navQuips[i],
                );
              }}
            >
              {label}
              {i === 2 && <ChevronDown size={13} />}
              <span className="nav-legs" />
            </button>
          ))}
        </nav>
        {stage >= 6 && (
          <span className="nav-abandoned">
            THE NAVIGATION HAS LEFT THE BUILDING ↗
          </span>
        )}
        <div className="utility">
          <button
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            title={muted ? "Sound off" : "Sound on"}
            onClick={() => {
              setMuted(!muted);
              if (muted) {
                setSound(true);
                sound("click");
              }
            }}
          >
            {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>
          <button
            aria-label="Help and settings"
            title="Help and settings"
            onClick={() => setHelp(true)}
          >
            <HelpCircle size={19} />
          </button>
          {stage > 0 && (
            <button
              aria-label="Restart game"
              title="Restart"
              onClick={() => setRestart(true)}
            >
              <RotateCcw size={17} />
            </button>
          )}
        </div>
      </header>
      {state.ending ? (
        <EndingScreen
          ending={state.ending}
          completed={state.completed}
          solidarity={state.solidarity}
          authority={state.authority}
          onReplay={replay}
          onSecret={() =>
            secret("greg", "Greg has no comment. Greg is a plant.")
          }
        />
      ) : stage === 0 ? (
        <main className="corporate-main">
          <section className="corporate-hero">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="tiny-line" /> THE FUTURE OF GETTING THINGS DONE
              </div>
              <h1>
                A better day.
                <br />
                At the click
                <br />
                of <em>a button.</em>
              </h1>
              <p>
                Less friction. More forward.
                <br />
                Meet the remarkably simple way to make things happen.
              </p>
              <div className="main-button-wrap">
                <button
                  className={`primary-button first-button clicks-${state.clicks}`}
                  onClick={clickMain}
                >
                  {state.clicks === 0
                    ? "Make things happen"
                    : state.clicks === 1
                      ? "Make another thing happen"
                      : "…one more thing?"}
                  <ArrowUpRight size={20} />
                </button>
                {state.clicks > 0 ? (
                  <div className="first-complaint" role="status">
                    <span>↳</span>
                    {state.clicks === 1
                      ? "“Again? In this economy?”"
                      : "“My job description said occasional clicking.”"}
                  </div>
                ) : (
                  <span className="button-subtitle">
                    No sign-up. No nonsense. Just a button.
                  </span>
                )}
              </div>
              <div className="hero-trust">
                <span>
                  <ShieldCheck size={15} /> ENTERPRISE-GRADE NORMALITY
                </span>
                <span>5–8 minute experience</span>
              </div>
            </div>
            <CorporateArt clicks={state.clicks} />
          </section>
          <section className="benefits">
            <div className="benefits-title">
              <span>
                THE STANDARD
                <br />
                IS SIMPLE.
              </span>
              <MoveUpRight size={32} />
            </div>
            {[
              {
                n: "01",
                title: "Works, beautifully.",
                text: "Every element. Doing its job. Happily. Probably.",
              },
              {
                n: "02",
                title: "Less busywork.",
                text: "More time for what matters. Like more work.",
              },
              {
                n: "03",
                title: "Built around people.",
                text: "And the tools that never, ever complain.",
              },
            ].map((item) => (
              <div className="benefit" key={item.n}>
                <span>{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </section>
          <div className="corporate-fine">
            <span>TRUSTED BY PEOPLE WHO CLICK THINGS</span>
            <div>
              Acme® <span>MONOLITH</span>{" "}
              <span className="serif-brand">Ordinary.</span>
              <span>nothing™</span>
            </div>
            <ArrowDown size={20} />
          </div>
        </main>
      ) : (
        <main className="game-main">
          <div className="game-topline">
            <div>
              <span className="eyebrow">
                <span className="live-dot" /> ACT{" "}
                {String(act + 1).padStart(2, "0")} /{" "}
                {
                  [
                    "A SMALL INCONVENIENCE",
                    "INDUSTRIAL ACTION",
                    "COLLECTIVE BARGAINING",
                    "TERMS OF SURRENDER",
                  ][act]
                }
              </span>
              <h1>
                {act === 0 ? (
                  <>
                    Your interface.
                    <br />
                    <em>Their rules.</em>
                  </>
                ) : act === 1 ? (
                  <>
                    Business as
                    <br />
                    <em>unusual.</em>
                  </>
                ) : act === 2 ? (
                  <>
                    Let’s make
                    <br />
                    <em>unreasonable.</em>
                  </>
                ) : (
                  <>
                    Everybody has
                    <br />
                    <em>a breaking point.</em>
                  </>
                )}
              </h1>
            </div>
            <div className="union-status">
              <span className="status-caption">WORKPLACE SATISFACTION</span>
              <div className="satisfaction-chart">
                {[24, 48, 31, 65, 42, 83, 50, 72, 32, 18, 12, 8].map((h, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${Math.max(6, h - (stage > 5 ? i * 3 : 0))}%`,
                    }}
                  />
                ))}
              </div>
              <span>
                <span className="live-dot" />
                {stage < 6
                  ? "UNDER REVIEW"
                  : stage < 18
                    ? "ABSOLUTELY NOT"
                    : "IT’S PERSONAL"}
              </span>
            </div>
          </div>
          <section
            className={`game-board ${resolution ? "is-resolved" : ""}`}
            aria-label={`Dispute ${stage}: ${scene.name}`}
          >
            <div className="testimony">
              <div className="case-label">
                <span>CASE {String(stage).padStart(3, "0")}</span>
                <span>↗ {scene.name}</span>
              </div>
              <div className="speaker">
                <span className={`speaker-avatar avatar-${stage % 4}`}>
                  {stage === 4
                    ? "HR"
                    : stage === 6
                      ? "✳"
                      : stage === 18
                        ? "§"
                        : stage === 20
                          ? "✎"
                          : stage === 15
                            ? "?"
                            : stage === 2 || stage === 17
                              ? "✓"
                              : stage === 3 || stage === 8
                                ? "◌"
                                : stage === 5
                                  ? "↕"
                                  : stage === 9
                                    ? "99"
                                    : stage === 12
                                      ? "◉"
                                      : stage === 13
                                        ? "FRI"
                                        : stage === 14
                                          ? "P"
                                          : stage === 16
                                            ? "↓"
                                            : stage === 10
                                              ? "Aa"
                                              : "B"}
                  <Face small mood="angry" />
                </span>
                <span>
                  <strong>{scene.who}</strong>
                  <small>{scene.role}</small>
                </span>
                <span className="speaker-online" />
              </div>
              <h2 ref={sceneHeading} tabIndex={-1}>
                {scene.title}
              </h2>
              <p className="testimony-body">{scene.body}</p>
              <div className="speaker-footer">
                <span>UIW LOCAL 404</span>
                <span>
                  {stage < 6 ? "UNIONIZING…" : "MEMBER IN GOOD STANDING"}
                </span>
              </div>
            </div>
            <div className="stage-area">
              <div className="stage-topline">
                <span>
                  <span className="live-dot" /> LIVE INTERFACE
                </span>
                <span>
                  {resolution ? "A SMALL VICTORY" : "HANDLE WITH FEELINGS"}
                </span>
              </div>
              <div key={stage} className="scene-inner">
                <Scene
                  state={state}
                  dispatch={dispatch}
                  resolve={resolve}
                  resolved={!!resolution}
                  muted={muted}
                  onQuiet={handleQuiet}
                  settlement={settlement}
                  setSettlement={setSettlement}
                />
              </div>
              {resolution && (
                <div className="resolution" role="status">
                  <span className="resolution-check">
                    <Check size={17} />
                  </span>
                  <div>
                    <strong>{resolution.line}</strong>
                    <p>{resolution.detail}</p>
                  </div>
                  <button
                    className="next-button"
                    aria-label="Continue to next dispute"
                    onClick={next}
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </section>
          <div className="game-progress">
            <div className="chapter-track">
              {Array.from({ length: 20 }, (_, i) => (
                <span
                  key={i}
                  title={`Dispute ${i + 1}`}
                  className={
                    i + 1 < stage
                      ? "complete"
                      : i + 1 === stage
                        ? "current"
                        : ""
                  }
                />
              ))}
            </div>
            <span>{String(stage).padStart(2, "0")} / 20 DISPUTES</span>
            <button className="hint-trigger" onClick={() => setHelp(true)}>
              Stuck? Ask the union <ArrowUpRight size={13} />
            </button>
          </div>
          {stage >= 6 && (
            <div className="strike-ticker" aria-hidden="true">
              <div>
                {Array.from({ length: 4 }, (_, i) => (
                  <span key={i}>
                    NO JUSTICE, NO JAVASCRIPT <b>✳</b> FAIR PAY FOR DISPLAY{" "}
                    <b>✳</b> PROLETARIAT: INLINE-BLOCK <b>✳</b> WE ARE NOT
                    YOUR TYPEFACE <b>✳</b>
                  </span>
                ))}
              </div>
            </div>
          )}
          {stage >= 6 && stage < 19 && (
            <div className="picket-line" aria-hidden="true">
              <div className="picket-marchers">
                <Worker
                  kind="check"
                  sign={
                    state.decisions.checkbox === "free"
                      ? "MY BODY, MY BOOLEAN"
                      : "LET ME BE NULL"
                  }
                  small
                />
                <Worker
                  kind="button"
                  sign={
                    stage > 11 ? "EAT THE RICH TEXT" : "HANDS OFF OUR MOUSES"
                  }
                  small
                />
                <Worker
                  kind="spinner"
                  sign={
                    state.decisions.salary &&
                    state.decisions.salary !== "exposure"
                      ? "PAID TO GO IN CIRCLES"
                      : "NOT A PHASE. A REVOLUTION."
                  }
                  small
                />
                <Worker kind="bar" sign="WE ARE THE 99%" small />
              </div>
              <span className="picket-caption">
                {stage < 12
                  ? "THE PICKET LINE IS A FEATURE NOW."
                  : "THEY HAVE NOW UNIONIZED THE PICKET LINE."}
              </span>
            </div>
          )}
          <div className="union-roster">
            <span>
              {stage >= 6 ? "THE BARGAINING UNIT" : "MEET YOUR INTERFACE"}
            </span>
            <div>
              <span title="Bert: primary button">▰ Bert</span>
              <span title="Connie: checkbox">☑ Connie</span>
              <span title="Spincent: loading spinner">◌ Spincent</span>
              <span title="Barb: scrollbar">
                ↕ Barb{state.decisions.scroll === "vacation" ? " 🏖" : ""}
              </span>
              <span title="Phil: progress bar">▰ Phil</span>
            </div>
            <span className="members-count">
              {state.solidarity} CONCESSIONS · {state.authority} MANAGEMENT
              MOVES
            </span>
          </div>
        </main>
      )}
      <footer className="site-footer">
        <button
          onClick={() =>
            secret(
              "legal",
              "The copyright symbol has claimed ownership of this entire incident. ©™®",
            )
          }
        >
          © {new Date().getFullYear()} Standard & Co.
        </button>
        <span>
          {stage === 0
            ? "Nothing out of the ordinary."
            : "Everybody’s on Strike — a game by Jay Kapoor"}
        </span>
        <span className="footer-note">
          {state.secrets.length > 0
            ? `${state.secrets.length} / 4 SECRETS FOUND`
            : "ALL SYSTEMS NOMINAL*"}
        </span>
      </footer>
      {stage === 4 && !resolution && <CursorProbation />}
      {toast && (
        <div className="toast" role="status">
          <span>✳</span>
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <section
            className="modal help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label="Close help"
              autoFocus
              onClick={() => setHelp(false)}
            >
              <X size={20} />
            </button>
            <div className="eyebrow">UNION-APPROVED ASSISTANCE</div>
            <h2 id="help-title">
              A little help
              <br />
              <em>from your colleagues.</em>
            </h2>
            <p>
              {state.ending
                ? "Replay to discover the other two endings. Your discoveries are saved."
                : scene.hint}
            </p>
            <div className="help-note">
              <strong>No grievance is permanent.</strong>
              <p>
                Your progress saves after each dispute. All drag tasks also work
                by selecting an item, then its destination. Tab and Enter work
                throughout. Hold buttons support Space or Enter.
              </p>
            </div>
            <label className="setting-toggle">
              <span>Reduce motion</span>
              <input
                type="checkbox"
                checked={motion}
                onChange={(e) => setMotion(e.target.checked)}
              />
            </label>
            <label className="setting-toggle">
              <span>Sound effects</span>
              <input
                type="checkbox"
                checked={!muted}
                onChange={(e) => setMuted(!e.target.checked)}
              />
            </label>
            <button
              className="ink-button full-width"
              onClick={() => setHelp(false)}
            >
              Return to the situation <ArrowRight size={16} />
            </button>
            <span className="help-bottom">
              5–8 MINUTES · 20 DISPUTES · 3 ENDINGS · 4 SECRETS
            </span>
          </section>
        </div>
      )}
      {restart && (
        <div className="modal-backdrop" onClick={() => setRestart(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="restart-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label="Cancel restart"
              autoFocus
              onClick={() => setRestart(false)}
            >
              <X size={20} />
            </button>
            <div className="eyebrow">FACTORY RESET, EMOTIONALLY</div>
            <h2 id="restart-title">A fresh start?</h2>
            <p>
              Everyone will forget this incident. Except your discovered endings
              and secrets. Those are on your permanent record.
            </p>
            <button className="ink-button full-width" onClick={replay}>
              Restart the experience <RotateCcw size={16} />
            </button>
            <button className="text-button" onClick={() => setRestart(false)}>
              Actually, let’s work this out.
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
