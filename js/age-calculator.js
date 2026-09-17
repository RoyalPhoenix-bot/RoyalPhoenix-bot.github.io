/**
 * js/ageCalculator.js
 * Dynamically calculates age in y m d h format.
 */

// Configure your birthdate (Format: YYYY-MM-DDTHH:mm:ss)
const BIRTH_DATE_STRING = "2002-10-27T20:40:48";

function calculateExactAge(birthDate, now = new Date()) {
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  let hours = now.getHours() - birthDate.getHours();
  let minutes = now.getMinutes() - birthDate.getMinutes();

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }

  if (hours < 0) {
    days--;
    hours += 24;
  }

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days, hours };
}

function updateAgeDisplay() {
  const ageTarget = document.getElementById("dynamic-age");
  if (!ageTarget) return;

  const birthDate = new Date(BIRTH_DATE_STRING);
  if (isNaN(birthDate.getTime())) {
    console.error("Invalid BIRTH_DATE_STRING in ageCalculator.js");
    return;
  }

  const { years, months, days, hours } = calculateExactAge(birthDate);

  ageTarget.textContent = `${years}y ${months}m ${days}d ${hours}h`;
}

// Initialize on page load and update automatically every minute
document.addEventListener("DOMContentLoaded", () => {
  updateAgeDisplay();
  setInterval(updateAgeDisplay, 60000);
});
