import express from 'express'
import multer from 'multer'

export const imageRouter = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

imageRouter.post('/uploadImage', upload.single('file'), async (req, res) => {
    if (req.file) {
        res.json({ url: req.file.filename })
    }
    else {
        res.json({ error: 'No file uploaded' })
    }
})



