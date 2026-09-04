import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import movieroutes from './routes/movieRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import userRoutes from './routes/userRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"] // inline allow
      },
    },
  })
);

const limiter = rateLimit({
    windowMs : 1*30*1000,
    max : 200,
    message : { error : "Too many requests , please try again later"},
    standardHeaders : true,
    legacyHeaders : false
})
app.use('/api',limiter)
app.use(express.json());
app.use(cors());
// app.use(morgan('dev'));
app.use(logger);
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'views')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/movies',movieroutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);
export default app;