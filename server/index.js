const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const multer = require("multer");
const path = require("path");

const organizerRoutes = require("./routes/organizerRoutes");
const Organizer = require("./models/Organizer");

const customerRoutes = require("./routes/customerRoutes");
const Customer = require("./models/Customer");

const brandRoutes = require("./routes/brandRoutes");
const Brand = require("./models/Brand");

const productRoutes = require("./routes/productRoutes");
const Product = require("./models/Product");

const sellerRoutes = require("./routes/sellerRoutes");
const Seller = require("./models/Seller");

const offerRoutes = require("./routes/offerRoutes");
const Offer = require("./models/Offer");

const couponRoutes = require("./routes/couponRoutes");
const Coupon = require("./models/Coupon");

const articleRoutes = require("./routes/articleRoutes");
const Article = require("./models/Article");

const articleCategoryRoutes = require("./routes/articleCatergoryRoutes");
const ArticleCategory = require("./models/ArticleCategory");

const taxRoutes = require("./routes/taxRoutes");
const Tax = require("./models/Tax");

const specificationRoutes = require("./routes/specificationRoutes");
const Specification = require("./models/Specification");

const specificationDetailRoutes = require("./routes/specificationDetailRoutes");
const SpecificationDetail = require("./models/SpecificationDetail");

const hsnRoutes = require("./routes/hsnRoutes");
const Hsn = require("./models/Hsn");

const productCategoryRoutes = require("./routes/productCategoryRoutes");
const ProductCategory = require("./models/ProductCategory");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

// ── file upload ──────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/Media"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|mp4|mov|avi|webm/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error(`Unsupported file type: ${file.mimetype}`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/public/Media/${req.file.filename}`,
  });
});

app.post("/upload/multiple", upload.array("files", 20), (req, res) => {
  if (!req.files?.length)
    return res.status(400).json({ message: "No files uploaded" });

  const filePaths = req.files.map((file) => ({
    originalName: file.originalname,
    filePath: `/public/Media/${file.filename}`,
    mimeType: file.mimetype,
    size: file.size,
  }));

  res.status(200).json({
    message: "Files uploaded successfully",
    files: filePaths,
  });
});

// ── routes ───────────────────────────────────────────────────────────────────

app.use("/api/organizers", organizerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/articleCategory", articleCategoryRoutes);
app.use("/api/taxes", taxRoutes);
app.use("/api/specification", specificationRoutes);
app.use("/api/specificationDetail", specificationDetailRoutes);
app.use("/api/hsn", hsnRoutes);
app.use("/api/productCategory", productCategoryRoutes);

// Global error handler for multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE")
      return res.status(400).json({ message: "File too large. Max 50MB." });
    if (err.code === "LIMIT_FILE_COUNT")
      return res.status(400).json({ message: "Too many files. Max 20." });
  }
  if (err) return res.status(400).json({ message: err.message });
  next();
});

app.listen(3000, () => console.log("Server is running on port 3000"));
