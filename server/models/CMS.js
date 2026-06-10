const mongoose = require("mongoose");

const buttonSchema = new mongoose.Schema({
  text: { type: String, default: "" },
  icon: { type: String, default: "" },
  link: { type: String, default: "#" },
});

const heroSchema = new mongoose.Schema({
  sectionName: { type: String, default: "Hero Section" },
  sectionContent: {
    title: { type: String },
    subtext: { type: String },
    images: [{ type: String }],
    defaultImage: { type: String, default: "" },
  },
});

const filterSchema = new mongoose.Schema({
  sectionName: { type: String, default: "Filter Section" },
  sectionContent: {
    title: { type: String },
    subtext: { type: String },
    image: { type: String },
  },
});

const categorySchema = new mongoose.Schema({
  sectionName: { type: String, default: "Category Section" },
  sectionContent: {
    title: { type: String },
    subtext: { type: String },
    productCatgories: [{ type: String }],
    button: { type: buttonSchema },
  },
});

const productSchema = new mongoose.Schema({
  sectionName: { type: String, default: "Product Section" },
  sectionContent: {
    title: { type: String },
    products: [{ type: String }],
  },
});

const benefitCardSchema = new mongoose.Schema({
  title: { type: String },
  subtext: { type: String },
  image: { type: String },
});

const benefitSchema = new mongoose.Schema({
  sectionName: { type: String, default: "Benefit Section" },
  sectionContent: {
    title: { type: String },
    subtext: { type: String },
    benefitCard: [benefitCardSchema],
    button: { type: buttonSchema },
    image: { type: String },
  },
});

const bannerSchema = new mongoose.Schema({
  sectionName: { type: String, default: "Banner Section" },
  sectionContent: {
    title: { type: String },
    subtext: { type: String },
    button: { type: buttonSchema },
    image: { type: String },
  },
});

const aboutSchema = new mongoose.Schema({
  sectionName: { type: String, default: "About Section" },
  sectionContent: {
    title: { type: String },
    subtext: { type: String },
    button: { type: buttonSchema },
    image: { type: String },
  },
});

const testimonialCardSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: String },
  image: { type: String },
  review: { type: String },
});

const testimonialSchema = new mongoose.Schema({
  sectionName: { type: String, default: "Testimonial Section" },
  sectionContent: {
    title: { type: String },
    testimonialCard: [testimonialCardSchema],
  },
});

const articleSchema = new mongoose.Schema({
  sectionName: { type: String, default: "Article Section" },
  sectionContent: {
    title: { type: String },
    articles: [{ type: String }],
    button: { type: buttonSchema },
  },
});

const callForActionSchema = new mongoose.Schema({
  sectionName: { type: String, default: "Call For Action" },
  sectionContent: {
    title: { type: String },
    subtext: { type: String },
    button: { type: buttonSchema },
    image: { type: String },
  },
});

const cmsSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    hero: { type: heroSchema },
    filter: { type: filterSchema },
    category: { type: categorySchema },
    product: { type: productSchema },
    benefit: { type: benefitSchema },
    banner: { type: bannerSchema },
    about: { type: aboutSchema },
    testimonial: { type: testimonialSchema },
    article: { type: articleSchema },
    callForAction: { type: callForActionSchema },
  },
  { timestamps: true },
);

// One CMS doc per brand
cmsSchema.index({ brandId: 1 }, { unique: true });

const CMS = mongoose.model("CMS", cmsSchema);
module.exports = CMS;
