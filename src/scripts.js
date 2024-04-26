'use strict';

// String Messages
const msgFieldRequired = 'Field required';
const msgInvalidDay = 'Invalid day';
const msgInvalidMonth = 'Invalid month';
const msgInvalidYear = 'Must be in the past';

// Interactive Classes
const redBorder = 'red-border';
const redText = 'red-text';
const hidden = 'hidden';

// DOM Elements
const inputBoxes = document.querySelectorAll('.form__input-box');
const inputs = document.querySelectorAll('.form__input');
const form = document.querySelector('.form');
const outputEls = document.querySelectorAll('.output__number');

// Current Date
const today = new Date();
const currYear = today.getFullYear();
const currMonth = today.getMonth();
const currDay = today.getDate();

// Update Error Messages Function
const updateMsg = function (type, status, msg) {
  inputBoxes.forEach((box, i) => {
    if (box.dataset.type === type || type === i) {
      const msgEl = box.querySelector('.input__message');

      if (status === 'hide') {
        msgEl.classList.add(hidden);
        box.classList.remove(redBorder, redText);
        return;
      }

      msgEl.classList.remove('hidden');
      box.classList.add(redBorder, redText);
      msgEl.textContent = msg;
    }
  });
};

// Prevent the user from typing anything other than numbers
inputs.forEach(input =>
  input.addEventListener('input', function ({ target }) {
    // replace non-numeric characters with an empty string
    target.value = target.value.replace(/[^0-9]/g, '');
  })
);

// Form Submit Event
form.addEventListener('submit', function (event) {
  event.preventDefault();

  // retrieve user input
  const data = [...inputs].reduce((acc, el) => {
    acc.push(el.value);
    return acc;
  }, []);
  const [day, month, year] = data;

  // day validation
  if (day === '') {
    updateMsg('day', 'render', msgFieldRequired);
  } else if (day < 1 || day > 31) {
    updateMsg('day', 'render', msgInvalidDay);
  } else {
    updateMsg('day', 'hide', '');
  }

  // month validation
  if (month === '') {
    updateMsg('month', 'render', msgFieldRequired);
  } else if (month < 1 || month > 12) {
    updateMsg('month', 'render', msgInvalidMonth);
  } else {
    updateMsg('month', 'hide', '');
  }

  // year validation
  if (year === '') {
    updateMsg('year', 'render', msgFieldRequired);
  } else if (year > currYear || year < 1900) {
    updateMsg('year', 'render', msgInvalidYear);
  } else {
    updateMsg('year', 'hide', '');
  }

  // check if the date exists for the specified month
  const isDayCorrect = new Date(year, month - 1, day).getMonth() + 1 === +month;
  const allValid = [...inputBoxes].some(el => el.classList.contains(redText));
  if (!isDayCorrect && !allValid) {
    updateMsg('day', 'render', msgInvalidDay);
    updateMsg('month', 'render', '');
    updateMsg('year', 'render', '');
    return;
  }

  // one more validation
  if (allValid) return;

  // calculate user's Data
  const userBirthdate = new Date(year, month - 1, day);

  let yearsDiff = currYear - userBirthdate.getFullYear();
  let monthsDiff = currMonth - userBirthdate.getMonth();
  let daysDiff = currDay - userBirthdate.getDate();

  // Adjust the month and year if needed
  if (monthsDiff < 0) {
    yearsDiff -= 1;
    monthsDiff += 12;
  }

  // Adjust the days and month if needed
  if (daysDiff < 0) {
    monthsDiff -= 1;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    daysDiff += lastMonth.getDate();
  }

  // If months were adjusted and became negative, adjust the year and month again
  if (monthsDiff < 0) {
    yearsDiff -= 1;
    monthsDiff += 12;
  }

  // Display data on the UI | yearsDiff, monthsDiff, daysDiff
  const duration = 1000; // milliseconds
  const yearsStepTime = duration / yearsDiff;
  const monthsStepTime = duration / monthsDiff;
  const daysStepTime = duration / daysDiff;

  outputEls.forEach((el, _, els) => {
    el.textContent = 0;

    if (el.dataset.type === 'years') {
      el.textContent = el.textContent.padStart(2, '0');
      if (+el.textContent === yearsDiff) return;

      const yearsInterval = setInterval(() => {
        el.textContent = +el.textContent + 1;
        el.textContent = el.textContent.padStart(2, '0');

        if (+el.textContent === yearsDiff) clearInterval(yearsInterval);
      }, yearsStepTime);
    }

    if (el.dataset.type === 'months') {
      el.textContent = el.textContent.padStart(2, '0');
      if (+el.textContent === monthsDiff) return;

      const monthsInterval = setInterval(() => {
        el.textContent = +el.textContent + 1;
        el.textContent = el.textContent.padStart(2, '0');

        if (+el.textContent === monthsDiff) clearInterval(monthsInterval);
      }, monthsStepTime);
    }

    if (el.dataset.type === 'days') {
      el.textContent = el.textContent.padStart(2, '0');
      if (+el.textContent === daysDiff) return;

      const daysInterval = setInterval(() => {
        el.textContent = +el.textContent + 1;
        el.textContent = el.textContent.padStart(2, '0');

        if (+el.textContent === daysDiff) clearInterval(daysInterval);
      }, daysStepTime);
    }

    // extra animation at the end
    setTimeout(() => {
      els.forEach(el => {
        setTimeout(() => el.classList.add('output__number--finish'), 150);
        setTimeout(() => el.classList.remove('output__number--finish'), 500);
      });
    }, duration + 50);
  });
});
