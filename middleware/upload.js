import multer from 'multer';
import path from 'path';

// 1. Storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. File filter — sirf images allow karna
export function fileFilter(req, file, cb) {
    console.log("Received file:", file); 
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);    // accept karo
    } else {
        cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);   // reject karo
    }
}

// 3. Multer instance — sab kuch combine karke
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024   // 5MB max
    }
});

export default upload;