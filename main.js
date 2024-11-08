import "./style.css";
import "./src/theme";
import Sound from "./src/assets/ding.mp3";

const minuteSpan = document.getElementById("minute");
const secondSpan = document.getElementById("second");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const workSpan = document.getElementById("works");
const breakSpan = document.getElementById("breaks");
const longBreakSpan = document.getElementById("long-breaks");

const workTime = 25;
const breakTime = 5;
const longBreakTime = 15;
const delay = 1000;

let workCount = workTime;
let breakCount = breakTime;
let longBreakCount = longBreakTime;
let secondCount = 0;
let cycleCount = 0;
let currentTimeout;
let paused = false;
let currentPhase = "work";
let timeWhenTabWasHidden = 0;

const countdownSound = new Audio(Sound);

function setMinutes(count) {
  minuteSpan.innerText = count.toString().padStart(2, "0");
}

function setSeconds(count) {
  secondSpan.innerText = count.toString().padStart(2, "0");
}

function setElement(element, count) {
  element.innerText = count;
}

function playSound() {
  countdownSound.play();
}

function runCountdown() {
  if (paused) return;

  if (secondCount === 0) {
    if (currentPhase === "work" && workCount > 0) {
      workCount--;
      secondCount = 59;
      setMinutes(workCount);
    } else if (currentPhase === "break" && breakCount > 0) {
      breakCount--;
      secondCount = 59;
      setMinutes(breakCount);
    } else if (currentPhase === "longBreak" && longBreakCount > 0) {
      longBreakCount--;
      secondCount = 59;
      setMinutes(longBreakCount);
    } else {
      switch (currentPhase) {
        case "work":
          workCount = workTime;
          cycleCount++;
          setElement(workSpan, cycleCount);
          currentPhase = cycleCount % 4 === 0 ? "longBreak" : "break";
          playSound();
          runCountdown();
          return;
        case "break":
          breakCount = breakTime;
          setElement(breakSpan, cycleCount);
          currentPhase = "work";
          playSound();
          runCountdown();
          return;
        case "longBreak":
          longBreakCount = longBreakTime;
          setElement(longBreakSpan, cycleCount);
          cycleCount = 0;
          currentPhase = "work";
          playSound();
          runCountdown();
          return;
      }
    }
  } else {
    secondCount--;
  }

  setSeconds(secondCount);
  currentTimeout = setTimeout(runCountdown, delay);
}

function startTimer() {
  paused = false;
  runCountdown();
}

function runStop() {
  paused = true;
  clearTimeout(currentTimeout);
}

function runReset() {
  clearTimeout(currentTimeout);
  paused = false;
  workCount = workTime;
  breakCount = breakTime;
  longBreakCount = longBreakTime;
  secondCount = 0;
  cycleCount = 0;
  currentPhase = "work";
  setMinutes("00");
  setSeconds("00");
  setElement(workSpan, cycleCount);
  setElement(breakSpan, cycleCount);
  setElement(longBreakSpan, cycleCount);
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", runStop);
resetBtn.addEventListener("click", runReset);

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    timeWhenTabWasHidden = Date.now();
    paused = true;
    clearTimeout(currentTimeout);
  } else {
    if (timeWhenTabWasHidden) {
      const timeElapsedWhileHidden = Date.now() - timeWhenTabWasHidden;
      secondCount -= Math.floor(timeElapsedWhileHidden / delay);
      runCountdown();
    }
  }
});
