import { z } from 'zod';
const movieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    genre: z.string().min(1, "Genre is required"),
    rating: z.coerce.number().min(0, "Rating must be 0 or more").max(10, "Rating must be 10 or less !"),
    releaseyear: z.coerce.number().int("Release year must be a whole number").min(1888, "Invalid release year").max(new Date().getFullYear(),"Release year cannot be in the future")
});

export function validate(req, res, next) {
    try {
        req.body = movieSchema.parse(req.body);
        next();
    } catch (error) {
        const err = new Error(error.issues[0].message);
        err.statusCode = 400;
        next(err);
        
    }
}

