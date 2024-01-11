import { AppDataSource } from "../data-source";
import * as cache from "memory-cache";
import { Movie } from "../entity/Movie";

export class MovieService {
  static async getAllMovies(): Promise<Movie[]> {
    const data = cache.get("data");
    if (data) {
      console.log("serving from cache");
      return data;
    } else {
      console.log("serving from db");
      const movieRepository = AppDataSource.getRepository(Movie);
      const movies = await movieRepository.find();
      cache.put("data", movies, 10000);
      return movies;
    }
  }

  static async createMovie(movieData: {
    title: string;
    description: string;
    director: string;
    year: number;
    rating: number;
    image: string;
    cast: string[];
  }): Promise<Movie> {
    const { title, description, director, year, rating, image, cast } = movieData;

    const movie = new Movie();
    movie.title = title;
    movie.description = description;
    movie.director = director;
    movie.year = year;
    movie.rating = rating.toString(); // Convert rating to string
    movie.image = image;
    movie.cast = cast.join(", "); // Join the cast array elements into a single string

    const movieRepository = AppDataSource.getRepository(Movie);
    await movieRepository.save(movie);

    return movie;
  }

  static async updateMovie(id: string, movieData: {
    title: string;
    description: string;
    director: string;
    year: number;
    rating: number;
    image: string;
    cast: string[];
  }): Promise<Movie | null> {
    const { title, description, director, year, rating, image, cast } = movieData;

    const movieRepository = AppDataSource.getRepository(Movie);
    const movie = await movieRepository.findOne({
      where: { id },
    });

    if (movie) {
        movie.title = title;
        movie.description = description;
        movie.director = director;
        movie.year = year;
        movie.rating = rating.toString(); // Convert rating to string
        movie.image = image;
        movie.cast = cast.join(", "); // Join the cast array elements into a single string

        await movieRepository.save(movie);
        return movie;
    } else {
        return null; // Indicate that the movie with the provided ID was not found
    }
  }

  static async deleteMovie(id: string): Promise<Movie | null> {
    const movieRepository = AppDataSource.getRepository(Movie);
    const movie = await movieRepository.findOne({
      where: { id },
    });

    if (movie) {
      await movieRepository.remove(movie);
      return movie;
    } else {
      return null; // Indicate that the movie with the provided ID was not found
    }
  }
}