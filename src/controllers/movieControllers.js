const { movie } = require("../models"),
  { imageKit } = require("../utils/imageKit");

module.exports = {
  createMovie: async (req, res) => {
    let { title, director, actor, writer, description } = req.body;
    try {
      const response = await movie.create({
        data: {
          title: title,
          director: director,
          actor: actor,
          writer: writer,
          description: description,
          images: `/images/movies${req.file.filename}`,
        },
      });

      return res.status(201).json({
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  createMovieWithImageKit: async (req, res) => {
    const { title, director, actor, writer, description } = req.body;
    try {
      const fileToString = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
      });
      const data = await movie.create({
        data: {
          title: title,
          director: director,
          actor: actor,
          writer: writer,
          description: description,
          images: uploadFile.url,
        },
      });
      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  getMovie: async (req, res) => {
    try {
      const movies = await movie.findMany();
      return res.status(200).json({
        data: movies,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  updateMovie: async (req, res) => {
    const movieId = parseInt(req.params.id);
    const { title, director, actor, writer, description } = req.body;

    try {
      const existingMovie = await movie.findUnique({
        where: { id: movieId },
      });

      if (!existingMovie) {
        return res
          .status(404)
          .json({ error: true, message: "Movie not found" });
      }

      const response = await movie.update({
        where: { id: movieId },
        data: {
          title: title || existingMovie.title,
          director: director || existingMovie.director,
          actor: actor || existingMovie.actor,
          writer: writer || existingMovie.writer,
          description: description || existingMovie.description,
        },
      });
      if (req.file) {
        response.images = `/images/${req.file.filename}`;
      } else {
        response.images = existingMovie.movie.images;
      }

      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  updateMovieWithImageKit: async (req, res) => {
    const movieId = parseInt(req.params.id);
    const { title, director, actor, writer, description } = req.body;

    try {
      const existingMovie = await movie.findUnique({
        where: { id: movieId },
      });

      if (!existingMovie) {
        return res
          .status(404)
          .json({ error: true, message: "Movie not found" });
      }
      const fileToString = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
      });

      const response = await movie.update({
        where: { id: movieId },
        data: {
          title: title || existingMovie.title,
          director: director || existingMovie.director,
          actor: actor || existingMovie.actor,
          writer: writer || existingMovie.writer,
          description: description || existingMovie.description,
        },
      });
      if (req.file) {
        response.images = uploadFile.url;
      } else {
        response.images = existingMovie.movie.images;
      }

      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  deleteMovie: async (req, res) => {
    const movieId = parseInt(req.params.id);
    try {
      const existingMovie = await movie.findUnique({
        where: { id: movieId },
      });

      if (!existingMovie) {
        return res
          .status(404)
          .json({ error: true, message: "Movie not found" });
      }

      await movie.delete({
        where: { id: movieId },
      });

      return res.status(200).json({
        data: existingMovie,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },
};
