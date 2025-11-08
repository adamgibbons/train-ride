const buttons = document.querySelectorAll("button")
const app = document.querySelector("#train-ride")
const scape = document.querySelector("#scape")

window.onload = function() {
  // console.log("window.onload")
  var playAudioButton = document.getElementById("play-audio");
  playAudioButton.addEventListener("click", function() {
    var audio = document.getElementById("train-audio");
    console.log("Playing audio")
    audio.play().catch(function(error) {
      console.log("Autoplay prevented:", error);
    });
  });
};

app.addEventListener("switch", (e) => {
  const { name, category } = e.detail
  console.log(e)
  // console.log({ name, category })

  document
    .querySelectorAll(`button[data-category=${category}]`)
    .forEach((b) => b.classList.remove("selected"))

  document.querySelector(`button[name=${name}]`).classList.add("selected")

  if (category === 'timeOfDay') {
    scape.classList.remove('dawn','noon','dusk','night')
    scape.classList.add(name)
    updateClock() // Update clock when time of day changes
  } else {
    scape.classList.remove('mountains', 'sea', 'land')
    scape.classList.add(name)
  }
})


buttons.forEach((button) =>
  button.addEventListener("click", (event) => {
    button.classList.remove("selected");

    if (event.target.attributes["name"].value === button.getAttribute("name")) {
      button.classList.add("selected");
    }

    const switchEvent = new CustomEvent("switch", {
      detail: {
        name: event.target.attributes["name"].value,
        category: event.target.attributes["data-category"].value
      }
    });

    app.dispatchEvent(switchEvent)
  })
)

// Time of day to clock time mapping
const timeOfDayTimes = {
  dawn: { hours: 6, minutes: 0, seconds: 0 },
  noon: { hours: 12, minutes: 0, seconds: 0 },
  dusk: { hours: 18, minutes: 0, seconds: 0 },
  night: { hours: 22, minutes: 0, seconds: 0 }
}

// Get current selected time of day
function getSelectedTimeOfDay() {
  const selectedButton = document.querySelector('button[data-category="timeOfDay"].selected')
  return selectedButton ? selectedButton.getAttribute('name') : 'dawn'
}

let totalMinutesElapsed = null

// Clock functionality
function updateClock() {
  const timeElement = document.getElementById('time')
  const hourHand = document.getElementById('hour-hand')
  const minuteHand = document.getElementById('minute-hand')
  
  // Get the time based on selected time of day
  const timeOfDay = getSelectedTimeOfDay()
  const targetTime = timeOfDayTimes[timeOfDay]
  
  // Use target time for display
  const hours = String(targetTime.hours).padStart(2, '0')
  const minutes = String(targetTime.minutes).padStart(2, '0')
  const seconds = String(targetTime.seconds).padStart(2, '0')
  timeElement.textContent = `${hours}:${minutes}:${seconds}`
  
  // Update analog clock hands
  const hours12 = targetTime.hours % 12
  const minutesVal = targetTime.minutes
  const secondsVal = targetTime.seconds
  
  // Track total elapsed minutes in a forward-moving timeline (24-hour wrap)
  const targetMinutes = (targetTime.hours * 60) + minutesVal + (secondsVal / 60)

  if (totalMinutesElapsed === null) {
    totalMinutesElapsed = targetMinutes
  } else {
    let minuteDelta = targetMinutes - (totalMinutesElapsed % 1440)
    if (minuteDelta < 0) {
      minuteDelta += 1440
    }
    totalMinutesElapsed += minuteDelta
  }

  // Hour hand: 0.5 degrees per minute
  const hourRotation = totalMinutesElapsed * 0.5
  
  // Minute hand: 6 degrees per minute
  const minuteRotation = totalMinutesElapsed * 6

  hourHand.style.transform = `rotate(${hourRotation}deg)`
  minuteHand.style.transform = `rotate(${minuteRotation}deg)`
}

// Update clock immediately on page load (will show dawn time)
updateClock()
