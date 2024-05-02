document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const gallery = document.querySelector('.gallery');
    const loadMoreBtn = document.querySelector('.load-more');
    let page = 1;
    let lightbox; 

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const searchQuery = form.searchQuery.value.trim(); 
        if (searchQuery === '') return; 

        gallery.innerHTML = '';

        try {
            await searchImages(searchQuery); 
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    });

    async function searchImages(searchQuery) {
        const apiKey = '43689937-ac603d3a8790355bd35895aa3';

        const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;

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
        } catch (error) {
            throw new Error('There was a problem with the fetch operation:', error);
        }
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

        const info = document.createElement('div');
        info.classList.add('info');

        const likes = document.createElement('p');
        likes.classList.add('info-item');
        likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

        const views = document.createElement('p');
        views.classList.add('info-item');
        views.innerHTML = `<b>Views:</b> ${image.views}`;

        const comments = document.createElement('p');
        comments.classList.add('info-item');
        comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

        const downloads = document.createElement('p');
        downloads.classList.add('info-item');
        downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

        info.appendChild(likes);
        info.appendChild(views);
        info.appendChild(comments);
        info.appendChild(downloads);

        link.appendChild(img);
        photoCard.appendChild(link);
        photoCard.appendChild(info);

        return photoCard;
    }

    loadMoreBtn.addEventListener('click', function () {
        page++;
        const searchQuery = form.searchQuery.value.trim(); 
        searchImages(searchQuery);
    });
});