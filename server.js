const express = require("express");
const multer = require("multer");

export default () => {
  const app = express();

  const storage = multer.diskStorage({
    destination: `${__dirname}/uploads/`,
    filename: (req, file, cb) => {
      cb(null, file.originalname || "");
    }
  });

  const upload = multer({ storage });

  app.post("/upload-file", upload.single("file"), (req, res, next) => {
    try {
      const { file } = req;
      res.json({ message: `File ${file.originalname || ""} Uploaded!` });
    } catch (e) {
      next(e);
    }
  });

  app.listen(3344);
};
