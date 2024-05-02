document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const gallery = document.querySelector('.gallery');
    const loadMoreBtn = document.querySelector('.load-more');
    let page = 1;
    let lightbox;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchQuery = form.searchQuery.value.trim();
        if (searchQuery === '') return;

        gallery.innerHTML = '';

        searchImages(searchQuery);
    });

    function searchImages(searchQuery) {
        const apiKey = '43689937-ac603d3a8790355bd35895aa3';

        const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.hits.length === 0) {
                    Notiflix.Notify.Failure("Sorry, there are no images matching your search query. Please try again.");
                    return;
                }

                data.hits.forEach(image => {
                    const photoCard = createPhotoCard(image);
                    gallery.appendChild(photoCard); 
                });

                if (data.totalHits > gallery.children.length) {
                    loadMoreBtn.style.display = 'block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }

                if (lightbox) {
                    lightbox.refresh();
                } else {
                    lightbox = new SimpleLightbox('.gallery a', {});
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    function createPhotoCard(image) {
        const photoCard = document.createElement('div');
        photoCard.classList.add('photo-card');

        const link = document.createElement('a');
        link.href = image.largeImageURL;

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        img.loading = 'lazy';

        link.appendChild(img);
        photoCard.appendChild(link);

        return photoCard;
    }

    loadMoreBtn.addEventListener('click', function () {
        page++;
        const searchQuery = form.searchQuery.value.trim();
        searchImages(searchQuery);
    });
});
