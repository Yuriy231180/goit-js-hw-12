import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector('.form');
const imagesGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '41838849-75d2e43a80bdb544c2e4afc3a';

const searchParamsDefault = {
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

let currentPage = 1;
let searchQuery = '';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  close: true,
  enableKeyboard: true,
  docClose: true,
});

const showLoader = state => {
  loader.style.display = state ? 'block' : 'none';
};

const showLoadMoreBtn = state => {
  loadMoreBtn.style.display = state ? 'block' : 'none';
};

const appendImagesToGallery = hits => {
  // const newImages = hits.map(
  //   image =>
  //     `
  //       <li class="gallery-item">
  //         <a href=${image.largeImageURL}>
  //           <img class="gallery-img" src=${image.webformatURL} alt=${image.tags}/>
  //         </a>
  //         <div class="gallery-text-box">
  //           <p>Likes: <span class="text-value">${image.likes}</span></p>
  //           <p>Views: <span class="text-value">${image.views}</span></p>
  //           <p>Comments: <span class="text-value">${image.comments}</span></p>
  //           <p>Downloads: <span class="text-value">${image.downloads}</span></p>
  //         </div>
  //       </li>
  //     `
  // );
  // imagesGallery.innerHTML += newImages.join('');
  // lightbox.refresh();

  const fragment = document.createDocumentFragment();

  hits.forEach(image => {
    const galleryItem = document.createElement('li');
    galleryItem.classList.add('gallery-item');

    const link = document.createElement('a');
    link.href = image.largeImageURL;

    const img = document.createElement('img');
    img.classList.add('gallery-img');
    img.src = image.webformatURL;
    img.alt = image.tags;

    const textBox = document.createElement('div');
    textBox.classList.add('gallery-text-box');
    textBox.innerHTML = `
      <p>Likes: <span class="text-value">${image.likes}</span></p>
      <p>Views: <span class="text-value">${image.views}</span></p>
      <p>Comments: <span class="text-value">${image.comments}</span></p>
      <p>Downloads: <span class="text-value">${image.downloads}</span></p>
    `;

    link.appendChild(img);
    galleryItem.appendChild(link);
    galleryItem.appendChild(textBox);
    fragment.appendChild(galleryItem);
  });

  imagesGallery.appendChild(fragment);
  lightbox.refresh();
};

form.addEventListener('submit', async event => {
  event.preventDefault();
  showLoader(true);

  searchQuery = encodeURIComponent(event.target.elements.search.value.trim());

  if (searchQuery === '') {
    console.error('Please enter a valid search query.');
    return;
  }

  currentPage = 1;

  await getImages(searchQuery, currentPage);
  event.currentTarget.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  showLoadMoreBtn(false);
  currentPage++;
  await getImages(searchQuery, currentPage);
});

const getGalleryCardHeight = () => {
  const firstGalleryCard = document.querySelector('.gallery-item');
  if (firstGalleryCard) {
    const cardHeight = firstGalleryCard.getBoundingClientRect().height;
    return cardHeight;
  }
  return 0;
};

const scrollPageByGalleryCardHeight = () => {
  const cardHeight = getGalleryCardHeight();
  if (cardHeight > 0) {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } else {
    console.warn('Gallery card not found. Sorry, you can`t scroll.');
  }
};

const showEndOfResultsMessage = () => {
  iziToast.info({
    position: 'topRight',
    messageColor: '#FFFFFF',
    backgroundColor: '#36B3D9',
    titleSize: '8px',
    closeOnEscape: true,
    message: "We're sorry, but you've reached the end of search results.",
  });
};

const getImages = async (query, page) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        page: page,
        per_page: searchParamsDefault.per_page,
        key: API_KEY,
      },
    });
    const { hits, totalHits } = response.data;

    // if (hits.length === 0 && page === 1) {
    //   iziToast.error({
    if (!hits || hits.length === 0) {
      if (page === 1) {
        iziToast.error({
          position: 'topRight',
          messageColor: '#FFFFFF',
          backgroundColor: '#EF4040',
          titleSize: '8px',
          closeOnEscape: true,
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
        imagesGallery.innerHTML = '';
        // } else if (hits.length === 0 && page > 1) {
      } else {
        showEndOfResultsMessage();
      }
    } else {
      if (page === 1) {
        imagesGallery.innerHTML = '';
      }
      appendImagesToGallery(hits);

      if (totalHits && imagesGallery.childElementCount >= totalHits) {
        showLoadMoreBtn(false);
        showEndOfResultsMessage();
      } else {
        showLoadMoreBtn(true);
        scrollPageByGalleryCardHeight();
      }
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    showLoader(false);
  }
};
