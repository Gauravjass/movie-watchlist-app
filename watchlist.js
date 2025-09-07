let myMovies = document.getElementById('my-movies')
let localStorageData = JSON.parse(localStorage.getItem('watchlist')) || []

function removeMovie(movieId){
    let updatedMoviesList =  localStorageData.filter(item => item.movieId !== movieId)
    
    localStorage.setItem('watchlist', JSON.stringify(updatedMoviesList))
    
    localStorageData = updatedMoviesList
    
    rendermovies(localStorageData)
}

document.addEventListener('click', function(e){
    if(e.target.dataset.remove){
        removeMovie(e.target.dataset.remove)   
    }
})

function rendermovies(localStorageDataArr){
    if(localStorageDataArr && localStorageDataArr.length > 0){
        let html = ''
        localStorageDataArr.forEach(movie =>{
            html +=`<div class="card">
                        <img src="${movie.poster}" />
                        <div class="title-section">
                            <h2>${movie.title}</h2>
                            <span class="star-baseline"><img src="icons/star.png" class="star-icon" /></span>
                            <span class="rating">${movie.rating}</span>
                        </div>
                        <div class="tags">
                            <p>${movie.runtime}</p>
                            <p>${movie.genre}</p>
                            <p>
                                <img src="icons/minus.png" class="add-to-watchlist" data-remove="${movie.movieId}" id="btn-remove"/>
                                <span>Remove</span>
                            </p>
                        </div>
                        <p class="desc">${movie.plot} </p>
                    </div>`
                    });
                    myMovies.innerHTML = html
    } else {
        myMovies.innerHTML = `<div class="empty-watchlist-container">
                                    <h1 class="empty-watchlist-heading">Your watchlist is looking a little empty...</h1>
                                    <div>
                                        <a href="index.html"><img src="icons/plus.png" class="plus-icon" /></a>
                                        <p>Let’s add some movies!</p>
                                    </div>
                                </div>`
                        
        }
}
rendermovies(localStorageData);