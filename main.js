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

const workTime = 25 * 60 * 1000;
const breakTime = 5 * 60 * 1000;
const longBreakTime = 15 * 60 * 1000;

let startTime = 0;
let elapsedTime = 0;
let remainingTime = workTime;
let currentPhase = "work";
let cycleCount = 0;
let paused = false;
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

function updateTime() {
  if (paused) return;

  const now = Date.now();
  elapsedTime = now - startTime;

  if (currentPhase === "work") {
    remainingTime = workTime - elapsedTime;
    if (remainingTime <= 0) {
      playSound();
      cycleCount++;
      setElement(workSpan, cycleCount);
      currentPhase = cycleCount % 4 === 0 ? "longBreak" : "break";
      startTime = Date.now();
    }
  } else if (currentPhase === "break") {
    remainingTime = breakTime - elapsedTime;
    if (remainingTime <= 0) {
      playSound();
      setElement(breakSpan, cycleCount);
      currentPhase = "work";
      startTime = Date.now();
    }
  } else if (currentPhase === "longBreak") {
    remainingTime = longBreakTime - elapsedTime;
    if (remainingTime <= 0) {
      playSound();
      setElement(longBreakSpan, cycleCount);
      runReset();
    }
  }

  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  setMinutes(minutes);
  setSeconds(seconds);

  requestAnimationFrame(updateTime);
}

function startTimer() {
  if (paused) {
    startTime = Date.now() - elapsedTime;
  } else {
    startTime = Date.now();
  }
  paused = false;
  updateTime();
}

function runStop() {
  paused = true;
}

function runReset() {
  paused = true;
  cycleCount = 0;
  currentPhase = "work";
  elapsedTime = 0;
  remainingTime = workTime;
  startTime = Date.now();
  setMinutes("00");
  setSeconds("00");
  setElement(workSpan, cycleCount);
  setElement(breakSpan, cycleCount);
  setElement(longBreakSpan, cycleCount);
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", runStop);
resetBtn.addEventListener("click", runReset);
