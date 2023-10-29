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
let numberPage = 1;
let numberImg = 0;
let inputValue;
const BASE_URL = 'https://pixabay.com/api/';
buttonLoadMore.classList.add('is-hidden');

const cklbckEvent = evt => {
  evt.preventDefault();
  if (inputValue !== input.value) {
    gallery.innerHTML = '';
    numberPage = 1;
    search(input.value);
  }
  inputValue = input.value;
};

searchForm.addEventListener('submit', cklbckEvent);
buttonLoadMore.addEventListener('click', loadMore);

async function search(userSearch) {
  buttonLoadMore.classList.add('is-hidden');
  const parameters = new URLSearchParams({
    key: '40344925-ced1c275c1243101e1d196b12',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    q: userSearch,
    per_page: '40',
    page: numberPage,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${parameters}`);
    console.log(response);
    numberImg += response.data.hits.length;

    if (response.status !== 200) {
      throw new Error(response.status);
    }
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
    numberPage += 1;
    new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: '250ms',
    });
    if (numberPage > 1) {
      buttonLoadMore.classList.remove('is-hidden');
    }
    console.log(numberImg, Number(response.data.totalHits));
    if (numberImg >= Number(response.data.totalHits)) {
      buttonLoadMore.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(
      `Unfortunately, there are no images matching your request. Please try again.`
    );
  }
}
function loadMore() {
  search(inputValue);
}
