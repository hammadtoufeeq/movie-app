import moviemodel from "../model/movieModel.js";

export async function getmovies(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;
        const filter = {};
        if(req.query.genre){
            filter.genre = { $regex : req.query.genre, $options : 'i'}
        }
        const allmovies = await moviemodel.find(filter).skip(skip).limit(limit)
        const totalMovies = await moviemodel.countDocuments(filter);
        if(allmovies.length === 0){
            const error = new Error("No movies found");
            error.statusCode = 404;
            return next(error)
        }
        res.status(200).json({
            totalMovies : totalMovies,
            totalPages : Math.ceil(totalMovies/limit),
            currentMoviesCount : allmovies.length,
            currentPage : page,
            limit : limit,
            movies : allmovies
        })
    } catch (error) {
        next(error)
    }
}
export async function createmovie(req, res, next) {

    try {
        const body = req.body;
        if (!body.title || !body.genre || !body.rating || !body.releaseyear) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            return next(error)
        }
        const newmovie = {
            title: body.title,
            genre: body.genre,
            rating: body.rating,
            releaseyear: body.releaseyear,
            poster : req.file ? req.file.filename : undefined
        }

        await moviemodel.create(newmovie);
        res.status(201).json({ newmovie });
    } catch (error) {
        next(error)
    }
}
export async function getmoviebytitle(req, res, next) {
    try {
        const movietitle = req.params.title;
        const findmovie = await moviemodel.find({
            title: { $regex: movietitle, $options: 'i' }
        }).populate('reviews')
        if (findmovie.length === 0) {
            const error = new Error("Movie not found");
            error.statusCode = 404;
            return next(error)
        }
        res.status(200).json(findmovie)

    } catch (error) {
        next(error)
    }
}
export async function updatemovie(req, res, next) {
    try {
        const movietitle = req.params.title;
        const body = req.body;
        if (!body.title || !body.genre || !body.rating || !body.releaseyear) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            return next(error);
        }
        if (req.file) {
            body.poster = req.file.filename;
        }
        const updatedmovie = await moviemodel.findOneAndUpdate({
            title: movietitle
        }, body, { new: true, runValidators: true }
        )
        if (!updatedmovie) {
          const error = new Error("Movie not found");
          error.statusCode = 404;
          return next(error);
        }
        return res.status(200).json(updatedmovie)

    } catch (error) {
        next(error)
    }

}
export async function deletemovie(req, res, next) {
    try {
        const deletemovietitle = req.params.title;
        const removemovie = await moviemodel.findOneAndDelete({
            title: deletemovietitle
        })
        if (!removemovie) {
            const error = new Error("Movie not found")
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json({ message: "Movie deleted successfully", data: removemovie })
    } catch (error) {
        next(error)
    }
}
