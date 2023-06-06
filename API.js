
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fetch = require('node-fetch');
const fs = require('fs');
import {Movie} from './Movie.js'


export const API = () => {
  let genres = [];
  let movies = [];
  const fetchGenres = (callback) =>{

    let url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
    let options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTE2NjNiMDA4Y2FhNDRmNjhmYjZkYTdiODViOWFmNyIsInN1YiI6IjY0NzlkMDBjY2Y0YjhiMDE0MThlNjRiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.R7HexTUZVk8AAN1dJ_wfUKaMbUTilzgfVbwXg8cSJSI'
    }
  };

    fetch(url, options)
    .then(res => res.json())
    .then(json => genres = json.genres)
    .then(callback())
    .catch(err => console.error('error:' + err));
  }
  
const fetchMovies = () =>{

    let  url = 'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
    let options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTE2NjNiMDA4Y2FhNDRmNjhmYjZkYTdiODViOWFmNyIsInN1YiI6IjY0NzlkMDBjY2Y0YjhiMDE0MThlNjRiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.R7HexTUZVk8AAN1dJ_wfUKaMbUTilzgfVbwXg8cSJSI'
    } 
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json =>  {
      json.results.forEach(element => {
        movies.push(
          (new Movie(
            element.id,
            element.title,
            element["release_date"],
            element["genre_ids"].map((id) => {
          const genre = genres.find((genre) => genre.id === id);
          return genre ? genre.name : "Genre not found";
        }),
        element.overview)
        ).toJSON());
      });

      fs.writeFile("movies.json", JSON.stringify(movies,null,1), 'utf-8', (err) => {
        if (err) {
          console.log("Something went wrong while writing to the file!");
          console.log(err.message);
        } else {
          console.log("File has been written.");
        }
      });
    })
    .catch(err => console.error('error:' + err));
}

fetchGenres(fetchMovies);

  ////this code was used to check that the information is stored correctly in json format
  // const fileContents = fs.readFileSync('movies.json', 'utf-8');

  // let parsedData;
  // try {
  //   // Parse the contents into a JavaScript object
  //   parsedData = JSON.parse(fileContents);
  // } catch (error) {
  //   console.error('Error parsing JSON:', error);
  // }

  // if (parsedData) {
  //   // File is in the correct JSON format
  //   console.log('File is in the correct JSON format.');
  // } else {
  //   // File is not in the correct JSON format
  //   console.log('File is not in the correct JSON format.');
  // }

  return 1;
}


