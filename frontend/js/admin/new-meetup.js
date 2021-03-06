/* eslint-disable */

const topicField = document.getElementById('m-topic');
const locationField = document.getElementById('m-location');
const dateField = document.getElementById('m-date');
const tagsField = document.getElementById('m-tags');

const addressField = document.getElementById('mAddress');
const cityField = document.getElementById('mCity');
const stateField = document.getElementById('mState');
const countryField = document.getElementById('mCountry');

const createButton = document.querySelector('.progress-button > button');

/**
 * @func getAllCountries
 * @returns {Promise<Array>} Resolves
 * to an array of array of promises
 */
const getAllCountries = () => {
  const apiURL = 'https://restcountries-v1.p.rapidapi.com/all';
  return fetch(apiURL, {
    headers: {
      'X-RapidAPI-Key': 'm3xBJzCDi0mshlFG6gTOfdrrU5h3p16dIgIjsngT7YwCyj5VmL',
    }
  })
    .then(res => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    })
}

/**
 * @func lookUpIP
 * @returns {*} Location object from http://ip-api.com
 */
const lookUpIP = () => {
  return fetch('http://ip-api.com/json')
    .then(res => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      
    })
}

/**
 * @func flatten
 * @param {Array} array A multi-dimensional array
 * @returns {Array} Flattens `array` to a single-dimensional array
 */
const flatten = (array) => array.reduce((prev, curr) => prev.concat(curr), []);

/**
 * @func createCountrySelectOptions
 * @description Creates form options field
 * and populate with country details
 */
const createCountrySelectOptions = () => {
  Promise.all([getAllCountries(), lookUpIP()])
    .then((values) => {
      const [countries, location] = values;
      const allCountries = flatten(countries);
      const currentUserCountry = location.country;
      allCountries.forEach((country) => {
        const option = document.createElement('option');
        option.textContent = country.name;
        option.value = country.name;
        option.selected = currentUserCountry === country.name;
        countryField.appendChild(option);
      });
    })
    .catch((err) => {
      throw err;
    })
}

createCountrySelectOptions();

const geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 10000
};

const geoErrorCallback = () => {

}

lookUpIP();

const geoSuccessCallback = (position) => {
  const { latitude, longitude } = position.coords;
}

const geolocationSupported = 'geolocation' in navigator;

const getUserLocation = () => {
  if (geolocationSupported) {
    Promise.all([lookUpIP(), getAllCountries()])
      .then((results) => {
        const [ipResult, countries] = results;
        const allCountries = flatten(countries);
        const { country } = ipResult;
        const selectedCountry = allCountries.filter((c) => c.name === country)[0];
        countryField.setAttribute('selected', selectedCountry.name);
      })

  } else {
    // geo location feature not supported in
    // this browser
  }
}

const watchUserLocation = () => {
  if (geolocationSupported) {
    navigator.geolocation.watchPosition(geoSuccessCallback)
  }
}

getUserLocation();

// Image preview
const imgUpload = document.querySelector('.q-form__image-upload');
const imgBlock = document.querySelector('.outer-upload__block');
const imgUploadBtns = document.querySelector('.image-upload-btns');
const cancelUploadBtn = document.querySelector('.img-upload-cancel__btn');
const imageUploadWrapper = document.querySelector('.image-upload__wrapper');
const userFeedback = document.querySelector('.feedback');

/**
 * @func createImageUploadFormWidget
 * @returns {HTMLElement} Returns the image upload wrapper element
 */
const createImageUploadFormWidget = () => {
  const imageUploadWrapper = document.querySelector('.image-upload__wrapper');
  const outerLabel = document.createElement('label');
  outerLabel.classList.add('q-form__label');
  outerLabel.textContent = 'Upload an image for your meetup';

  const outerUploadBlock = document.createElement('div');
  outerUploadBlock.classList.add('outer-upload__block');
  const fileInput = document.createElement('input');
  fileInput.setAttribute('type', 'file');
  fileInput.setAttribute('name', 'image');
  fileInput.setAttribute('accept', 'image/*');
  fileInput.classList.add('q-form__image-upload');
  fileInput.setAttribute('id', 'm-images');
  fileInput.onchange = loadImagePreview;
  const innerUploadBlock = document.createElement('div');
  innerUploadBlock.classList.add('inner-upload__block');

  innerUploadBlock.onclick = () => {
    // This is meant to increase
    // surface area for better user
    // clicks on the image upload area
    fileInput.click();
  }
  const innerLabel = document.createElement('label');
  innerLabel.classList.add('q-form__label');
  innerLabel.textContent = 'Upload an Image';

  innerUploadBlock.appendChild(innerLabel);

  imageUploadWrapper.innerHTML = '';

  outerUploadBlock.appendChild(fileInput);
  outerUploadBlock.appendChild(innerUploadBlock);

  imageUploadWrapper.appendChild(outerLabel);
  imageUploadWrapper.appendChild(outerUploadBlock);

  return imageUploadWrapper;
}

cancelUploadBtn.onclick = () => {
  createImageUploadFormWidget();
}

const createForm = document.querySelector('form');

/**
 * 
 * @param {String} msg 
 * @returns {HTMLDivElement} The HTML element wrapping the
 * user action feedback
 */
const createFeedbackAlert = (msg) => {
  const displayBox = document.createElement('div');
  displayBox.textContent = msg;
  displayBox.classList.add('alert-box');
  return displayBox;
}

/**
 * @func displayFeedbackAlert
 * @param {String} msg 
 * @returns {HTMLDivElement} Appends the feedback HTML element
 * and returns it
 */
const displayFeedbackAlert = (msg) => {
  return document.body.appendChild(createFeedbackAlert(msg));
}

const requestFeedback = document.getElementById('new-meetup-request-feedback');
const requestFeedbackText = document.getElementById('new -meetup-request-feedback-text');

/**
 * @func addFeedbackMessage
 * @param {String} message
 * @param {String} feedbackType
 * @returns {HTMLElement} Adds error/success classes
 * to feedback element, according to `feedbackType`
 */
const addFeedbackMessage = (message, feedbackType = 'error') => {
  const feedbackClassName = feedbackType === 'error' ? 'm-request-feedback__error' : 'm-request-feedback__success';
  requestFeedbackText.textContent = message;
  requestFeedbackText.classList.add('request-feedback__text');
  requestFeedback.classList.add(feedbackClassName);
  return requestFeedback;
}

/**
 * @func displayFeedback
 * @param {String} message
 * @param {String} feedbackType 
 * @returns {HTMLElement} 
 * @description Displays the feedback pop-up
 */
const displayFeedback = (message, feedbackType) => {
  const requestFeedback = addFeedbackMessage(message, feedbackType);
  requestFeedback.classList.remove('m-request-feedback--hidden');
  requestFeedback.classList.add('m-request-feedback--shown');
  return requestFeedback;
}

/**
 * @func hideFeedback
 * @param {Number} secs 
 * @return {Number} Timer Interval
 * @description Hides the feedback pop-up
 */
const hideFeedback = (secs) => {
  return setTimeout(() => {
    requestFeedback.classList.remove('m-request-feedback--shown');
    requestFeedback.classList.add('m-request-feedback--hidden');
  }, secs * 1000);
};

/**
 * @func loadImagePreview
 * @param {Event} e 
 * @returns {undefined}
 * @description Shows a preview of the selected meetup image
 */
const loadImagePreview = (e) => {
  const uploadedImg = document.createElement('img');
  const imgBlock = document.querySelector('.outer-upload__block');
  uploadedImg.classList.add('upload-image-preview');
  const file = e.target.files[0];
  uploadedImg.file = file;
  uploadedImg.id = 'm-images';
  imgBlock.innerHTML = '';
  imgBlock.appendChild(uploadedImg);
  imgUploadBtns.classList.add('image-upload-btns-show');
  imageUploadWrapper.appendChild(imgUploadBtns);

  const reader = new FileReader();
  reader.onload = ((aImg) =>
    (e) => {
      aImg.src = e.target.result;
    })(uploadedImg);
  reader.readAsDataURL(file);
}

/**
 * @func formMeetupLocation
 * @returns {String} Returns a meetup location
 * By concatenating all location parts to
 * form a whole
 */
const formMeetupLocation = () => {
  const address = addressField.value;
  const city = cityField.value;
  const state = stateField.value;
  const country = countryField.value;

  const location = `${address} ${city} ${state} ${country}`;
  return location;
}

const enableButtonSpinner = (button, spinnerClass) => {
  button.classList.add(spinnerClass);
  return button;
}

const disableButtonSpinner = (button, spinnerClass) => {
  button.classList.remove(spinnerClass);
  return button;
}

/**
 * @func createMeetup
 * @returns {undefined} 
 * @description Creates a meetup
 */
const createMeetup = () => {
  const imagesField = document.getElementById('m-images');
  const topic = topicField.value;
  const location = formMeetupLocation();
  const happeningOn = dateField.value;
  const tags = tagsField.value.split(',');
  const image = imagesField.file;

  const data = {
    topic,
    location,
    happeningOn,
    tags,
    image
  };

  const formData = new FormData();

  for (const prop in data) {
    formData.append(prop, data[prop]);
  }

  enableButtonSpinner(createButton, 'spinner');

  fetch(`${apiBaseURL}/meetups`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${Token.getToken('userToken')}`
    },
    body: formData
  })
    .then(res => res.json())
    .then((res) => {
      const { status, data, error } = res;
      if (status === 201) {
        disableButtonSpinner(createButton, 'spinner');
        displayFeedback(`${data[0].topic} meetup was successfully created`, 'success');
        setTimeout(() => {
          window.location.assign('./meetups.html');
        }, 5000);
      } else {
        disableButtonSpinner(createButton, 'spinner');
        displayFeedback(error, 'error');
        hideFeedback(10);
      }
    })
    .catch((err) => {
      disableButtonSpinner(createButton, 'spinner');
    })
};

createForm.onsubmit = (e) => {
  e.preventDefault();
  createMeetup();
};

addProfileAvatarToNav('../../assets/icons/avatar1.svg');

window.onload = () => {
  if (!userAuthToken) {
    window.location.replace('./sign-in.html');
  }
  createImageUploadFormWidget();
}
