const multer = require('multer');
const storage = multer.memoryStorage();




/*const storage = cloudinaryStorage({
    cloudinary,
    folder: "images",
    allowedFormats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
  });*/


  const uploader = multer({ storage });

export default uploader;