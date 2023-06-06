export class Movie{
    #id
    #title;
    #releaseYear;
    #genre;
    #overView;

    constructor(id,title,releaseYear,genre,overView){
        this.id = id;
        this.title = title;
        this.releaseYear = releaseYear;
        this.genre = genre;
        this.overView = overView;
    }

    get id(){
        return this.#id
    }

    set id(id){
        this.#id = id;
    }

    get title (){
        return this.#title;
    }

    set title(title){
        this.#title = title;
    }

    get releaseYear(){
        return this.#releaseYear;
    }

    set releaseYear(releaseYear){
        this.#releaseYear = releaseYear;
    }

    get genre (){
        return this.#genre;
    }

    set genre(genre){
        this.#genre = genre;
    }

    get overView(){
        return this.#overView;
    }

    set overView(overView){
        const regex = /(\S+\s+){10}\S+/g;
        this.#overView =  overView.replace(regex, '$&\n');
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            releaseYear: this.releaseYear,
            genre: this.genre,
            overView: this.overView
          };
    }


    printMovieInfo() {
        console.log(
`********************************************
Movie Information:
id: ${this.#id}
Title: ${this.#title}
Release Year: ${this.#releaseYear}
Genre: ${this.#genre}
Overview: ${this.#overView}
********************************************`);
      }
}
