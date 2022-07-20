import { PixabayAPI } from './photo-api';
import Notiflix from 'notiflix';
import createGalleryCards from '../templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

//Notification more 500 images
const foundTotalHits = totalHits => {
  if (totalHits >= 500) {
    Notiflix.Notify.success('Hooray! We found totalHits images.');
  }
};

const onSearchFormSubmit = event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  pixabayAPI.query = searchQuery.value;

  pixabayAPI
    .fetchPhotos()
    .then(response => {
      console.log(response.data);
      const totalHits = response.data.totalHits;

      if (response.data.hits.length === 0) {
        galleryEl.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      } else if (response.data.hits.length < 40) {
        galleryEl.innerHTML = createGalleryCards(response.data.hits);
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }

      galleryEl.innerHTML = createGalleryCards(response.data.hits);

      loadMoreBtnEl.classList.remove('is-hidden');

      gallery.refresh();

      //Notification more 500 images
      foundTotalHits(totalHits);
    })

    .catch(err => {
      Notiflix.Notify.failure(err);
    });
};

const onLoadMoreBtnClick = event => {
  pixabayAPI.page += 1;

  pixabayAPI
    .fetchPhotos()
    .then(response => {
      if (response.data.hits.length < 40) {
        loadMoreBtnEl.classList.add('is-hidden');
      }

      galleryEl.insertAdjacentHTML(
        'beforeend',
        createGalleryCards(response.data.hits)
      );
      gallery.refresh();
    })
    .catch(err => {
      Notiflix.Notify.failure(err);
    });
};

const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

galleryForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
