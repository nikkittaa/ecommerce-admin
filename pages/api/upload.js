// import multiparty from 'multiparty';
// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import fs from 'fs';
// import mime from 'mime-types';
// import { mongooseConnect } from '@/lib/mongoose';
// import { isAdminRequest } from './auth/[...nextauth]';

// const bucketName = 'nikita-next-ecommerce';
// export default async function handle(req, res){
//     await mongooseConnect();
//     await isAdminRequest(req,res);
    
//     const form = new multiparty.Form();
//     const {fields, files} = await new Promise((resolve, reject) => {
//         form.parse(req, (err, fields, files) => {
//             if(err) reject(err);
//             resolve({fields, files});
           
//         });
//     });

   

//     const client = new S3Client({
//         region: 'eu-north-1',
//         credentials: {
//             accessKeyId: process.env.S3_ACCESS_KEY,
//             secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//         },
//     });
    
//     const links = [];
//     for(const file of files.file){
//         const ext = file.originalFilename.split('.').pop();
//         const newFilename =  Date.now() + '.'+ext;
//         await client.send(new PutObjectCommand({
//             Bucket: bucketName,
//             Key: newFilename,
//             Body: fs.readFileSync(file.path),
//             ACL: 'public-read',
//             ContentType: mime.lookup(file.path),
//         }));

//         const link = `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFilename}`;
//         links.push(link);
//     }
   
//     return res.json(links);
    
// }


// export const config = {
//     api: {bodyParser: false},
// };

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

// Create the uploads directory if it doesn’t exist
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const newFilename = Date.now() + ext;
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

// Middleware wrapper for multer
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

// Main handler
export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, upload.array('file'));

      const files = req.files;
      const links = files.map((file) => `/uploads/${file.filename}`);
      return res.status(200).json( links);
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'File upload failed.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Disable Next.js default body parser (needed for multer)
export const config = {
  api: { bodyParser: false },
};
