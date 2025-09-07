const resultList = document.getElementById('result-list')
const movieName = document.getElementById('movie-name')
const btnSearch = document.getElementById('btn-search')

//getting data from localstorage
let moviesArr = JSON.parse(localStorage.getItem('watchlist')) || []

// array to store the list of moves comes after search
let movieArrOfObjs = []

 document.addEventListener('click', function(e){
    if(e.target.dataset.watchlist){
        saveMovieToWhishlist(e.target.dataset.watchlist)
    }
  })
  
  
  function saveMovieToWhishlist(movieId){ 
    
    const movieExist = moviesArr.some(movie => movie.movieId === movieId)
    
    if(movieExist){
        alert("This movie already in your watchlist")
        return
    }
    
    let newMovie =  movieArrOfObjs.filter(movie => movie.movieId === movieId)
    moviesArr.push(...newMovie)
    localStorage.setItem('watchlist', JSON.stringify(moviesArr))
    alert("Successfully added to your watchlist")
  }

function searchMovie(){
    
    // storing the value of input field
    const movie = movieName.value.trim().toLowerCase()

    fetch(`https://www.omdbapi.com/?s=${movie}&r=json&apikey=e863c422`)
        .then(res => res.json())
            .then(data => {
                if(data.Response === 'True'){
                    const movies = data.Search
                    console.log(movies)
                    let html = ""
                    movies.forEach(film => {
                        const imdbId = film.imdbID
                        fetch(`https://www.omdbapi.com/?i=${imdbId}&r=json&apikey=e863c422`)
                            .then(res => res.json())
                            .then(movie => {   
                            html += 
                            `<div class="card">
                                <img src="${movie.Poster}"  />
                                <div class="title-section">
                                    <h2>${movie.Title}</h2>
                                    <span class="star-baseline"><img src="icons/star.png" class="star-icon" /></span>
                                    <span class="rating">${movie.imdbRating}</span>
                                </div>
                                <div class="tags">
                                    <p>${movie.Runtime}</p>
                                    <p>${movie.Genre}</p>
                                    <p>
                                        <img src="icons/plus.png" class="add-to-watchlist" data-watchlist = "${movie.imdbID}" id="btn-watchlist"/>
                                        <span>Watchlist</span>
                                    </p>
                                </div>
                                <p class="desc">${movie.Plot} </p>
                            </div>`
                        
                            // creating an movie object 
                            let movieObj = ({
                                title: movie.Title,
                                poster: movie.Poster,
                                rating: movie.imdbRating,
                                runtime: movie.Runtime,
                                genre: movie.Genre,
                                plot: movie.Plot,
                                movieId: movie.imdbID
                                })
                        
                            movieArrOfObjs.push(movieObj)
                       
                            resultList.innerHTML = html 
                
                        })
                    
                    })
            
                } else {
                        resultList.innerHTML = `<div class="not-found-container"><p class="not-found-text">Unable to find what you’re looking for. Please try another search.</p></div>`
                        }
    })     
}
   btnSearch.addEventListener('click', searchMovie)
   
 