// js/main.js
import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader } from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Селектори
const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');

form.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();

  const query = input.value.trim();

  // Перевірка на порожній рядок перед запитом
  if (!query) {
    iziToast.error({
      title: 'Warning',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  // Починаємо пошук: показати лоадер, очистити галерею
  showLoader();
  clearGallery();

  // Використання then/catch згідно з ТЗ
  getImagesByQuery(query)
    .then(data => {
      // data — об'єкт відповіді (має властивість hits — масив зображень)
      const images = data.hits;

      if (!Array.isArray(images) || images.length === 0) {
        iziToast.error({
          title: '',
          message: 'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      // Якщо є результати — створюємо галерею
      createGallery(images);

      iziToast.success({
        title: '',
        message: `Found ${data.totalHits ?? images.length} images.`,
        position: 'topRight',
      });
    })
    .catch(error => {
      // Обробка помилок запиту
      console.error('Pixabay API error:', error);
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong while fetching images. Please try again later.',
        position: 'topRight',
      });
    })
    .finally(() => {
      // Скрити лоадер в будь-якому випадку
      hideLoader();
    });
}