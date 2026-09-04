import express from 'express';
import { getmovies, createmovie, getmoviebytitle, updatemovie, deletemovie } from '../controllers/movieContoller.js';
import { createreview, deletereview } from '../controllers/reviewController.js';
import upload  from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { authMiddleware , restrictTo } from '../middleware/auth.js';
const router = express.Router();

router.get('/',getmovies);
router.post('/', authMiddleware,restrictTo('admin'), upload.single('poster'), validate , createmovie) //'poster' — yeh woh field name hai jo frontend form mein use hoga file input ke liye. Jab frontend FormData banayega (jo hum baad mein karenge), usme file ko isi naam (poster) se append karna hoga, warna Multer usko dhoond nahi payega.
router.get('/:title',getmoviebytitle)
router.patch('/:title',authMiddleware, restrictTo('admin'),upload.single('poster') ,validate ,updatemovie)
router.delete('/:title', authMiddleware,restrictTo('admin'),deletemovie)
router.post('/:movieId/reviews', createreview);
router.delete('/:movieId/reviews/:reviewId', authMiddleware,restrictTo('admin'), deletereview)

export default router;