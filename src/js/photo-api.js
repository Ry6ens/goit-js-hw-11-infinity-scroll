import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28740696-1bed74622ca80cdeb72d05fb3';

  constructor() {
    this.page = 1;
    this.per_page = 40;
    this.query = null;
    this.totalHits = null;
  }

  fetchPhotos() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        page: this.page,
        per_page: this.per_page,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
  }
}
