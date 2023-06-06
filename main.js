import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const readline = require("readline");
import { Movie } from "./Movie.js";
import { API } from "./API.js";

function readMovieDataFromFile(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const movieData = JSON.parse(jsonData);
    return movieData.map(
      (movie) =>
        new Movie(
          movie.id,
          movie.title,
          movie.releaseYear,
          movie.genre,
          movie.overView
        )
    );
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return [];
  }
}


const message = `
***************************
Welcome to Movie Catalog CLI APP
***************************
Select an action:
1) Display Movie Catalog
2) Add New Movie
3) Update an existing Movie Information
4) Delete a Movie
5) Search for a specific Movie
6) Display Filtered Movie Catalog
***************************
What's your choice? (Enter 'exit' to exit)\n`;


const main = () => {
  let movies = readMovieDataFromFile("movies.json");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const findMovie =  (callback) => {
      rl.question("What movie are you looking for? (Enter id number of title)\n",
        (answer) => {
          if(!isNaN(answer)){
            answer =  parseInt(answer)
          }
          const searchType = typeof answer;
          if (searchType === "number") {
            callback(movies.find(movie => movie.id === answer));
          } else if (searchType === "string") {
            callback(movies.find(movie => movie.title.toLowerCase() === answer.toLowerCase()));
          }
        });
    }
  
  const updateMovie = async (movie) =>{
    const message2 = `
  ***************************
  Select an option to update:
  1) Title
  2) Release Date
  3) Genre
  4) Overview
  ***************************
  What's your choice? (Enter 'none' to exit)\n`;
    const choice = await new Promise((resolve) =>{
      rl.question(message2,(answer) =>{
        if (typeof (answer = parseInt(answer)) === "number") {
          resolve(answer);
        }else{
          console.log("Unrecognized input, update Cancelled");
          resolve(7);
        }
      })
    })

    const info = await new Promise((resolve) => {
      rl.question("Enter the updated information:",(answer) =>{
        resolve(answer)
      })
    })

    switch(choice){
      case 1: movie.title = info; console.log("Title updated to " + info); break;
      case 2: movie.releaseYear = info; console.log("releaseYear updated to " + info); break;
      case 3: movie.genre = [info]; console.log("Genre updated to " + [info]); break;
      case 4: movie.overView = info; console.log("Overview updated to " + info); break;
      default: console.log("Unrecognized input, update Cancelled"); break;
  }
  ask(message);
}

  function ask(question) {
    rl.question(question, async (answer) => {
      if (answer === "exit") {
        process.exit(1);
      }
      if (typeof (answer = parseInt(answer)) === "number") {
        switch (answer) {
          case 1:
            movies.forEach((element) => {
              element.printMovieInfo();
            });
            break;
          case 2:
            const maxId = movies.reduce((max, movie) => {
              return movie.id > max ? movie.id : max;
            }, -Infinity);
            let title = await new Promise((resolve) => {
              rl.question("Enter The Title of the Movie:\n", (answer) => {
                resolve(answer);
              });
            });
            let releaseDate = await new Promise((resolve) => {
              rl.question(
                "Enter The date this movie was published in: (Please Use the Format 'YYYY-MM-DD')\n",
                (answer) => {
                  resolve(answer);
                }
              );
            });
            let genres = await new Promise((resolve) => {
              let genresArray = [];
              console.log("Enter The Genre\\s: (Press Enter To Finish)");
              const promptGenre = () => {
                rl.question("Genre: ", (answer) => {
                  if (answer.trim() === "") {
                    resolve(genresArray);
                  } else {
                    genresArray.push(answer);
                    promptGenre();
                  }
                });
              };
              promptGenre();
            });
            let overview = await new Promise((resolve) => {
              rl.question(
                "Enter a short overview of the Movie:\n",
                (answer) => {
                  resolve(answer);
                }
              );
            });
            let movie = new Movie(maxId + 1, title, releaseDate, genres, overview);
            movies.push(movie);
            console.log("Movie Added....");
            break;
          case 3:
            movies.forEach((element) => {
              element.printMovieInfo();
            });
            findMovie(updateMovie);
            break;
          case 4:
            movies.forEach((element) => {
              element.printMovieInfo();
            });
            findMovie((movie) =>{
              console.log(movies.findIndex(m => m === movie));
              movies.splice(movies.findIndex(m => m === movie),1)
              ask(question);
            });
            break;
          case 5:
            findMovie((movie) => {
              if (movie === undefined) {
                console.log("Movie not found");
              } else {
                console.log(movie.printMovieInfo());
              }
            ask(question);
            });
            break;
          case 6:
            let filter = {
            }
            await new Promise((resolve) => {
              const addFilter = () =>{
                rl.question("Add filter: (Title=\"\" Date >/=/< YYYY-MM-DD), genre=\"\" ( No white spaces before or after the (=) ** \"none\" to exit)\n", (answer) =>{
                  if(answer === "none"){
                    resolve();
                  } else {
                      answer = answer.split(/([=><])/);
                      if(answer[0].toLowerCase() === "title"){
                        filter[answer[0].toLowerCase()] = answer[2];
                      } else if(answer[0].toLowerCase() === "date"){
                        filter[answer[0].toLowerCase() + " " + answer[1]] = answer[2];
                      } else if( answer[0].toLowerCase() === "genre"){
                        ("genre" in filter) ? 1 : filter["genre"] = [] ;
                        filter[answer[0].toLowerCase()] = [...filter[answer[0].toLowerCase()],answer[2]];
                      }
                      const filteredMovies =  movies.filter(movie => {
                        if (filter.title && !movie.title.toLowerCase().includes(filter.title.toLowerCase())) {
                          return false;
                        }  
                        if (filter["date >"] && movie.releaseDate <= filter["date >"]) {
                          return false;
                        }

                        if (filter["date <"] && movie.releaseDate >= filter["date <"]) {
                          return false;
                        }

                        if (filter["date ="] && movie.releaseDate != filter["date ="]) {
                          return false;
                        }

                        if (filter.genre && !filter.genre.every(g => movie.genre.some(mg => mg.toLowerCase() === g.toLowerCase()))) {
                          return false;
                        }

                        return true;
                      })
                      filteredMovies.forEach(movie => movie.printMovieInfo());
                      console.log("Movies Found: "+ filteredMovies.length );
                      console.log(filter);
                      addFilter();
                  }
                })
              }
              addFilter();
            });   
            break;
         }
      } else {
        console.log("Unrecognized Input");
      }
      ask(question);
    });
  }

  ask(message);
};

main();
