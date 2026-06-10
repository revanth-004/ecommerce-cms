export const validate = (formData) => {
    console.log("--formData--")
    console.log(formData)
  const errors = {};

  // Brand
  if (!formData.brandId) errors.brandId = "Brand is required";

  // Hero
  const hero = {};
  if (!formData.hero?.sectionContent?.title?.trim())
    hero.title = "Title is required";
  if (!formData.hero?.sectionContent?.subtext?.trim())
    hero.subtext = "Content is required";
  if (!formData.hero?.sectionContent?.images?.length)
    hero.images = "Background media is required";
  if (Object.keys(hero).length) errors.hero = { sectionContent: hero };

  // Filter
  const filter = {};
  if (!formData.filter?.sectionContent?.title?.trim())
    filter.title = "Title is required";
  if (!formData.filter?.sectionContent?.subtext?.trim())
    filter.subtext = "Content is required";
  if (!formData.filter?.sectionContent?.image?.length)
    filter.image = "Background image is required";
  if (Object.keys(filter).length) errors.filter = { sectionContent: filter };

  // Category
  const category = {};
  if (!formData.category?.sectionContent?.title?.trim())
    category.title = "Title is required";
  if (!formData.category?.sectionContent?.subtext?.trim())
    category.subtext = "Content is required";
  if (!formData.category?.sectionContent?.productCatgories?.length)
    category.productCatgories = "At least one product category is required";
  if (!formData.category?.sectionContent?.button?.text?.trim())
    category.button = { ...category.button, text: "Button text is required" };
  if (!formData.category?.sectionContent?.button?.link?.trim())
    category.button = { ...category.button, link: "Button link is required" };
  if (!formData.category?.sectionContent?.button?.icon?.length)
    category.button = { ...category.button, icon: "Button icon is required" };
  if (Object.keys(category).length)
    errors.category = { sectionContent: category };

  // Product
  const product = {};
  if (!formData.product?.sectionContent?.title?.trim())
    product.title = "Title is required";
  if (!formData.product?.sectionContent?.products?.length)
    product.products = "At least one product is required";
  if (Object.keys(product).length) errors.product = { sectionContent: product };

  // Benefit
  const benefit = {};
  if (!formData.benefit?.sectionContent?.title?.trim())
    benefit.title = "Title is required";
  if (!formData.benefit?.sectionContent?.subtext?.trim())
    benefit.subtext = "Content is required";
  if (!formData.benefit?.sectionContent?.image?.length)
    benefit.image = "Background image is required";

  const benefitCardErrors = (
    formData.benefit?.sectionContent?.benefitCard || []
  ).map((card) => {
    const e = {};
    if (!card.title?.trim()) e.title = "Title is required";
    if (!card.subtext?.trim()) e.subtext = "Content is required";
    if (!card.image?.length) e.image = "Card image is required";
    return e;
  });
  if (benefitCardErrors.some((e) => Object.keys(e).length > 0))
    benefit.benefitCard = benefitCardErrors;

  if (!formData.benefit?.sectionContent?.button?.text?.trim())
    benefit.button = { ...benefit.button, text: "Button text is required" };
  if (!formData.benefit?.sectionContent?.button?.link?.trim())
    benefit.button = { ...benefit.button, link: "Button link is required" };
  if (!formData.benefit?.sectionContent?.button?.icon?.length)
    benefit.button = { ...benefit.button, icon: "Button icon is required" };
  if (Object.keys(benefit).length) errors.benefit = { sectionContent: benefit };

  // Banner
  const banner = {};
  if (!formData.banner?.sectionContent?.title?.trim())
    banner.title = "Title is required";
  if (!formData.banner?.sectionContent?.subtext?.trim())
    banner.subtext = "Content is required";
  if (!formData.banner?.sectionContent?.image?.length)
    banner.image = "Background image is required";
  if (!formData.banner?.sectionContent?.button?.text?.trim())
    banner.button = { ...banner.button, text: "Button text is required" };
  if (!formData.banner?.sectionContent?.button?.link?.trim())
    banner.button = { ...banner.button, link: "Button link is required" };
  if (!formData.banner?.sectionContent?.button?.icon?.length)
    banner.button = { ...banner.button, icon: "Button icon is required" };
  if (Object.keys(banner).length) errors.banner = { sectionContent: banner };

  // About
  const about = {};
  if (!formData.about?.sectionContent?.title?.trim())
    about.title = "Title is required";
  if (!formData.about?.sectionContent?.subtext?.trim())
    about.subtext = "Content is required";
  if (!formData.about?.sectionContent?.image?.length)
    about.image = "Background image is required";
  if (!formData.about?.sectionContent?.button?.text?.trim())
    about.button = { ...about.button, text: "Button text is required" };
  if (!formData.about?.sectionContent?.button?.link?.trim())
    about.button = { ...about.button, link: "Button link is required" };
  if (!formData.about?.sectionContent?.button?.icon?.length)
    about.button = { ...about.button, icon: "Button icon is required" };
  if (Object.keys(about).length) errors.about = { sectionContent: about };

  // Testimonial
  const testimonial = {};
  if (!formData.testimonial?.sectionContent?.title?.trim())
    testimonial.title = "Title is required";

  const testimonialCardErrors = (
    formData.testimonial?.sectionContent?.testimonialCard || []
  ).map((card) => {
    const e = {};
    if (!card.name?.trim()) e.name = "Name is required";
    if (!card.location?.trim()) e.location = "Location is required";
    if (!card.review?.trim()) e.review = "Review is required";
    if (!card.image?.length) e.image = "Card image is required";
    return e;
  });
  if (testimonialCardErrors.some((e) => Object.keys(e).length > 0))
    testimonial.testimonialCard = testimonialCardErrors;

  if (Object.keys(testimonial).length)
    errors.testimonial = { sectionContent: testimonial };

  // Article
  const article = {};
  if (!formData.article?.sectionContent?.title?.trim())
    article.title = "Title is required";
  if (!formData.article?.sectionContent?.articles?.length)
    article.articles = "At least one article is required";
  if (!formData.article?.sectionContent?.button?.text?.trim())
    article.button = { ...article.button, text: "Button text is required" };
  if (!formData.article?.sectionContent?.button?.link?.trim())
    article.button = { ...article.button, link: "Button link is required" };
  if (!formData.article?.sectionContent?.button?.icon?.length)
    article.button = { ...article.button, icon: "Button icon is required" };
  if (Object.keys(article).length) errors.article = { sectionContent: article };

  // Call For Action
  const cfa = {};
  if (!formData.callForAction?.sectionContent?.title?.trim())
    cfa.title = "Title is required";
  if (!formData.callForAction?.sectionContent?.subtext?.trim())
    cfa.subtext = "Content is required";
  if (!formData.callForAction?.sectionContent?.image?.length)
    cfa.image = "Background image is required";
  if (!formData.callForAction?.sectionContent?.button?.text?.trim())
    cfa.button = { ...cfa.button, text: "Button text is required" };
  if (!formData.callForAction?.sectionContent?.button?.link?.trim())
    cfa.button = { ...cfa.button, link: "Button link is required" };
  if (!formData.callForAction?.sectionContent?.button?.icon?.length)
    cfa.button = { ...cfa.button, icon: "Button icon is required" };
  if (Object.keys(cfa).length) errors.callForAction = { sectionContent: cfa };

  return errors;
};
