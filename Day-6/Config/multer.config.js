import multer from 'multer';
import { mul } from 'three/tsl';

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    },
});

const upload = multer({storage});

export default upload;