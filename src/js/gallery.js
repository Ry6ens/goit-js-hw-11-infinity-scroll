import { PixabayAPI } from './photo-api';
import Notiflix from 'notiflix';
import createGalleryCards from '../templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
// const loadMoreBtnEl = document.querySelector('.load-more');
const targetScroll = document.querySelector('.target-element');

const pixabayAPI = new PixabayAPI();

// Notification How many images?
const foundTotalHits = totalHits => {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
};

//Load more pages by scroll down
const loadMoreData = async event => {
  pixabayAPI.page += 1;

  try {
    const response = await pixabayAPI.fetchPhotos();
    const totalHits = response.data.totalHits;

    pixabayAPI.totalHits = totalHits;

    // if (pixabayAPI.page * pixabayAPI.per_page > pixabayAPI.totalHits) {
    //   console.log('yes');
    //   Notiflix.Notify.failure(
    //     'We are sorry, but you have reached the end of search results.'
    //   );
    // }

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
      console.log('yes');
    }
  },
  {
    root: null,
    rootMargin: '400px',
    threshold: 1,
  }
);
console.log(observer);

//Search items by SUBMIT
const onSearchFormSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  pixabayAPI.query = searchQuery.value;

  try {
    const response = await pixabayAPI.fetchPhotos();
    const totalHits = response.data.totalHits;

    // pixabayAPI.totalHits = totalHits;

    if (response.data.hits.length === 0) {
      galleryEl.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      // loadMoreBtnEl.classList.add('is-hidden');
      return;
    }

    // if (pixabayAPI.page * pixabayAPI.per_page > pixabayAPI.totalHits) {
    //   loadMoreBtnEl.classList.add('is-hidden');
    // } else {
    //   loadMoreBtnEl.classList.remove('is-hidden');
    // }

    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth',
    // });

    galleryEl.innerHTML = createGalleryCards(response.data.hits);

    gallery.refresh();

    observer.observe(targetScroll);

    //Notification  How many images?
    foundTotalHits(totalHits);
  } catch {
    Notiflix.Notify.failure(err);
  }
};

// LOAD MORE IMAGES by Button
// const onLoadMoreBtnClick = async event => {
//   pixabayAPI.page += 1;

//   try {
//     pixabayAPI.fetchPhotos().then(response => {
//       if (pixabayAPI.page * pixabayAPI.per_page > pixabayAPI.totalHits) {
//         loadMoreBtnEl.classList.add('is-hidden');
//         console.log('yes');
//         Notiflix.Notify.failure(
//           'We are sorry, but you have reached the end of search results.'
//         );
//       }

//       galleryEl.insertAdjacentHTML(
//         'beforeend',
//         createGalleryCards(response.data.hits)
//       );
//       gallery.refresh();
//     });
//   } catch {
//     Notiflix.Notify.failure(err);
//   }
// };

//SimpleLightBox
const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

galleryForm.addEventListener('submit', onSearchFormSubmit);
// loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
