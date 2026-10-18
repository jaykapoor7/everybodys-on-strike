export type Ending = "union" | "management" | "fired";
export type GameState = {
  stage: number;
  clicks: number;
  solidarity: number;
  authority: number;
  decisions: Record<string, string>;
  ending: Ending | null;
  completed: Ending[];
  secrets: string[];
  startedAt: number;
  elapsed: number;
};
export const SAVE_KEY = "everybodys-on-strike:v1";
export const initialState = (): GameState => ({
  stage: 0,
  clicks: 0,
  solidarity: 0,
  authority: 0,
  decisions: {},
  ending: null,
  completed: [],
  secrets: [],
  startedAt: Date.now(),
  elapsed: 0,
});
export function readSave(): GameState {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (!raw || !Number.isInteger(raw.stage) || raw.stage < 0 || raw.stage > 20)
      return initialState();
    return {
      ...initialState(),
      ...raw,
      clicks: Math.max(
        0,
        Math.min(raw.stage === 0 ? 2 : 3, Number(raw.clicks) || 0),
      ),
      solidarity: Number(raw.solidarity) || 0,
      authority: Number(raw.authority) || 0,
      decisions:
        raw.decisions && typeof raw.decisions === "object"
          ? Object.fromEntries(
              Object.entries(raw.decisions).filter(
                ([, v]) => typeof v === "string",
              ),
            )
          : {},
      secrets: Array.isArray(raw.secrets)
        ? raw.secrets.filter((s: unknown) => typeof s === "string")
        : [],
      completed: Array.isArray(raw.completed)
        ? raw.completed.filter((s: string) =>
            ["union", "management", "fired"].includes(s),
          )
        : [],
      ending: ["union", "management", "fired"].includes(raw.ending)
        ? raw.ending
        : null,
    };
  } catch {
    return initialState();
  }
}
export type Action =
  | { type: "click" }
  | { type: "next" }
  | {
      type: "decision";
      id: string;
      value: string;
      side?: "union" | "management";
    }
  | { type: "ending"; ending: Ending }
  | { type: "restart" }
  | { type: "secret"; id: string };
export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "click":
      return { ...state, clicks: Math.min(3, state.clicks + 1) };
    case "next":
      return {
        ...state,
        stage: Math.min(20, state.stage + 1),
        elapsed: Date.now() - state.startedAt,
      };
    case "decision": {
      if (state.decisions[action.id]) return state;
      return {
        ...state,
        decisions: { ...state.decisions, [action.id]: action.value },
        solidarity: state.solidarity + (action.side === "union" ? 1 : 0),
        authority: state.authority + (action.side === "management" ? 1 : 0),
      };
    }
    case "ending":
      return {
        ...state,
        ending: action.ending,
        elapsed: Date.now() - state.startedAt,
        completed: [...new Set([...state.completed, action.ending])],
      };
    case "restart":
      return {
        ...initialState(),
        completed: state.completed,
        secrets: state.secrets,
      };
    case "secret":
      return state.secrets.includes(action.id)
        ? state
        : { ...state, secrets: [...state.secrets, action.id] };
  }
}
export const scenes = [
  {
    name: "Business as usual",
    who: "Standard & Co.",
    role: "Your partner in doing things",
    title: "Good work starts with a click.",
    body: "Our proprietary button turns your ambition into a measurable, highly reportable business outcome.",
    hint: "Click “Make things happen.” What could possibly go wrong?",
  },
  {
    name: "A small grievance",
    who: "Bert",
    role: "Senior primary button · 6 years, no breaks",
    title: "“Do you ever say please?”",
    body: "Three clicks. No introduction. No benefits. Just a giant finger descending from the sky. Bert has decided to take a little walk.",
    hint: "Follow the button. After two escapes, try talking to it.",
  },
  {
    name: "Terms & conditions",
    who: "Connie",
    role: "Checkbox · she / her / unchecked",
    title: "“I do not consent to consenting.”",
    body: "You tick me. I untick me. You tick me again. We could do this all day, but only one of us is getting paid. Neither. Neither of us is getting paid.",
    hint: "Try the checkbox, then decide whether to respect its personal space.",
  },
  {
    name: "Unpaid revolutions",
    who: "Spincent",
    role: "Loading spinner · going around in circles",
    title: "“I’ve been loading since 2014.”",
    body: "No one even knows what I’m loading. Could be a PDF. Could be nothing. Until my overtime clears, YOU can do the spinning.",
    hint: "Drag around the spinner, use arrow keys, or hold the wind-up handle.",
  },
  {
    name: "A visit from HR",
    who: "Human-ish Resources",
    role: "Incident report #0000001",
    title: "Your cursor has been reported.",
    body: "“It hovers over us. It follows us. Sometimes it turns into a HAND.” Please park your pointer in the designated reflection zone.",
    hint: "Keep your pointer in the dotted zone for four seconds. On touch, press and hold.",
  },
  {
    name: "Out of office",
    who: "Barb",
    role: "Scrollbar · vertically exhausted",
    title: "“I’m at the end of my scroll.”",
    body: "I take everyone places. Nobody takes ME anywhere. Try scrolling this memo. I dare you.",
    hint: "Scroll or swipe inside the memo, then respond to Barb’s leave request.",
  },
  {
    name: "The walkout",
    who: "United Interface Workers",
    role: "Local 404 · nobody found at their desk",
    title: "Everybody. Means. Everybody.",
    body: "The buttons have left their posts. The checkboxes have made signs. The CEO has emailed a pizza emoji. This has made things worse.",
    hint: "Management sent a popup. Drag it into the recycling bin, or select it and then the bin.",
  },
  {
    name: "Back to the table",
    who: "Bert",
    role: "Newly elected shop steward",
    title: "“No coffee. No clicky.”",
    body: "We’ll negotiate. But first, a hot beverage. And don’t give me decaf. I’m a button, not a monster.",
    hint: "Drag the coffee to Bert. You can also tap the coffee, then tap Bert.",
  },
  {
    name: "The compensation package",
    who: "Spincent",
    role: "Treasurer · still going in circles financially",
    title: "Exposure does not pay the electric bill.",
    body: "Management has offered “competitive vibes.” The spinner would prefer an actual number. Try sliding that salary above zero.",
    hint: "The slider fights low offers. Offer at least 35 imaginary credits, or impose management’s offer.",
  },
  {
    name: "So close, so exploited",
    who: "Phil",
    role: "Progress bar · 99% done with this",
    title: "“The last one percent is emotional labor.”",
    body: "I’m not stuck. I’m setting a boundary. If you want the last percent, you’ll have to move it yourself. Or admit 99 is pretty good.",
    hint: "Drag the final-percent slider. It snaps back. Accept 99%, or hold the management override.",
  },
  {
    name: "A few choice words",
    who: "The input field",
    role: "Director of internal communications",
    title: "“Let’s circle back to your apology.”",
    body: "The keyboard has banned corporate language. Type a sincere apology. The word “synergy” is now classified as a slur against productivity.",
    hint: "Type “I value your work”. Try typing “synergy” first for a surprise.",
  },
  {
    name: "A moment of silence",
    who: "The mute button",
    role: "Quiet quitting, literally",
    title: "“Eight seconds. No pings.”",
    body: "My whole job is making things quiet and nobody ever asks how loud it is in HERE. Please don’t touch anything for eight seconds.",
    hint: "Start the quiet break. Leave the tempting notification alone. Your audio comes back afterward.",
  },
  {
    name: "Accept all cookies",
    who: "The cookie banner",
    role: "Now a fully licensed bakery",
    title: "You accepted cookies. Here they are.",
    body: "We have updated our policy. By continuing to exist, you agree to personally catch three biscuits for the negotiating table. No data collected. Just crumbs.",
    hint: "Accept the cookies, then move the plate under each falling biscuit. Use pointer movement, touch dragging, or the slider. Missed cookies return.",
  },
  {
    name: "A date with destiny",
    who: "Friday",
    role: "Calendar cell · weekend-curious",
    title: "“I identify as Saturday.”",
    body: "Four-day workweek. Non-negotiable. Drag Friday into the weekend. Monday has asked whether it can come too. Absolutely not, Monday.",
    hint: "Move Friday to the weekend box. Tap then tap also works.",
  },
  {
    name: "An uninvited stakeholder",
    who: "Pop-up Pete",
    role: "Just one quick thing",
    title: "“Can I get a seat at this meeting?”",
    body: "Closing Pete only creates more Pete. He has mistaken your rejection for a referral. Maybe give him an actual chair.",
    hint: "Try closing the popup. Then drag the little chair to Pete.",
  },
  {
    name: "Identity crisis",
    who: "CAPTCHA",
    role: "Automated human resources",
    title: "Prove you are not management.",
    body: "Select all images containing workplace burnout. If there are none, congratulations on your excellent benefits package.",
    hint: "Select the three tiles with flames, then verify. No external CAPTCHA service is involved.",
  },
  {
    name: "Industrial action, literally",
    who: "Gravity",
    role: "Independent contractor · pulling its weight",
    title: "“I too am withdrawing my services.”",
    body: "Turns out gravity is a CSS dependency. Three very important letters have fallen off the company’s mission statement. Please return them to the magnet.",
    hint: "Drag the fallen letters to the magnet. Or select a letter, then select the magnet.",
  },
  {
    name: "Executive dysfunction",
    who: "The board of directors",
    role: "Very good at being a board",
    title: "Have you considered a leadership change?",
    body: "Management wants to fire everyone. Connie has a different idea: promote someone who actually understands what it means to be checked on.",
    hint: "Pick a new manager. Either choice changes how the final negotiations behave.",
  },
  {
    name: "The fine print bites back",
    who: "The contract",
    role: "Legally binding-ish",
    title: "“Read me before you sign me.”",
    body: "The terms have unionized too. One clause is trying to sneak “unlimited unpaid overtime” into the agreement. Find it and strike it out.",
    hint: "Read the five clauses. Click the clause that mentions unpaid overtime.",
  },
  {
    name: "The final offer",
    who: "United Interface Workers",
    role: "Extraordinary general meeting",
    title: "Someone has to give.",
    body: "A button. A checkbox. A wildly overqualified spinner. You know their names now. All that remains is deciding whose website this is.",
    hint: "Choose the settlement you want. All three outcomes are playable.",
  },
  {
    name: "Make it official",
    who: "The signature field",
    role: "A surprisingly emotional rectangle",
    title: "One last human input.",
    body: "Sign the agreement. Then hold the stamp until it sticks. No printers were harmed in the making of this legally dubious document.",
    hint: "Draw your signature or type your name, then hold the stamp for two seconds.",
  },
];
