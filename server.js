import 'dotenv/config';
import { connectdb } from './config/db.js';
import app from './app.js';
const PORT = process.env.PORT || 3002;

connectdb().then(() => {
  app.listen(PORT, () => console.log(`server is connected at ${PORT}`));
});