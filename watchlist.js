import moviePoster from "./images/no-poster.png";
let myMovies = document.getElementById("my-movies");
let moviesArr = JSON.parse(localStorage.getItem("watchlist")) || [];

console.log(moviesArr);
function rendermovies(Arr) {
  if (!Arr || Arr.length === 0) {
    myMovies.innerHTML = `<div class="empty-watchlist-container">
                                    <h1 class="empty-watchlist-heading">Your watchlist is looking a little empty...</h1>
                                    <div>
                                        <a href="index.html" aria-label="Go back to search and add movies"><img src="icons/plus.png" class="plus-icon" aria-hidden="true"/></a>
                                        <span>Let’s add some movies!</span>
                                    </div>
                                </div>`;
    return;
  }

  const html = Arr.map(
    (movie) => `<article class="card">
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : moviePoster}" 
                              onerror="src='${moviePoster}'; onerror=null;"
                              alt=${movie.Title} />
                        <div class="title-section">
                            <h2>${movie.Title}</h2>
                            <span class="star-baseline"><img src="icons/star.png" class="star-icon" alt="Rating" aria-hidden="true"/></span>
                            <span class="rating"  aria-label="Rated ${movie.imdbRating} stars">${movie.imdbRating}</span>
                        </div>
                        <div class="tags">
                            <p><span class="sr-only">Duration: </span> ${movie.Runtime}</p>
                            <p><span class="sr-only">Genre: </span> ${movie.Genre}</p>
                            <button
                            class="remove-btn"
                            aria-label = "Remove ${movie.Title} from watchlist"
                            data-remove = "${movie.imdbID}"
                            >
                              <img src ="icons/minus.png" class="watchlist-remove" alt="" aria-hidden="true" />
                              <span class="remove-movie-text">Remove</span>
                            </button>
                        </div>
                        <p class="desc">${movie.Plot} </p>
                    </article>`,
  ).join("");
  myMovies.innerHTML = html;
}

function removeMovie(movieId) {
  let updatedMoviesList = moviesArr.filter((item) => item.imdbID !== movieId);

  localStorage.setItem("watchlist", JSON.stringify(updatedMoviesList));

  moviesArr = updatedMoviesList;

  rendermovies(moviesArr);
}

document.addEventListener("click", function (e) {
  const movieId =
    e.target.dataset.remove || e.target.parentElement.dataset.remove;
  if (movieId) {
    removeMovie(movieId);
  }
});

rendermovies(moviesArr);
