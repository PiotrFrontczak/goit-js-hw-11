document.addEventListener("DOMContentLoaded",(function(){var e,t=document.getElementById("search-form"),a=document.querySelector(".gallery"),n=document.querySelector(".load-more"),r=1;function o(t){var o="https://pixabay.com/api/?key=".concat("43689937-ac603d3a8790355bd35895aa3","&q=").concat(t,"&image_type=photo&orientation=horizontal&safesearch=true&page=").concat(r,"&per_page=40");fetch(o).then((function(e){if(!e.ok)throw new Error("Network response was not ok");return e.json()})).then((function(t){0!==t.hits.length?(t.hits.forEach((function(e){var t=function(e){var t=document.createElement("div");t.classList.add("photo-card");var a=document.createElement("a");a.href=e.largeImageURL;var n=document.createElement("img");return n.src=e.webformatURL,n.alt=e.tags,n.loading="lazy",a.appendChild(n),t.appendChild(a),t}(e);a.appendChild(t)})),t.totalHits>a.children.length?n.style.display="block":n.style.display="none",e?e.refresh():e=new SimpleLightbox(".gallery a",{})):Notiflix.Notify.Failure("Sorry, there are no images matching your search query. Please try again.")})).catch((function(e){console.error("There was a problem with the fetch operation:",e)}))}t.addEventListener("submit",(function(e){e.preventDefault();var n=t.searchQuery.value.trim();""!==n&&(a.innerHTML="",o(n))})),n.addEventListener("click",(function(){r++,o(t.searchQuery.value.trim())}))}));
//# sourceMappingURL=index.2d4c74d4.js.map
