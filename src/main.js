import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const apiKey = "41526510-fe2a9843669a4013cb75574c6";
const apiUrl = "https://pixabay.com/api/";
const gallery = document.querySelector(".gallery");
const searchForm = document.querySelector(".search-form");
const loader = document.querySelector(".loader-container");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchQuery = document.querySelector(".search-query").value;
    searchImages(searchQuery);
});

function searchImages(query) {
    loader.style.display = "flex";

    fetch(`${apiUrl}?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayImages(data.hits);
        })
        .catch(error => {
            showError('An error occurred. Please try again.');
            console.error('Fetch error:', error);
        })
        .finally(() => {
            loader.style.display = "none";
        });
}

function displayImages(images) {
    gallery.innerHTML = "";
    if (images.length === 0) {
        showError("Sorry, there are no images matching your search query. Please try again!");
        return;
    }

    images.forEach(function (image) {
        const card = document.createElement("div");
        card.classList.add("image-card");
        card.innerHTML = `
            <a href="${image.largeImageURL}" data-lightbox="gallery">
                <img src="${image.webformatURL}" alt="${image.tags}">
            </a>
            <div class="image-info">
                <p>Likes: ${image.likes}</p>
                <p>Views: ${image.views}</p>
                <p>Comments: ${image.comments}</p>
                <p>Downloads: ${image.downloads}</p>
            </div>
        `;
        gallery.appendChild(card);
    });
    const lightbox = new SimpleLightbox('.image-card a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
    });
    lightbox.refresh();
}

function showError(message) {
    iziToast.error({
        title: 'Error',
        message: message || 'An error occurred. Please try again.',
    });
}