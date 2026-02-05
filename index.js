import moviePoster from "./images/no-poster.png";
const resultList = document.getElementById("result-list");
const movieName = document.getElementById("movie-name");
const btnSearch = document.getElementById("btn-search");

const key = import.meta.env.VITE_OMDB_API_KEY;

//getting data from localstorage
let moviesArr = JSON.parse(localStorage.getItem("watchlist")) || [];

let movieArrOfObjs = [];

document.addEventListener("click", function (e) {
  const movieId = e.target.dataset.add || e.target.parentElement.dataset.add;
  if (movieId) {
    saveMovieToWhishlist(movieId);
  }
});

function saveMovieToWhishlist(movieId) {
  const movieExist = moviesArr.some((movie) => movie.movieId === movieId);

  if (movieExist) {
    return alert("Already in watchlist!");
  }

  let newMovie = movieArrOfObjs.find((movie) => movie.imdbID === movieId);
  moviesArr.push(newMovie);
  localStorage.setItem("watchlist", JSON.stringify(moviesArr));
  renderMovies(movieArrOfObjs);
}

async function searchMovie() {
  // storing the value of input field
  const movieQuery = movieName.value.trim().toLowerCase();
  if (!movieQuery) return;

  resultList.innerHTML = `<p class="starting-state">Searching for movies...</p>`;

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?s=${movieQuery}&r=json&apikey=${key}`,
    );
    const data = await res.json();

    if (data.Response === "True") {
      const moviePromises = data.Search.map((movie) =>
        fetch(
          `https://www.omdbapi.com/?i=${movie.imdbID}&r=json&apikey=${key}`,
        ).then((res) => res.json()),
      );

      movieArrOfObjs = await Promise.all(moviePromises);
      renderMovies(movieArrOfObjs);
    } else {
      resultList.innerHTML = `<div class="not-found-container"><p class="not-found-text">Unable to find what you’re looking for. Please try another search.</p></div>`;
    }
  } catch (err) {
    console.error("Search failed", err);
  }
}

function renderMovies(movies) {
  const savedId = moviesArr.map((movie) => movie.imdbID);
  const html = movies
    .map((movie) => {
      const isSaved = savedId.includes(movie.imdbID);
      return `<article class="card" style = >
                                <img src="${movie.Poster !== "N/A" ? movie.Poster : moviePoster}" 
                                    onerror="src='${moviePoster}'; onerror=null;"
                                    alt=${movie.Title}
                                     />
                                <div class="title-section">
                                    <h2>${movie.Title}</h2>
                                    <span class="star-baseline"><img src="icons/star.png" class="star-icon" alt="Rating" aria-hidden="true" /></span>
                                    <span class="rating" aria-label="Rated ${movie.imdbRating} stars">${movie.imdbRating}</span>
                                </div>
                                <div class="tags">
                                    <p> <span class="sr-only"> Duration: </span> ${movie.Runtime}</p>
                                    <p> <span class="sr-only">Genre: </span> ${movie.Genre}</p>
                                    <button 
                                      type="button" 
                                      class="icon-btn ${isSaved ? "icon-btn-disabled" : ""}" 
                                      aria-label="${isSaved ? "Already in watchlist" : "Add to watchlist"}"
                                      data-add="${movie.imdbID}"
                                      ${isSaved ? "disabled" : ""}
                                      >
                                    
                                       ${isSaved ? `<i class="icon-check fa-solid fa-circle-check" aria-hidden="true"></i>` : `<img src="icons/plus.png" class="icon-watchlist" aria-hidden="true" />`}
                                       <span  class="watchlist-btn-text"> ${isSaved ? "In Watchlist" : "Watchlist"} </span>
                                      </button>
                                  
                                </div>
                                <p class="desc">${movie.Plot} </p>
                            </article>`;
    })
    .join("");

  resultList.style.paddingTop = "2.655em";
  resultList.innerHTML = html;
}

movieName.addEventListener("keypress", (event) => {
  if (event.key === "Enter") searchMovie();
});
btnSearch.addEventListener("click", searchMovie);
