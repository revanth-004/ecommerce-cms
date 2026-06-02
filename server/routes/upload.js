// const express = require("express");
// const multer = require("multer");
// const Upload = require("../models/Upload");
// const router = express.Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       res.json({
//         success: false,
//         message: "You must provide at least 1 file",
//       });
//     } else {
//       let imageUploadObject = {
//         file: {
//           data: req.file.buffer,
//           contentType: req.file.mimetype,
//         },
//         fileName: req.body.fileName,
//       };
//       const uploadObject = new Upload(imageUploadObject);

//       const uploadProcess = await uploadObject.save();
//       res.json({ success: true, fileId: uploadProcess._id });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;
