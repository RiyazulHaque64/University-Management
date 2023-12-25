import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'db2nfoquk',
  api_key: '569376137322245',
  api_secret: 'fLh0BNcJaxhHd1GUzhijTxtk8-E',
});

export const sendImageToCloudinary = (imgName: string, path: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imgName },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
