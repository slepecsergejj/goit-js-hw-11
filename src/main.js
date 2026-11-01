import './css/styles.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const searchInput = form.elements['search-text'];
const submitButton = form.querySelector('button');

form.addEventListener('submit', event => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search word!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  showLoader();
  submitButton.disabled = true;

  getImagesByQuery(query)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
          timeout: 3000,
        });

        return;
      }

      createGallery(data.hits);
    })
    .catch(error => {
      iziToast.error({
        message: 'Something went wrong. Please try again!',
        position: 'topRight',
      });
    })
    .finally(() => {
      hideLoader();
      submitButton.disabled = false;
    });
});
