import { PixabayAPI } from './photo-api';
import Notiflix from 'notiflix';
import createGalleryCards from '../templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const targetScroll = document.querySelector('.target-element');

const pixabayAPI = new PixabayAPI();
// console.log(pixabayAPI);

// Notification How many images?
const foundTotalHits = totalHits => {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
};

//Load more pages by scroll down
const loadMoreData = async event => {
  pixabayAPI.page += 1;

  try {
    const response = await pixabayAPI.fetchPhotos();

    if (response.data.hits.length === 0) {
      console.log('unobserve');
      observer.unobserve(targetScroll);
      return;
    }

    galleryEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(response.data.hits)
    );
    gallery.refresh();
  } catch {
    Notiflix.Notify.failure(err);
  }
};

//Infinity scroll
const observer = new IntersectionObserver(
  (entries, observer) => {
    if (entries[0].isIntersecting) {
      loadMoreData();
    }
  },
  {
    root: null,
    rootMargin: '400px',
    threshold: 1,
  }
);

//Search items by SUBMIT
const onSearchFormSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  pixabayAPI.query = searchQuery.value;

  try {
    pixabayAPI.page = 1;

    const response = await pixabayAPI.fetchPhotos();
    const totalHits = response.data.totalHits;

    console.log(response.data);

    if (response.data.hits.length === 0) {
      galleryEl.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    window.scrollTo({
      top: 0,
      // behavior: 'smooth',
    });

    galleryEl.innerHTML = createGalleryCards(response.data.hits);

    gallery.refresh();

    observer.observe(targetScroll);

    //Notification  How many images?
    foundTotalHits(totalHits);
  } catch {
    Notiflix.Notify.failure(err);
  }
};

//SimpleLightBox
const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

galleryForm.addEventListener('submit', onSearchFormSubmit);
