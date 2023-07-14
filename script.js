/*
MY URL;s
TITLES:https://www.omdbapi.com/?s=avengers&apikey=bad530f5
DETAILS:https://www.omdbapi.com/?i=tt0848228&apikey=bad530f5

note:avengers is used as a example link, the following URL also consists my api key.
 */

//SELECTORS.

const searchMovie = document.querySelector(".search-box");
const list = document.querySelector(".search-list")
const container = document.querySelector(".container");
const favourites = document.querySelector(".favourites");
const home = document.querySelector(".home");
const like =document.querySelector(".like");
const favContainer=document.querySelector(".fav-container");
const delAll=document.querySelector(".deleteAll");




//setting a local storage branch for adding favourite movies.

if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

//FETCHING MOVIES FORM THE API

async function fetchList(searchTerm){
    const url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=bad530f5`;
    const res = await fetch(`${url}`);
    const data = await res.json();
    console.log(data.Search);
    if(data.Response=="True"){
        displayList(data.Search);
    }
}

//for getting the dyamically updated array of search suggestions.

function movieSuggestions(){
    let searchTerm=(searchMovie.value).trim() ;
    if(searchTerm.length>0){
        list.classList.remove('hide-list');
        fetchList(searchTerm);
    } else{

        list.classList.add('hide-list');

    }
}

//for displaying the above aquired search array.

function displayList(movies){

    list.innerHTML= "";

    for(let idx = 0 ; idx < movies.length ; idx++){
        
        let searchItem = document.createElement('div');
        searchItem.dataset.id = movies[idx].imdbID;
        searchItem.classList.add('suggestion');
        if(movies[idx].Poster!="N/A"){
            poster = movies[idx].Poster;
        }
        else{
            poster = "imagenotfound.jpg";
        }

        searchItem.innerHTML = `
        <div class="poster-div">
        <img class="search-image" src="${poster}" alt="">
    </div>

        <div class="search-info">
            <h3>${movies[idx].Title}</h3>
          <p>${movies[idx].Year}</p>
          <button class="like"><i class="fa-solid fa-heart"></i></button>
        </div>
          
            
         `;
        
        list.appendChild(searchItem);

      
    }
   
     loadDetails();
    
    }
     



//loading the detials of any given movie in the list when clicked.

function loadDetails(){

    const movies = document.querySelectorAll(".suggestion");

    movies.forEach(movie=>{
        
        movie.addEventListener('click',async()=>{
            // list.classList.add('hide-list');
            searchMovie.value = "";
            const result = await fetch (`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=bad530f5`);
            const details = await result.json();
            console.log(details);
            displayDetails(details);
         
        })
    })

}


//displaying the above aquired details.
function displayDetails(movie){

    container.innerHTML= `

    <div class="image-container" >
    <img src = "${(movie.Poster != "N/A") ? movie.Poster : "imagenotfound.jpg"}" class="poster" alt = "movie poster">
    
</div>

<div class="info-container">
    <div class=""><span>Ratings : </span> <section class="rating">${movie.Rated}</section></div>
    <h2 class="title">${movie.Title}</h2>
    <div class="year"><span>Year : </span>${movie.Year}</div>
    <div class="genre"><span>Genre : </span>${movie.Genre}</div>
    <div class="writer"><span>Writer : </span>${movie.Writer}</div>
    <div class="actors"><span>Actors : </span>${movie.Actors}</div>
    <div class="plot"><span>Plot : </span>${movie.Plot}</div>
    <div class="language"><span>Language : </span>${movie.Language}</div>
    <div class="awards"><span>Awards : </span>${movie.Awards}</div>
</div>
`;

}


//event listener to make the list go away when pressed on random areas on the screen other than the search list.

window.addEventListener('click',(e)=>{
    if(e.target.className!="search-box"&&e.target.className!="like")
    {
        list.classList.add('hide-list');

    }
})


//this is where we add or remove the liked movies to favouritelist.

window.addEventListener('click',(e)=>{
    console.log(e.target);
    if(e.target.className==="like")
    { 
        let ide = e.target.parentElement.parentElement.dataset.id;
        console.log(ide);
        let arr=JSON.parse(localStorage.getItem("favouritesList"));
        let contain=false;
        for (let index = 0; index < arr.length; index++) {
            if (ide==arr[index]) {
                contain=true;
            }
        }
        if (contain) {
            let number = arr.indexOf(ide);
            arr.splice(number, 1);
            alert("Movie removed from your favourites list.");
        } else {
            arr.push(ide);
            alert("Movie added to your favourites list");
        }
        console.log(arr);
        localStorage.setItem("favouritesList",JSON.stringify(arr));
        displayFavourites();
    }
       
    
})


//to display favouritelist

async function displayFavourites(){

    console.log("here");
    favContainer.innerHTML="";

   let arr=JSON.parse(localStorage.getItem("favouritesList"));
   for(i=0;i<arr.length;i++){

    const response = await fetch(`https://www.omdbapi.com/?i=${arr[i]}&apikey=bad530f5`);
        const data = await response.json();
        console.log(data);
        let favItem = document.createElement('div');
        favItem.classList.add('fav-element');
        favItem.dataset.id=arr[i];
        favItem.innerHTML=`
        <div class="poster-div">
        <img class="fav-image" class="search-image" src="${data.Poster}" alt="">
    </div>

        <div class="fav-info">
            <h3>${data.Title}</h3>
          <p>${data.Year}</p>
          <button class="like"><i class="fa-solid fa-heart"></i></button>
        </div>
          
            `;

            favContainer.appendChild(favItem);
  
   }
   loadFavDetails();

}

//loading details of the movies in the favourite list when clicked.
function loadFavDetails(){
    console.log("here");

    const movies = document.querySelectorAll(".fav-element");

    movies.forEach(movie=>{
        
        movie.addEventListener('click',async()=>{

            const result = await fetch (`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=bad530f5`);
            const details = await result.json();
            console.log(details);
            displayDetails(details);
         
        })
    })

}


//to reset the favourite array.


delAll.addEventListener('click',deleteAll);

function deleteAll(){
    console.log("delall");
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    arr=[];
    localStorage.setItem("favouritesList",JSON.stringify(arr));
    displayFavourites();
    
}

