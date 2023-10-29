import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const searchForm = document.querySelector('.search-form');
const containerForm = document.querySelector('.container-form');
const input = document.querySelector('.input-element');
const buttonSubmit = document.querySelector('.btn-submit');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';

const cklbckEvent = evt => {
  evt.preventDefault();
  search(input.value);
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: '250ms',
  });
};

searchForm.addEventListener('submit', cklbckEvent);

async function search(userSearch) {
  const parameters = new URLSearchParams({
    key: '40344925-ced1c275c1243101e1d196b12',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    q: userSearch,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${parameters}`);
    console.log(response);
    const result = await response.data.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
  
  <a class="gallery-link" href="${largeImageURL}">
  <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /> 
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
  </div></a>
`;
        }
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', result);
  } catch (error) {
    Notiflix.Notify.failure(
      `Unfortunately, there are no images matching your request. Please try again.`
    );
  }
}
