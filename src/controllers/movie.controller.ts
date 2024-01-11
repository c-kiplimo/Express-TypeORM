import { Request, Response } from "express";
import { MovieService } from "../service/movie.service";

export class MovieController {
  static async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await MovieService.getAllMovies();
      return res.status(200).json({ data: movies });
    } catch (error) {
      console.error("Error fetching movies:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async createMovie(req: Request, res: Response) {
    try {
      const { title, description, director, year, rating, image, cast } = req.body;
      const createdMovie = await MovieService.createMovie({
        title,
        description,
        director,
        year,
        rating,
        image,
        cast,
      });

      return res.status(200).json({ message: "Movie created successfully", movie: createdMovie });
    } catch (error) {
      console.error("Error creating movie:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateMovie(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, director, year, rating, image, cast } = req.body;
      const updatedMovie = await MovieService.updateMovie(id, {
        title,
        description,
        director,
        year,
        rating,
        image,
        cast,
      });

      if (updatedMovie) {
        return res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
      } else {
        return res.status(404).json({ message: "Movie not found" });
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteMovie(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedMovie = await MovieService.deleteMovie(id);

      if (deletedMovie) {
        return res.status(200).json({ message: "Movie deleted successfully", movie: deletedMovie });
      } else {
        return res.status(404).json({ message: "Movie not found" });
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}