document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const gallery = document.querySelector('.gallery');
    const loadMoreBtn = document.querySelector('.load-more');
    let page = 1; // początkowa wartość strony
    let lightbox; // zmienna przechowująca instancję SimpleLightbox

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Zapobiegamy domyślnej akcji formularza

        const searchQuery = form.searchQuery.value.trim(); // Pobieramy wartość z pola wyszukiwania
        if (searchQuery === '') return; // Sprawdzamy, czy pole wyszukiwania nie jest puste

        // Resetujemy galerię przy każdym nowym wyszukiwaniu
        gallery.innerHTML = '';

        searchImages(searchQuery); // Wywołujemy funkcję wyszukiwania obrazków
    });

    function searchImages(searchQuery) {
        const apiKey = '43689937-ac603d3a8790355bd35895aa3'; // Twój unikalny klucz dostępu do API Pixabay

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
                    // Wyświetlamy powiadomienie, jeśli nie znaleziono obrazków
                    Notiflix.Notify.Failure("Sorry, there are no images matching your search query. Please try again.");
                    return;
                }

                data.hits.forEach(image => {
                    const photoCard = createPhotoCard(image); // Tworzymy kartę obrazka
                    gallery.appendChild(photoCard); // Dodajemy kartę do galerii
                });

                // Wyświetlamy przycisk "Load more" jeśli jest więcej wyników
                if (data.totalHits > gallery.children.length) {
                    loadMoreBtn.style.display = 'block';
                } else {
                    // Ukrywamy przycisk jeśli nie ma więcej wyników
                    loadMoreBtn.style.display = 'none';
                }

                // Inicjalizacja lub odświeżenie SimpleLightbox po dodaniu nowych obrazków
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

    // Obsługa przycisku "Load more"
    loadMoreBtn.addEventListener('click', function () {
        page++; // Zwiększamy numer strony
        const searchQuery = form.searchQuery.value.trim(); // Pobieramy aktualny termin wyszukiwania
        searchImages(searchQuery); // Wywołujemy ponownie funkcję wyszukiwania obrazków
    });
});
