/* eslint-disable */
const apiBaseURL = 'http://localhost:9999/api/v1';

const detailsWrapper = document.querySelector('.details-content');
const meetupTitleHost = document.querySelector('.meetup-title-host');
const meetupTitle = document.querySelector('.meetup-title-host h3');
const meetupOrganizer = document.querySelector('.meetup-title-host p');
const activeMeetupId = localStorage.getItem('activeMeetupId');
const imagePreviewWrapper = document.querySelector('.image-preview');
const imagePreview = document.querySelector('.image-preview img');
const photosWrapper = document.querySelector('.meetup-photos__wrapper');
const rsvpEnquiryWrapper = document.querySelector('.meetup-rsvp__enquiry');

const meetupTagsWrapper = document.getElementById('meetup-tags');
const addedMeetups = document.querySelector('.meetup-tags-added');

// Question cards
const questionCards = document.querySelector('.q-question-cards');

const questionCardIcons = {
  left: [
    {
      id: 1,
      src: '../assets/icons/thumbs-up.svg',
      alt: 'A thumb pointing upwards giving an approval',
      title: 'Upvote Question'
    },

    {
      id: 2,
      src: '../assets/icons/thumbs-down.svg',
      alt: 'A thumb pointing downwards giving a disapproval',
      title: 'Downvote Question'
    },
  ],

  right: [
    {
      id: 3,
      src: '../assets/icons/share.svg',
      alt: 'A black curved arrow pointing east',
      title: 'Share'
    },

    {
      id: 4,
      src: '../assets/icons/like.svg',
      alt: 'A red heart shape',
      title: 'Favorite'
    }
  ]
};


// TODO: Refactor
const createQuestionCard = (question) => {
  const card = document.createElement('div');
  card.classList.add('question-card');
  const questionBlock = document.createElement('div');
  questionBlock.classList.add('question-block');
  const questionTextBlock = document.createElement('div');
  questionTextBlock.classList.add('question-text-block');
  const questionText = document.createElement('div');
  questionText.classList.add('question-text');
  const p = document.createElement('p');
  p.textContent = question.body;

  // To be replaced with dynamic content
  const askedBy = document.createElement('span');
  askedBy.classList.add('asked-by')
  askedBy.textContent = 'asked by X';
  const askedWhen = document.createElement('span');
  askedWhen.classList.add('asked-when');
  askedWhen.textContent = '';

  // Question icons
  const questionIcons = document.createElement('div');
  questionIcons.classList.add('question-icons');

  const leftIcons = document.createElement('div');
  leftIcons.classList.add('question-icons__left');

  questionCardIcons.left.forEach((icon) => {
    const img = document.createElement('img');
    img.src = icon.src;
    img.alt = icon.alt;
    img.title = icon.title;
    img.setAttribute('data-target', icon.id);
    leftIcons.appendChild(img);
  });

  const rightIcons = document.createElement('div');
  rightIcons.classList.add('question-icons__right');

  questionCardIcons.right.forEach((icon) => {
    const img = document.createElement('img');
    img.src = icon.src;
    img.alt = icon.alt;
    img.title = icon.title;
    img.setAttribute('data-target', icon.id);
    rightIcons.appendChild(img);
  });

  questionIcons.appendChild(leftIcons);
  questionIcons.appendChild(rightIcons);

  questionText.appendChild(p);
  questionText.appendChild(askedBy);
  questionText.appendChild(askedWhen);

  questionTextBlock.appendChild(questionText);
  questionTextBlock.appendChild(questionIcons);

  questionBlock.appendChild(questionTextBlock);
  card.appendChild(questionBlock);

  return card;
}

const getMeetupTags = async () => {
  const activeMeetupId = localStorage.getItem('activeMeetupId');
  const response = await fetch(`${apiBaseURL}/meetups/${activeMeetupId}`, genericRequestHeader);
  const responseBody = await response.json();
  console.log(responseBody)
  return responseBody.data[0].tags;
}

const createMeetupTags = (tags) => {
  return tags.map((tag) => {
    const meetupTag = document.createElement('li');
    meetupTag.classList.add('meetup-tag');
    meetupTag.textContent = tag;
    return meetupTag;
  })
}

const displayMeetupTags = async () => {
  const meetupTags = await getMeetupTags();
  const meetupTagElems = createMeetupTags(meetupTags);
  const meetupList = document.createElement('ul');
  meetupTagElems.forEach((item) => {
    meetupList.appendChild(item);
  });

  addedMeetups.appendChild(meetupList);
  meetupTagsWrapper.appendChild(addedMeetups);
}

const displayMeetupQuestions = async (meetup) => {
  try {
    const activeMeetupId = localStorage.getItem('activeMeetupId');
    const apiUrl = `${apiBaseURL}/meetups/${activeMeetupId}/questions`;
    const response = await fetch(apiUrl, genericRequestHeader);
    const responseBody = await response.json();
    if (responseBody.status === 200) {
      const questions = responseBody.data;
      questions.forEach((question) => {
        questionCards.appendChild(createQuestionCard(question));
      })
    }
  } catch(e) {
    console.log(e);
  }
}

const addMeetupDetailsToDOM = (meetup) => {
  meetupTitle.textContent = meetup.topic;
  meetupOrganizer.textContent = 'Organized by X';
  meetupTitleHost.appendChild(meetupTitle);
  meetupTitleHost.appendChild(meetupOrganizer);
  return meetupTitleHost;
};

const addMeetupDateToDOM = (meetup) => {
  const meetupDate = document.querySelector('.meetup-date__primary');
  const [month, day] = parseDate(meetup.happeningOn);
  meetupDate.textContent = month;
  const lineBreak = document.createElement('p');
  lineBreak.textContent = day;
  meetupDate.appendChild(lineBreak);
  return meetupDate;
}

const genericRequestHeader = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Token.getToken('userToken')}`
  }
};

/**
 * @func getMeetupImages
 * @param {*} meetup
 * @returns {Promise<Array>} Returns a list of meetup images 
 */
const getMeetupImages = async (meetup) => {
  try {
    const url = `${apiBaseURL}/meetups/${meetup.id}/images`;
    const response = await fetch(url, genericRequestHeader);
    const responseBody = await response.json();
    return responseBody.data;
  } catch (e) {

  }
}

/**
 * @func addMeetupImageToPage
 * @param {*} meetup Meetup object
 * @returns {*}
 * @description Places a main meetup image on the page 
 */
const addMeetupImageToPage = async (meetup) => {
  try {
    const meetupImages = await getMeetupImages(meetup);
    const image = meetupImages[0];
    const defaultImage = '../assets/img/showcase2.jpg';
    imagePreview.setAttribute('src', image.imageUrl || defaultImage);
    return imagePreview;
  } catch (e) {

  }
}


/**
 * @func addDescriptionToPage
 * @param {*} meetup Meetup object
 * @description Adds meetup description to page
 * @return {HTMLElement} Returns the meetup description element
 */
const addDescriptionToPage = (meetup) => {
  const meetupDescription = document.querySelector('.meetup-desc');
  meetupDescription.textContent = meetup.description;
  return meetupDescription;
}

/**
 * 
 * @param {Array} images An array of meetup image objects
 * @returns {Array<HTMLElement>} Returns an array of meetups 
 */
const createMeetupImages = (images) => {
  const pics = images.map((image) => {
    const a = document.createElement('a');
    a.href = image.imageUrl;
    const img = document.createElement('img');
    img.src = image.imageUrl;
    img.alt = '';
    a.appendChild(img);
    return a;
  });

  return pics;
}


/**
 * @func addMeetupImagesToPage
 * @param {*} meetup Meetup object 
 * @description Adds meetup images to page
 */
const addMeetupImagesToPage = async (meetup) => {
  try {
    const meetupImages = await getMeetupImages(meetup);
    const allImages = createMeetupImages(meetupImages);
    allImages.forEach((image) => {
      photosWrapper.appendChild(image);
    });
  } catch (e) {

  }
};

/**
 * @func getMeetupRsvps
 * @param {*} meetup Meetup object
 * @returns {Array} An Array of rsvps for `meetup` 
 */
const getMeetupRsvps = async (meetup) => {
  try {
    const apiUrl = `${apiBaseURL}/meetups/${meetup.id}/rsvps`;
    const response = await fetch(apiUrl, genericRequestHeader);
    const responseBody = await response.json();
    return responseBody.data;
  } catch (e) {

  }
}

/**
 * @func getUserRsvp
 * @param {*} meetup
 * @returns {Promise} Resolves to a Meetup Rsvp object
 */
const getUserRsvp = async (meetup) => {
  const rsvps = await getMeetupRsvps(meetup);
  const userId = localStorage.getItem('userId');
  const userRsvp = rsvps.find((rsvp) => {
    return rsvp.user === Number(userId);
  });

  return userRsvp;
}

/**
 * @func userHasRsvped
 * @param {*} meetup Meetup object
 * @returns {Promise<Boolean>} Resolve to true if user has rsvped for `meetup`, false otherwise
 */
const userHasRsvped = async (meetup) => {
  const userRsvp = await getUserRsvp(meetup);
  return userRsvp !== undefined;
}

/**
 * @param {String} response
 * @returns {String} Rsvp feedback message
 */
const formRsvpFeedbackMsg = (response) => {
  let feedbackMessage = '';
  if (response === 'yes') {
    feedbackMessage = 'You are going to this meetup'
  } else if (response === 'no') {
    feedbackMessage = 'You are not going to this meetup';
  } else {
    feedbackMessage = 'You are likely to attend this meetup'
  }

  return feedbackMessage;
}

const rsvpBtnSpecs = [
  {
    id: 1,
    text: 'yes'
  },

  {
    id: 2,
    text: 'maybe'
  },

  {
    id: 3,
    text: 'no'
  }
];

const rsvpForMeetup = async (userResponse) => {
  const meetupId = localStorage.getItem('activeMeetupId');
  const apiUrl = `${apiBaseURL}/meetups/${meetupId}/rsvps`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token.getToken('userToken')}`
    },
    body: JSON.stringify({ response: userResponse })
  });
  const responseBody = await response.json();
  return responseBody.data;
}

const updateRsvpResponse = () => {

}


const createRsvpButtons = () => {
  const rsvpButtons = rsvpBtnSpecs.map((spec) => {
    const button = document.createElement('button');
    button.classList.add('q-btn');
    button.classList.add('rsvp-btn');
    button.textContent = spec.text;
    button.setAttribute('data-target', spec.id);
    button.onclick = () => rsvpForMeetup(spec.text);
    return button;
  })

  return rsvpButtons;
}

const displayRsvpBtns = () => {
  const rsvpButtons = createRsvpButtons();
  const p = document.createElement('p');
  p.textContent = 'Will you attend this meetup?';
  const btnsWrapper = document.createElement('div');
  btnsWrapper.classList.add('meetup-sched__btns');
  rsvpButtons.forEach((rsvpButton) => {
    btnsWrapper.appendChild(rsvpButton);
  });
  rsvpEnquiryWrapper.innerHTML = '';
  rsvpEnquiryWrapper.appendChild(p);
  rsvpEnquiryWrapper.appendChild(btnsWrapper);
  return rsvpEnquiryWrapper;
}

/**
 * 
 * @param {*} meetup Meetup object
 * @returns {Promise<Element>} Resolves to an HTMLElement
 * @description Adds An RSVP feedback to page
 */
const displayRsvpFeedbackMsg = async (meetup) => {
  const rsvpForMeetupExist = await userHasRsvped(meetup);
  if (rsvpForMeetupExist) {
    const userRsvp = await getUserRsvp(meetup);
    const userResponse = userRsvp.response;
    const feedbackMessage = formRsvpFeedbackMsg(userResponse);

    rsvpEnquiryWrapper.innerHTML = '';
    const text = document.createTextNode(feedbackMessage);
    const p = document.createElement('p');
    p.classList.add('user-rsvp-feedback-msg');
    p.appendChild(text);
    const responseUpdateBtn = document.createElement('button');
    responseUpdateBtn.onclick = () => displayRsvpBtns();
    responseUpdateBtn.classList.add('q-btn');
    responseUpdateBtn.textContent = 'Change Response';

    rsvpEnquiryWrapper.appendChild(p);
    rsvpEnquiryWrapper.appendChild(responseUpdateBtn);
  } else {
    displayRsvpBtns();
  }

  return rsvpEnquiryWrapper;
}



/**
 * @func addMeetupToPage
 * @param {*} meetup Meetup object
 * @description Adds Meetup Details sections to page 
 */
const addMeetupToPage = (meetup) => {
  detailsWrapper.appendChild(addMeetupDetailsToDOM(meetup));
  addMeetupDateToDOM(meetup);
  addMeetupImageToPage(meetup);
  addMeetupImagesToPage(meetup);
  displayRsvpFeedbackMsg(meetup);
  addDescriptionToPage(meetup);

  displayMeetupQuestions(meetup);
  displayMeetupTags();
}
/**
 * @func displayMeetup
 * @returns {*}
 * @description Displays the meetup details on page
 */
const displayMeetup = () => {
  const activeMeetupId = localStorage.getItem('activeMeetupId');
  const apiUrl = `${apiBaseURL}/meetups/${activeMeetupId}`
  fetch(apiUrl, genericRequestHeader)
    .then(res => res.json())
    .then((res) => {
      const tokenValid = Token.tokenIsValid(res.status);
      if (tokenValid) {
        if (res.status === 200) {
          addMeetupToPage(res.data[0]);

        }
      } else {
        window.location.assign('./sign-in.html');
      }
    })
    .catch((err) => {
      throw err;
    })
}

window.onload = (e) => {
  const userToken = Token.getToken('userToken');
  if (!userToken) {
    window.location.assign('./sign-in.html');
  } else {
    displayMeetup();
  }
}