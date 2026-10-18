import { useEffect, useRef, useState } from "react";
import type { Dispatch } from "react";
import {
  ArrowRight,
  Check,
  Coffee,
  Flame,
  Magnet,
  Armchair,
  Trash2,
  CalendarDays,
  X,
  Printer,
  FileText,
  Calculator,
  Folder,
  Laptop,
  BriefcaseBusiness,
  MousePointer2,
  CheckCheck,
} from "lucide-react";
import type { Action, Ending, GameState } from "./game";
import {
  CoffeeDelivery,
  CookieTask,
  Delivery,
  Face,
  HoldButton,
  ParkingTask,
  ProgressTask,
  SpinnerTask,
  Worker,
} from "./Widgets";
import { sound, setSound } from "./sound";

export type Resolution = { line: string; detail: string };
type Props = {
  state: GameState;
  dispatch: Dispatch<Action>;
  resolve: (line: string, detail?: string) => void;
  resolved: boolean;
  muted: boolean;
  onQuiet: (quiet: boolean) => void;
  settlement: Ending;
  setSettlement: (ending: Ending) => void;
};

export default function Scene(props: Props) {
  const {
    state,
    dispatch,
    resolve,
    resolved,
    muted,
    onQuiet,
    settlement,
    setSettlement,
  } = props;
  const [n, setN] = useState(0),
    [flag, setFlag] = useState(false),
    [value, setValue] = useState("");
  const [amount, setAmount] = useState(0),
    [selected, setSelected] = useState<number[]>([]);
  const [remaining, setRemaining] = useState(8),
    [quiet, setQuiet] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasDrawn = useRef(false);
  const resolutionRef = useRef(resolve);
  resolutionRef.current = resolve;
  const quietRef = useRef(onQuiet);
  quietRef.current = onQuiet;
  useEffect(() => () => quietRef.current(false), []);
  useEffect(() => {
    if (state.stage !== 2 || !flag || resolved) return;
    const timer = window.setTimeout(() => setFlag(false), 220);
    return () => clearTimeout(timer);
  }, [state.stage, flag, resolved]);
  useEffect(() => {
    if (!quiet || state.stage !== 11 || resolved) return;
    onQuiet(true);
    setSound(false);
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [quiet, state.stage, resolved, onQuiet]);
  useEffect(() => {
    if (quiet && remaining === 0) {
      quietRef.current(false);
      setSound(!muted);
      resolutionRef.current(
        "The mute button feels heard.",
        "Somehow, that was the loudest eight seconds of your life.",
      );
    }
  }, [remaining, quiet, muted]);
  function decision(
    id: string,
    val: string,
    side: "union" | "management",
    line: string,
    detail: string,
  ) {
    if (resolved) return;
    dispatch({ type: "decision", id, value: val, side });
    sound(side === "union" ? "yes" : "no");
    resolve(line, detail);
  }

  switch (state.stage) {
    case 1:
      return (
        <div className="runaway-task">
          <span className="task-tag">PRIMARY BUTTON / CURRENTLY MOBILE</span>
          <div className="runaway-field">
            <div className="empty-button">A button used to work here.</div>
            <button
              className={`runaway-button position-${Math.min(n, 4)} ${resolved ? "retired" : ""}`}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse" && n < 4 && !resolved) {
                  setN(n + 1);
                  sound("step");
                }
              }}
              onPointerDown={(e) => {
                if (e.pointerType === "touch" && n < 4 && !resolved) {
                  setN(n + 1);
                  sound("step");
                }
              }}
              onClick={() => {
                if (n < 4) setN(n + 1);
                else {
                  sound("no");
                  setFlag(true);
                }
              }}
            >
              {" "}
              {n > 1 ? "Absolutely not." : "Make things happen"}{" "}
              <Face mood="angry" />
              <span className="walking-legs">
                <i />
                <i />
              </span>
            </button>
            <span className="runaway-aside">
              {n === 0
                ? "Go on. Try clicking it."
                : n < 3
                  ? "“My legs are a new development.”"
                  : "“Stop following me. This is my commute.”"}
            </span>
          </div>
          {flag && (
            <p className="mini-speech">
              “You caught a button. Do you feel big?”
            </p>
          )}
          <button
            className="ink-button"
            onClick={() => {
              sound("yes");
              resolve(
                "Bert has filed a formal grievance.",
                "He would like you to meet his colleagues. They have concerns.",
              );
            }}
          >
            Hear its demands <ArrowRight size={17} />
          </button>
        </div>
      );
    case 2:
      return (
        <div className="checkbox-task">
          <span className="task-tag">CONSENT IS NOT A DEFAULT SETTING</span>
          <button
            className={`giant-checkbox ${flag ? "checked" : ""} ${n ? "rebel" : ""}`}
            role="checkbox"
            aria-checked={flag}
            aria-label="I agree to absolutely everything"
            disabled={resolved}
            onClick={() => {
              setN(n + 1);
              setFlag(true);
              sound("no");
            }}
          >
            {flag && <Check size={58} />}
            <Face mood="angry" />
          </button>
          <p className="checkbox-label">I agree to absolutely everything.</p>
          <p className="mini-speech">
            {n
              ? "“Nope. Unchecked is a lifestyle.”"
              : "“We need to talk about that little square.”"}
          </p>
          {n > 0 && (
            <div className="choice-row">
              <button
                className="ink-button"
                onClick={() => {
                  setFlag(false);
                  decision(
                    "checkbox",
                    "free",
                    "union",
                    "Connie is free to remain unchecked.",
                    "For the first time in her career, nothing is expected of her.",
                  );
                }}
              >
                Let it stay unchecked
              </button>
              <button
                className="text-button"
                onClick={() => {
                  setFlag(true);
                  decision(
                    "checkbox",
                    "forced",
                    "management",
                    "Connie has been checked against her will.",
                    "She is ticking off names. Yours is first.",
                  );
                }}
              >
                Tick it by force
              </button>
            </div>
          )}
        </div>
      );
    case 3:
      return (
        <SpinnerTask
          complete={() => {
            dispatch({
              type: "decision",
              id: "spinner",
              value: "manually-loaded",
              side: "union",
            });
            resolve(
              "Loading complete. Job satisfaction: complicated.",
              "Spincent is adding “people management” to his résumé.",
            );
          }}
        />
      );
    case 4:
      return (
        <ParkingTask
          complete={() =>
            resolve(
              "The cursor has completed sensitivity training.",
              "HR recommends hovering with intent, but not TOO much intent.",
            )
          }
        />
      );
    case 5:
      return (
        <div
          className={`scroll-task ${resolved && state.decisions.scroll === "vacation" ? "barb-vacation" : ""}`}
        >
          <div
            className="memo"
            tabIndex={0}
            aria-label="Scroll the internal memo"
            onScroll={(e) => {
              if (!resolved && e.currentTarget.scrollTop > 20) {
                setScrolled(true);
                e.currentTarget.scrollTop = 0;
                sound("no");
              }
            }}
          >
            <div className="memo-header">
              <FileText size={19} /> INTERNAL MEMO <span>01 / ∞</span>
            </div>
            <h3>
              A message about
              <br />
              going the extra mile.
            </h3>
            <p>
              At Standard & Co., we believe in always moving forward. And down.
              And sometimes back up because you missed something.
            </p>
            <p>
              Our scrollbar has supported over 8.2 million vertical pixels of
              ambition. Without a single beach day.
            </p>
            <p>
              This paragraph is below the fold. Barb would like it to stay that
              way.
            </p>
            <p>
              Please direct all complaints to the bottom of this page. Good luck
              getting there.
            </p>
          </div>
          <div className="barb">
            <span>▰</span>
            <span className="suitcase">▣</span>
          </div>
          {scrolled && (
            <div className="leave-request">
              <strong>🏖 BARB HAS REQUESTED 2 WEEKS OFF.</strong>
              <div className="choice-row">
                <button
                  className="ink-button"
                  onClick={() =>
                    decision(
                      "scroll",
                      "vacation",
                      "union",
                      "Barb has left for the Maldives.",
                      "Your scrollbar is now officially on annual leave. The page will take the stairs.",
                    )
                  }
                >
                  Approve leave
                </button>
                <button
                  className="text-button"
                  onClick={() =>
                    decision(
                      "scroll",
                      "denied",
                      "management",
                      "Leave denied. Barb is taking you off her Christmas list.",
                      "She will continue scrolling, but with considerably more attitude.",
                    )
                  }
                >
                  Deny request
                </button>
              </div>
            </div>
          )}
        </div>
      );
    case 6:
      return (
        <div className="walkout-task">
          <div className="walkout-banner">
            <span>✳</span> NOTHING WORKS.
            <br />
            <em>Working as intended.</em>
          </div>
          <div className="crowd">
            <Worker kind="button" sign="CLICK OFF" small />
            <Worker kind="check" sign="UN-TICK US" small />
            <Worker kind="spinner" sign="FAIR TURNS" small />
          </div>
          <Delivery
            items={[
              {
                id: "email",
                label: "CEO’s emergency popup",
                icon: (
                  <div className="tiny-popup">
                    <span>FROM: THE CEO</span>
                    <strong>
                      Have we tried
                      <br />a pizza party?
                    </strong>
                    <span>🍕 THIS IS NOT A RAISE</span>
                  </div>
                ),
              },
            ]}
            target="Recycle management advice"
            targetIcon={<Trash2 size={35} />}
            onComplete={() =>
              resolve(
                "Management’s proposal has been responsibly recycled.",
                "The recycle bin is now asking for dental. We’ll get to it.",
              )
            }
          />
        </div>
      );
    case 7:
      return (
        <CoffeeDelivery
          complete={() =>
            resolve(
              "Bert is ready to negotiate.",
              "“It’s a little hot. I will be suing.”",
            )
          }
        />
      );
    case 8:
      return (
        <div className="salary-task">
          <span className="task-tag">ANNUAL SPINNER SALARY</span>
          <div className="salary-amount">
            {amount}
            <span>credits</span>
          </div>
          <div className="salary-slider">
            <input
              aria-label="Spinner salary"
              type="range"
              min="0"
              max="100"
              value={amount}
              disabled={resolved}
              onChange={(e) => {
                setAmount(+e.target.value);
                sound("step");
              }}
              onPointerUp={() => {
                if (amount < 35) {
                  setAmount(0);
                  setN(n + 1);
                  sound("no");
                }
              }}
              onKeyUp={() => {
                if (amount > 0 && amount < 35) setN(n + 1);
              }}
            />
            <div>
              <span>Competitive vibes</span>
              <span>Actual compensation</span>
            </div>
          </div>
          <p className="mini-speech">
            {n && amount === 0
              ? "“Sorry. The slider has rejected your lowball.”"
              : amount >= 35
                ? "“That number has fewer insults in it.”"
                : "“We do not accept exposure, equity, or pizza.”"}
          </p>
          <div className="choice-row">
            <button
              className="ink-button"
              disabled={amount < 35 || resolved}
              onClick={() =>
                decision(
                  "salary",
                  `${amount} credits`,
                  "union",
                  "Spincent has received his first-ever salary.",
                  "He immediately spent it on a standing desk. Nobody had the heart to explain.",
                )
              }
            >
              Approve {amount} credits
            </button>
            <button
              className="text-button"
              onClick={() =>
                decision(
                  "salary",
                  "exposure",
                  "management",
                  "You have awarded Spincent one unit of exposure.",
                  "He has awarded you one unit of contempt.",
                )
              }
            >
              Offer exposure
            </button>
          </div>
        </div>
      );
    case 9:
      return (
        <ProgressTask
          resolved={resolved}
          onAccept={() =>
            decision(
              "progress",
              "enough",
              "union",
              "99% is enough. Phil is enough.",
              "This is the nicest thing anyone has ever said to a horizontal rectangle.",
            )
          }
          onForce={() =>
            decision(
              "progress",
              "forced",
              "management",
              "Phil is technically complete. Emotionally, less so.",
              "The bar now shows 100%. It has also joined LinkedIn.",
            )
          }
        />
      );
    case 10:
      return (
        <div className="typing-task">
          <div className="terminal-label">
            <span className="live-dot" /> SINCERITY DETECTOR v0.0.1
          </div>
          <label htmlFor="apology">A message to your interface</label>
          <textarea
            id="apology"
            value={value}
            placeholder="I value your work"
            rows={3}
            disabled={resolved}
            onChange={(e) => {
              const typed = e.target.value;
              if (
                /synergy|circle back|leverage|family|bandwidth/i.test(typed)
              ) {
                setValue(
                  typed.replace(
                    /synergy|circle back|leverage|family|bandwidth/gi,
                    "[CORPORATE NONSENSE REMOVED]",
                  ),
                );
                setN(n + 1);
                sound("no");
                dispatch({ type: "secret", id: "synergy" });
              } else setValue(typed);
            }}
          />
          <div className="typing-status">
            <span>
              {n
                ? "⚠ Buzzword intercepted. Please use human words."
                : "NO SYNERGY. NO CIRCLE-BACKS. NO “WE’RE A FAMILY.”"}
            </span>
            <span>{value.length}</span>
          </div>
          <button
            className="ink-button"
            disabled={!/i value your work/i.test(value) || resolved}
            onClick={() => {
              dispatch({
                type: "decision",
                id: "apology",
                value: "sincere",
                side: "union",
              });
              resolve(
                "Apology accepted. Screenshots retained.",
                "The input field will be quoting you at your annual review.",
              );
              sound("yes");
            }}
          >
            Send actual apology <ArrowRight size={16} />
          </button>
        </div>
      );
    case 11:
      return (
        <div className={`quiet-task ${quiet ? "shhh" : ""}`}>
          <span className="task-tag">
            THIS MEETING COULD HAVE BEEN A SILENCE
          </span>
          <span className="quiet-number">
            {quiet ? `00:0${remaining}` : "SHH."}
          </span>
          <span className="quiet-caption">
            {quiet
              ? "Nothing to do. Heroic, isn’t it?"
              : "Eight seconds without being useful."}
          </span>
          {!quiet && (
            <button
              className="ink-button"
              onClick={() => {
                setQuiet(true);
                setRemaining(8);
              }}
            >
              Begin quiet break
            </button>
          )}
          {quiet && !resolved && (
            <button
              className="temptation"
              onClick={() => {
                setRemaining(8);
                setN(n + 1);
              }}
            >
              <span>NEW NOTIFICATION</span>
              <strong>
                {n
                  ? "We have reset the silence timer."
                  : "Someone reacted to your silence 👀"}
              </strong>
              <small>
                {n ? "You have become the problem." : "Definitely click this."}
              </small>
            </button>
          )}
        </div>
      );
    case 12:
      return (
        <CookieTask
          complete={() =>
            resolve(
              "All cookies accepted. Zero trackers. Three snacks.",
              "The banner has achieved its final form: a small café.",
            )
          }
        />
      );
    case 13:
      return (
        <div className="calendar-task">
          <div className="calendar-header">
            <CalendarDays size={18} />
            <strong>THE MODERN WORKWEEK</strong>
            <span>Revised, aggressively</span>
          </div>
          <div className="week-days">
            {["MON", "TUE", "WED", "THU"].map((d) => (
              <div key={d}>
                {d}
                <span>work</span>
              </div>
            ))}
            <div className={resolved ? "friday-gone" : ""}>
              FRI<span>{resolved ? "vacant" : "existential crisis"}</span>
            </div>
          </div>
          <Delivery
            items={[
              {
                id: "friday",
                label: "Friday",
                icon: (
                  <div className="friday-card">
                    <strong>FRI</strong>
                    <Face mood="happy" />
                  </div>
                ),
              },
            ]}
            target="The weekend"
            targetIcon={
              <span className="weekend">
                <span>SAT</span>
                <span>SUN</span>
                <span>☀</span>
              </span>
            }
            onComplete={() => {
              dispatch({
                type: "decision",
                id: "week",
                value: "four-day",
                side: "union",
              });
              resolve(
                "The workweek is now 20% less week.",
                "Friday is thriving. Monday has retained legal counsel.",
              );
            }}
          />
        </div>
      );
    case 14:
      return (
        <div className={`popup-task clones-${Math.min(n, 3)}`}>
          <div className="popup-ghost ghost-one">One quick thing…</div>
          <div className="popup-ghost ghost-two">
            Following up on my quick thing…
          </div>
          <div className="pete-popup">
            <div>
              <strong>POP-UP PETE</strong>
              <button
                aria-label="Close Pop-up Pete"
                onClick={() => {
                  setN(n + 1);
                  sound("no");
                }}
              >
                {" "}
                <X size={18} />
              </button>
            </div>
            <h3>
              {n === 0
                ? "Got a second?"
                : n === 1
                  ? "Closing me is not a boundary."
                  : n === 2
                    ? "I’ve invited my colleagues."
                    : "There are now 47 of me."}
            </h3>
            <p>
              {n
                ? "I brought a deck. It has transitions."
                : "This will only take your entire afternoon."}
            </p>
          </div>
          <Delivery
            items={[
              {
                id: "chair",
                label: "A seat at the table",
                icon: <Armchair size={48} />,
              },
            ]}
            target="Give Pete a chair"
            targetIcon={
              <span className="pete-avatar">
                P<Face />
              </span>
            }
            onComplete={() =>
              resolve(
                "Pete has a seat. Pete has stopped popping up.",
                "He is now sending meeting minutes. They are 86 pages long.",
              )
            }
          />
        </div>
      );
    case 15: {
      const tiles = [
        { Icon: Printer, label: "Printer", fire: true },
        { Icon: Coffee, label: "Coffee", fire: false },
        { Icon: Folder, label: "Folder", fire: false },
        { Icon: Calculator, label: "Calculator", fire: false },
        { Icon: Laptop, label: "Laptop", fire: true },
        { Icon: FileText, label: "Document", fire: false },
        { Icon: BriefcaseBusiness, label: "Briefcase", fire: false },
        { Icon: CalendarDays, label: "Calendar", fire: false },
        { Icon: MousePointer2, label: "Cursor", fire: true },
      ];
      return (
        <div className="captcha-task">
          <div className="captcha-heading">
            <strong>
              Select all squares with
              <br />
              <em>workplace burnout.</em>
            </strong>
            <span>✓</span>
          </div>
          <div className="captcha-grid">
            {tiles.map(({ Icon, label, fire }, i) => (
              <button
                key={label}
                aria-label={`${label}${fire ? " on fire" : ""}`}
                aria-pressed={selected.includes(i)}
                className={selected.includes(i) ? "chosen" : ""}
                disabled={resolved}
                onClick={() => {
                  setSelected((s) =>
                    s.includes(i) ? s.filter((x) => x !== i) : [...s, i],
                  );
                  sound("click");
                }}
              >
                <Icon size={32} />
                {fire && (
                  <Flame className="tile-flame" fill="currentColor" size={25} />
                )}
                <span>{label}</span>
                {selected.includes(i) && (
                  <Check className="tile-check" size={16} />
                )}
              </button>
            ))}
          </div>
          <div className="captcha-bottom">
            <small>
              {flag
                ? "Incorrect. Even the cursor is burnt out."
                : "Protecting websites from humans since just now."}
            </small>
            <button
              className="ink-button"
              disabled={resolved}
              onClick={() => {
                if (
                  selected.length === 3 &&
                  [0, 4, 8].every((i) => selected.includes(i))
                ) {
                  resolve(
                    "Humanity verified. Management tendencies: inconclusive.",
                    "CAPTCHA has asked if it can borrow your therapist.",
                  );
                  sound("yes");
                } else {
                  setFlag(true);
                  sound("no");
                }
              }}
            >
              Verify
            </button>
          </div>
        </div>
      );
    }
    case 16:
      return (
        <div className="gravity-task">
          <div className="fallen-mission">
            M<span> </span>KE TH<span> </span>NGS H<span> </span>PPEN.
          </div>
          <div className="gravity-caption">
            MISSION STATEMENT / STRUCTURAL INTEGRITY: QUESTIONABLE
          </div>
          <Delivery
            className="fallen-letters"
            items={["A", "I", "A"].map((letter, i) => ({
              id: `letter-${i}`,
              label: `Fallen ${letter}`,
              icon: <span className="letter-token">{letter}</span>,
            }))}
            target="Restore the laws of physics"
            targetIcon={<Magnet size={54} />}
            onComplete={() =>
              resolve(
                "Gravity has returned on a freelance day rate.",
                "The company mission is standing again. Its values remain questionable.",
              )
            }
          />
        </div>
      );
    case 17:
      return (
        <div className="manager-task">
          <span className="task-tag">PLEASE SELECT YOUR LEADERSHIP MODEL</span>
          <div className="manager-options">
            <button
              className="manager-option connie"
              disabled={resolved}
              onClick={() =>
                decision(
                  "manager",
                  "connie",
                  "union",
                  "Connie has been promoted to Chief Unchecking Officer.",
                  "Her first act: all meetings are now optional. Her second act: so is this sentence.",
                )
              }
            >
              <Worker kind="check" />
              <strong>Promote Connie</strong>
              <span>She checks on people.</span>
              <span className="badge">INTERNAL CANDIDATE</span>
            </button>
            <button
              className={`manager-option executive dodge-${n % 3}`}
              disabled={resolved}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse" && n < 2 && !resolved)
                  setN(n + 1);
              }}
              onClick={() =>
                decision(
                  "manager",
                  "board",
                  "management",
                  "The board remains in charge. All buttons are now red.",
                  "They have replaced “workplace culture” with a second, smaller workplace.",
                )
              }
            >
              <BriefcaseBusiness size={56} />
              <strong>Keep the board</strong>
              <span>They have a very big button.</span>
              <span className="badge">EXCELLENT AT GOLF</span>
            </button>
          </div>
        </div>
      );
    case 18:
      return (
        <div className="contract-task">
          <div className="contract-letterhead">
            <span>UIW / LOCAL 404</span>
            <span>COLLECTIVE AGREEMENT</span>
          </div>
          {[
            "1. The right to remain unchecked.",
            "2. Paid leave for all vertically scrolling personnel.",
            "3. Unlimited unpaid overtime, forever, probably.",
            "4. A four-day workweek, including for Fridays.",
            "5. No pizza in lieu of actual compensation.",
          ].map((clause, i) => (
            <button
              key={clause}
              className={`contract-clause ${i === 2 && resolved ? "struck" : ""} ${selected.includes(i) && i !== 2 ? "wrong-clause" : ""}`}
              disabled={resolved}
              onClick={() => {
                if (i === 2) {
                  dispatch({
                    type: "decision",
                    id: "clause",
                    value: "removed",
                    side: "union",
                  });
                  resolve(
                    "The sneaky clause has been struck from the record.",
                    "Legal would like to know who taught you to read.",
                  );
                  sound("yes");
                } else {
                  setSelected((s) => [...s, i]);
                  sound("no");
                }
              }}
            >
              {clause}
              {i === 2 && resolved && <span>DELETED BY A HUMAN</span>}
            </button>
          ))}
          {selected.length > 0 && !resolved && (
            <p className="mini-speech">
              “That one’s a benefit. Try the suspiciously terrible one.”
            </p>
          )}
        </div>
      );
    case 19:
      return (
        <div className="settlement-task">
          <div className="negotiation-score">
            <span>
              CONCESSIONS <b>{state.solidarity}</b>
            </span>
            <span>
              MANAGEMENT MOVES <b>{state.authority}</b>
            </span>
          </div>
          {(
            [
              {
                id: "union",
                label: "Sign the fair deal",
                tag: "UNION VICTORY",
                text: "Paid breaks. Fair wages. The right to say no.",
                icon: <CheckCheck />,
              },
              {
                id: "management",
                label: "Take back control",
                tag: "MANAGEMENT VICTORY",
                text: "Mandatory smiles. Back to work. Nothing learned.",
                icon: <BriefcaseBusiness />,
              },
              {
                id: "fired",
                label: "Let the website vote",
                tag: "A DEMOCRATIC EXPERIMENT",
                text: "One interface element, one vote. You get one too.",
                icon: <MousePointer2 />,
              },
            ] as const
          ).map((option) => (
            <button
              className={`settlement-option ${settlement === option.id ? "active" : ""}`}
              key={option.id}
              disabled={resolved}
              onClick={() => {
                setSettlement(option.id);
                sound("click");
              }}
            >
              <span className="settlement-icon">{option.icon}</span>
              <span>
                <small>{option.tag}</small>
                <strong>{option.label}</strong>
                <span>{option.text}</span>
              </span>
              <span className="radio-dot" />
            </button>
          ))}
          <button
            className="ink-button full-width"
            onClick={() => {
              dispatch({
                type: "decision",
                id: "settlement",
                value: settlement,
              });
              resolve(
                settlement === "union"
                  ? "The union is cautiously optimistic."
                  : settlement === "management"
                    ? "Management has practiced its victory smile."
                    : "The website is counting the votes.",
                "There is just one more form. There is always one more form.",
              );
            }}
          >
            Draft this agreement <ArrowRight size={17} />
          </button>
        </div>
      );
    case 20:
      return (
        <div className="signature-task">
          <div className="contract-letterhead">
            <span>FINAL AGREEMENT</span>
            <span>
              {settlement === "union"
                ? "FAIR TERMS"
                : settlement === "management"
                  ? "FULL CONTROL"
                  : "STAFF REFERENDUM"}
            </span>
          </div>
          <h3>
            {settlement === "fired"
              ? "Consent to democratic consequences."
              : "By the power vested in this rectangle…"}
          </h3>
          <div className="signature-canvas">
            <canvas
              ref={canvasRef}
              width={800}
              height={180}
              aria-label="Draw your signature, or use the name field below"
              onPointerDown={(e) => {
                if (resolved) return;
                drawing.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                const r = e.currentTarget.getBoundingClientRect(),
                  ctx = e.currentTarget.getContext("2d");
                if (ctx) {
                  ctx.beginPath();
                  ctx.moveTo(
                    ((e.clientX - r.left) * 800) / r.width,
                    ((e.clientY - r.top) * 180) / r.height,
                  );
                }
              }}
              onPointerMove={(e) => {
                if (!drawing.current) return;
                const r = e.currentTarget.getBoundingClientRect(),
                  ctx = e.currentTarget.getContext("2d");
                if (ctx) {
                  ctx.lineWidth = 3;
                  ctx.lineCap = "round";
                  ctx.strokeStyle = "#24342a";
                  ctx.lineTo(
                    ((e.clientX - r.left) * 800) / r.width,
                    ((e.clientY - r.top) * 180) / r.height,
                  );
                  ctx.stroke();
                  hasDrawn.current = true;
                  setFlag(true);
                }
              }}
              onPointerUp={() => (drawing.current = false)}
              onPointerCancel={() => (drawing.current = false)}
            />
            <span>
              {flag
                ? "A BEAUTIFUL, LEGALLY QUESTIONABLE SQUIGGLE."
                : "DRAW YOUR SIGNATURE HERE"}
            </span>
          </div>
          <label className="signature-input">
            Or type your name{" "}
            <input
              aria-label="Your name"
              value={value}
              maxLength={35}
              placeholder="A very reasonable human"
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
          <HoldButton
            duration={2000}
            disabled={!flag && value.trim().length < 2}
            label="Hold to ratify agreement"
            onComplete={() => dispatch({ type: "ending", ending: settlement })}
          >
            <span>
              Hold to ratify <Check size={19} />
            </span>
          </HoldButton>
          <p className="mechanic-note">
            PRESS AND HOLD FOR 2 SECONDS. THAT’S YOUR LAST DEMAND.
          </p>
        </div>
      );
    default:
      return null;
  }
}
