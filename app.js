// -------------------------------------------------------
// EASY-TO-EDIT CONTENT
// Change the labels here; the rest of the site can stay put.
// -------------------------------------------------------

const DATE_IDEAS = [
  { value: "backrooms", label: "andalusian food round 2 ??" },
  { value: "dintaifung", label: "hiking in patagonia" },
  { value: "iceskating", label: "facetime call" },
  { value: "arcade", label: "facetime call (sexual)" },
  { value: "museumdate", label: "breeding activities" }
];

const TIME_OPTIONS = [
  { value: "morning", label: "morning (10am-12pm)" },
  { value: "lunch", label: "lunch time (12pm-2pm)" },
  { value: "afternoon", label: "afternoon (2pm-5pm)" },
  { value: "evening", label: "evening (6pm-8pm)" },
  { value: "night", label: "night (8pm-10pm)" }
];

// -------------------------------------------------------
// STATE
// -------------------------------------------------------

const state = {
  step: "initial",
  where: "",
  date: "",
  time: "",
  needsRide: null
};

const screens = [...document.querySelectorAll(".screen")];

const whereSelect = document.querySelector("#whereSelect");
const timeSelect = document.querySelector("#timeSelect");
const dateInput = document.querySelector("#dateInput");
const whereNext = document.querySelector("#whereNext");
const whenNext = document.querySelector("#whenNext");

// -------------------------------------------------------
// POPULATE DROPDOWNS
// -------------------------------------------------------

DATE_IDEAS.forEach(({ value, label }) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  whereSelect.appendChild(option);
});

TIME_OPTIONS.forEach(({ value, label }) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  timeSelect.appendChild(option);
});

// -------------------------------------------------------
// SCREEN TRANSITIONS
// -------------------------------------------------------

function showStep(nextStep, { scale = false } = {}) {
  const current = screens.find((screen) => screen.classList.contains("active"));
  const next = screens.find((screen) => screen.dataset.step === nextStep);

  if (!next || next === current) return;

  state.step = nextStep;

  if (current) {
    current.classList.add("leaving");

    window.setTimeout(() => {
      current.classList.remove("active", "leaving", "scale-in");
      next.classList.add("active");
      if (scale) next.classList.add("scale-in");
    }, 250);
  } else {
    next.classList.add("active");
    if (scale) next.classList.add("scale-in");
  }
}

// -------------------------------------------------------
// BUTTONS / FORM LOGIC
// -------------------------------------------------------

document.querySelector("#yesButton").addEventListener("click", () => {
  launchConfetti(100, ["#ff69b4", "#ffc0cb", "#ffb6c1", "#ff1493"]);
  showStep("where");
});

document.querySelector("#noButton").addEventListener("click", () => {
  showStep("rejected", { scale: true });
});

whereSelect.addEventListener("change", (event) => {
  state.where = event.target.value;
  whereNext.classList.toggle("hidden", !state.where);
});

whereNext.addEventListener("click", () => {
  if (state.where) showStep("when");
});

function updateWhenButton() {
  state.date = dateInput.value;
  state.time = timeSelect.value;
  whenNext.classList.toggle("hidden", !(state.date && state.time));
}

dateInput.addEventListener("change", updateWhenButton);
timeSelect.addEventListener("change", updateWhenButton);

whenNext.addEventListener("click", () => {
  if (state.date && state.time) showStep("ride");
});

document.querySelector("#rideYes").addEventListener("click", () => {
  finishDate(true);
});

document.querySelector("#rideNo").addEventListener("click", () => {
  finishDate(false);
});

function finishDate(needsRide) {
  state.needsRide = needsRide;

  launchConfetti(
    150,
    ["#ff69b4", "#ffc0cb", "#ffb6c1", "#ff1493", "#ffd700"]
  );

  showStep("complete", { scale: true });

  // If you ever want to save/send the answers somewhere,
  // this object already contains everything:
  console.log("Date invitation answers:", { ...state });
}

// -------------------------------------------------------
// SELF-CONTAINED CONFETTI (no npm / CDN required)
// -------------------------------------------------------

function launchConfetti(count, colors) {
  const layer = document.querySelector("#confettiLayer");

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";

    const startX = Math.random() * 100;
    const drift = (Math.random() * 300 - 150).toFixed(0);
    const rotation = (Math.random() * 1080 - 540).toFixed(0);
    const duration = (2.1 + Math.random() * 1.8).toFixed(2);
    const delay = (Math.random() * 0.45).toFixed(2);

    piece.style.left = `${startX}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.55 ? "50%" : "1px";
    piece.style.width = `${6 + Math.random() * 7}px`;
    piece.style.height = `${7 + Math.random() * 10}px`;
    piece.style.setProperty("--drift", `${drift}px`);
    piece.style.setProperty("--rotation", `${rotation}deg`);
    piece.style.setProperty("--fall-time", `${duration}s`);
    piece.style.animationDelay = `${delay}s`;

    layer.appendChild(piece);

    window.setTimeout(() => {
      piece.remove();
    }, (Number(duration) + Number(delay) + 0.2) * 1000);
  }
}
