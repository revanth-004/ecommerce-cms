import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { validate } from "../../utils/cmsValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import { selectSelectedCompany } from "../../features/company/companySelectors";

import { Image as AntImage, Select } from "antd";

import Card from "../../components/ui/Card";
import SelectInput from "../../components/form/input/SelectInput";
import InputField from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import FileUpload from "../../components/form/input/FileUpload";

const initialState = {
  companyId: "",
  brandId: "",
  hero: {
    sectionName: "Hero Section",
    sectionContent: {
      title: "Unleash Maximum Engine Power",
      subtext:
        "Race-inspired lubricants engineered for extreme performance, heat resistance, and uncompromising protection on every ride and drive.",
      images: [],
      defaultImage: "",
    },
  },
  filter: {
    sectionName: "Filter Section",
    sectionContent: {
      title: "Find Your Race - Grade Engine Oil",
      subtext:
        "Select your machine and get precision-matched lubrication designed for peak performance and engine longevity",
      image: [],
    },
  },
  category: {
    sectionName: "Category Section",
    sectionContent: {
      title: "Choose Your Performance Class",
      subtext:
        "Precision-engineered lubricants designed for every engine type — from daily rides to extreme driving conditions.",
      productCatgories: [],
      button: { text: "Explore All Products", icon: [], link: "#" },
    },
  },
  product: {
    sectionName: "Product Section",
    sectionContent: {
      title: "Track-Proven Best Sellers",
      products: [],
    },
  },
  benefit: {
    sectionName: "Benefit Section",
    sectionContent: {
      title: "Engineered For Extreme Performance",
      subtext:
        "We don't just make engine oil — we create precision lubrication systems designed to survive heat, speed, and pressure beyond normal limits.",
      benefitCard: [
        {
          title: "",
          subtext: "",
          image: "",
        },
      ],
      button: { text: "Explore Products", icon: [], link: "#" },
      image: [],
    },
  },
  banner: {
    sectionName: "Banner Section",
    sectionContent: {
      title: "Built For Speed Tested Under Pressure",
      subtext:
        "From city streets to high-speed highways, our lubricants deliver consistent performance, smoother acceleration, and uncompromising engine protection.",
      button: { text: "Explore Products", icon: [], link: "#" },
      image: [],
    },
  },
  about: {
    sectionName: "About Section",
    sectionContent: {
      title: "Power Meets Performance",
      subtext:
        "We specialize in high-performance engine lubricants designed for riders and drivers who demand precision, durability, and reliability. Every formula is engineered using advanced technology and tested under extreme real-world conditions.",
      button: { text: "Know more", icon: [], link: "#" },
      image: [],
    },
  },
  testimonial: {
    sectionName: "Testimonial Section",
    sectionContent: {
      title: "Trusted by Performance Drivers",
      testimonialCard: [
        {
          name: "James Carter",
          location: "Austin, Texas",
          image: [],
          review:
            "The engine feels noticeably smoother after switching to this oil. Acceleration is cleaner, and performance stays consistent even at high RPMs, making every drive more confident",
        },
        {
          name: "James Carter",
          location: "Austin, Texas",
          image: [],
          review:
            "The engine feels noticeably smoother after switching to this oil. Acceleration is cleaner, and performance stays consistent even at high RPMs, making every drive more confident",
        },
        {
          name: "James Carter",
          location: "Austin, Texas",
          image: [],
          review:
            "The engine feels noticeably smoother after switching to this oil. Acceleration is cleaner, and performance stays consistent even at high RPMs, making every drive more confident",
        },
      ],
    },
  },
  article: {
    sectionName: "Article Section",
    sectionContent: {
      title: "Racing Insights & Engine Care",
      articles: ["6a2114e727ae703cd5d4426a"],
      button: { text: "View All Articles", icon: [], link: "#" },
    },
  },
  callForAction: {
    sectionName: "Call For Action",
    sectionContent: {
      title: "Join The Performance Network",
      subtext:
        "Become a trusted distributor or workshop partner and grow with a premium engine oil brand built for scale and performance.",
      button: { text: "Become A Dealer", icon: [], link: "#" },
      image: [],
    },
  },
};

const ButtonSection = (props) => {
  const { sectionName, formData, formErrors, handleChange } = props;
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <InputField
          label="Button Text"
          name="text"
          className=""
          type="text"
          value={formData?.[sectionName]?.sectionContent?.button?.text}
          onChange={(e) => {
            handleChange(
              `${sectionName}.sectionContent.button.text`,
              e.target.value,
            );
          }}
          placeholder="Enter text"
          error={formErrors?.[sectionName]?.sectionContent?.button?.text}
          mandatory
        />
        <InputField
          label="Button Link"
          name="link"
          className=""
          type="link"
          value={formData?.[sectionName]?.sectionContent?.button?.link}
          onChange={(e) => {
            handleChange(
              `${sectionName}.sectionContent.button.link`,
              e.target.value,
            );
          }}
          placeholder="Enter link"
          error={formErrors?.[sectionName]?.sectionContent?.button?.link}
          mandatory
        />
        <FileUpload
          label="Button Icon"
          name="icon"
          imageHeight="h-20"
          imageWidth="w-20"
          value={formData?.[sectionName]?.sectionContent?.button?.icon || []}
          defaultImage={0}
          onChange={({ fileList }) => {
            handleChange(`${sectionName}.sectionContent.button.icon`, fileList);
          }}
          // mandatory
          multiple={false}
          acceptVideo={false}
          error={formErrors?.[sectionName]?.sectionContent?.button?.icon}
        />
      </div>
    </>
  );
};

const CMS = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [cmsId, setCmsId] = useState("6a290a0da7bda0fd5e42c66a");
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const selectedCompany = useAppSelector(selectSelectedCompany);

  // For SelectInput
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [articles, setArticles] = useState([]);

  const dispatch = useAppDispatch();

  //useEffect

  //Initail load
  useEffect(() => {
    if (!cmsId) return;

    axios
      .get(`http://localhost:3000/api/cms/${cmsId}`)
      .then((res) => {
        const existing = res.data.data;
        if (existing) {
          setFormData((prev) => ({ ...prev, ...existing }));
        }
        // console.log("existing");
        // console.log(existing);
      })
      .catch((err) => console.error("Error fetching CMS", err));
  }, []);

  useEffect(() => {
    // Fetch brands for company

    //Reset Options
    setBrands([]);
    setProductCategories([]);
    setProducts([]);
    setArticles([]);

    //Reset FormData
    setFormData((prev) => ({
      ...prev,
      brandId: "",
      category: {
        ...prev.category,
        sectionContent: {
          ...prev.category.sectionContent,
          productCatgories: [],
        },
      },
      article: {
        ...prev.article,
        sectionContent: {
          ...prev.article.sectionContent,
          articles: [],
        },
      },
      product: {
        ...prev.product,
        sectionContent: {
          ...prev.product.sectionContent,
          products: [],
        },
      },
    }));

    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data || []))
      .catch((err) => console.error("Error fetching brands", err));

    return () => {
      setBrands([]);
    };
  }, [selectedCompany?._id]);

  useEffect(() => {
    // Fetch product categories for brand

    //Reset Options
    setProductCategories([]);
    //Reset FormData
    setFormData((prev) => ({
      ...prev,
      category: {
        ...prev.category,
        sectionContent: {
          ...prev.category.sectionContent,
          productCatgories: [],
        },
      },
    }));

    if (!formData.brandId) return;

    axios
      .get(
        `http://localhost:3000/api/productCategory?brandId=${formData.brandId}`,
      )
      .then((res) => setProductCategories(res.data.data || []))
      .catch((err) => console.error("Error fetching product category", err));

    return () => {
      setProductCategories([]);
    };
  }, [formData.brandId]);

  useEffect(() => {
    // Fetch articles for brand

    //Reset Options
    setArticles([]);
    //Reset FormData
    setFormData((prev) => ({
      ...prev,
      article: {
        ...prev.article,
        sectionContent: {
          ...prev.article.sectionContent,
          articles: [],
        },
      },
    }));

    if (!formData.brandId && !brands.length) return;

    axios
      .get(`http://localhost:3000/api/article?brandId=${formData.brandId}`)
      .then((res) => setArticles(res.data.data || []))
      .catch((err) => console.error("Error fetching article", err));

    return () => {
      setArticles([]);
    };
  }, [formData.brandId]);

  useEffect(() => {
    // Fetch products for brand

    //Reset Options
    setProducts([]);
    //Reset FormData
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        sectionContent: {
          ...prev.product.sectionContent,
          products: [],
        },
      },
    }));

    if (!formData.brandId) return;

    axios
      .get(`http://localhost:3000/api/products?brandId=${formData.brandId}`)
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => console.error("Error fetching product", err));

    return () => {
      setProducts([]);
    };
  }, [formData.brandId]);

  const brandOptions = brands.map((b) => ({
    value: b._id,
    label: b.brandName,
  }));
  const articleOptions = articles.map((a) => ({
    value: a._id,
    label: a.articleTitle,
  }));
  const productOptions = products.map((c) => ({
    value: c._id,
    label: c.productName,
  }));
  const productCategoryOptions = productCategories.map((c) => ({
    value: c._id,
    label: c.categoryTitle,
  }));

  const handleChange = (e, directValue) => {
    const name = typeof e === "string" ? e : e.target.name;
    const value = typeof e === "string" ? directValue : e.target.value;

    const keys = name.split(".");
    const isIndex = (k) => /^\d+$/.test(k);

    const cloneDeep = (current, keyIndex) => {
      if (keyIndex === keys.length - 1) return current;

      const key = keys[keyIndex];
      const nextKey = keys[keyIndex + 1];

      if (isIndex(nextKey)) {
        const arr = [...(current[key] || [])];
        arr[Number(nextKey)] = cloneDeep(
          { ...arr[Number(nextKey)] },
          keyIndex + 1,
        );
        return { ...current, [key]: arr };
      } else {
        return {
          ...current,
          [key]: cloneDeep({ ...current[key] }, keyIndex + 1),
        };
      }
    };

    setFormData((prev) => {
      const updated = cloneDeep(prev, 0);

      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = isIndex(keys[i]) ? Number(keys[i]) : keys[i];
        current = current[key];
      }

      const lastKey = isIndex(keys[keys.length - 1])
        ? Number(keys[keys.length - 1])
        : keys[keys.length - 1];
      current[lastKey] = value;

      return updated;
    });

    setFormErrors((prev) => {
      const updated = { ...prev };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) return prev;
        current[keys[i]] = Array.isArray(current[keys[i]])
          ? [...current[keys[i]]]
          : { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = "";
      return updated;
    });
  };

  const handleSubmit = async () => {
    const errors = validate(formData);

    console.log("errors");
    console.log(errors);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      showToast("Please fix the errors before submitting", "error");
      return;
    }

    try {
      // Upload single file
      const uploadSingle = async (file) => {
        // FileUpload always stores arrays — unwrap the first element
        const actual = Array.isArray(file) ? file[0] : file;

        if (!actual) return "";
        if (actual instanceof File) {
          const fd = new FormData();
          fd.append("file", actual);
          const res = await axios.post("http://localhost:3000/upload", fd);
          return res.data.filePath;
        }
        // Already a string path — return as-is
        if (typeof actual === "string") return actual;
        return "";
      };

      // Upload multiple files
      const uploadMultiple = async (arr) => {
        if (!arr?.length) return [];

        const resolved = await Promise.all(
          arr.map(async (f) => {
            if (f instanceof File) {
              const fd = new FormData();
              fd.append("file", f);
              const res = await axios.post("http://localhost:3000/upload", fd);
              return res.data.filePath;
            }
            if (typeof f === "string") return f; // already uploaded
            return null;
          }),
        );

        return resolved.filter(Boolean);
      };

      // Deep clone formData
      let payload = JSON.parse(
        JSON.stringify(formData, (key, val) =>
          val instanceof File ? null : val,
        ),
      );

      // hero.images — multiple
      payload.hero.sectionContent.images = await uploadMultiple(
        formData.hero.sectionContent.images,
      );

      // filter.image — single
      payload.filter.sectionContent.image = await uploadSingle(
        formData.filter.sectionContent.image,
      );

      // category button icon — single
      payload.category.sectionContent.button.icon = await uploadSingle(
        formData.category.sectionContent.button.icon,
      );

      // benefit image — single
      payload.benefit.sectionContent.image = await uploadSingle(
        formData.benefit.sectionContent.image,
      );

      // benefit button icon — single
      payload.benefit.sectionContent.button.icon = await uploadSingle(
        formData.benefit.sectionContent.button.icon,
      );

      // benefit cards — single image each
      payload.benefit.sectionContent.benefitCard = await Promise.all(
        formData.benefit.sectionContent.benefitCard.map(async (card) => ({
          ...card,
          image: await uploadSingle(card.image),
        })),
      );

      // banner image — single
      payload.banner.sectionContent.image = await uploadSingle(
        formData.banner.sectionContent.image,
      );

      // banner button icon — single
      payload.banner.sectionContent.button.icon = await uploadSingle(
        formData.banner.sectionContent.button.icon,
      );

      // about image — single
      payload.about.sectionContent.image = await uploadSingle(
        formData.about.sectionContent.image,
      );

      // about button icon — single
      payload.about.sectionContent.button.icon = await uploadSingle(
        formData.about.sectionContent.button.icon,
      );

      // testimonial cards — single image each
      payload.testimonial.sectionContent.testimonialCard = await Promise.all(
        formData.testimonial.sectionContent.testimonialCard.map(
          async (card) => ({
            ...card,
            image: await uploadSingle(card.image),
          }),
        ),
      );

      // article button icon — single
      payload.article.sectionContent.button.icon = await uploadSingle(
        formData.article.sectionContent.button.icon,
      );

      // callForAction image — single
      payload.callForAction.sectionContent.image = await uploadSingle(
        formData.callForAction.sectionContent.image,
      );

      // callForAction button icon — single
      payload.callForAction.sectionContent.button.icon = await uploadSingle(
        formData.callForAction.sectionContent.button.icon,
      );

      payload.companyId = selectedCompany._id;

      // Clean phantom keys from card arrays before submit
      const cleanCards = (arr) =>
        arr.map((card) => {
          const { ...rest } = card;
          // remove any numeric keys like "0", "1", "2"
          Object.keys(rest).forEach((k) => {
            if (/^\d+$/.test(k)) delete rest[k];
          });
          return rest;
        });

      payload.benefit.sectionContent.benefitCard = cleanCards(
        payload.benefit.sectionContent.benefitCard,
      );
      payload.testimonial.sectionContent.testimonialCard = cleanCards(
        payload.testimonial.sectionContent.testimonialCard,
      );

      console.log("payload");
      console.log(payload);

      const response = await axios.put(
        `http://localhost:3000/api/cms/${cmsId}`,
        payload,
      );
      showToast(response.data.message, "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Something went wrong", "error");
    }
  };
  // console.log(formData);
  return (
    <div className="grid gap-4">
      <Card
        title="Brand"
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="grid grid-cols-3">
          <SelectInput
            label="Brand"
            className=""
            options={brandOptions}
            value={brandOptions.find(
              (o) => o.value === formData.brandId || null,
            )}
            onChange={(opt) =>
              setFormData((p) => ({
                ...p,
                brandId: opt?.value,
              }))
            }
            placeholder="Choose..."
            error={formErrors.brandId}
            mandatory
          />
        </div>
      </Card>
      <Card
        title={formData.hero.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/hero.png`}
            alt="Hero Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>

        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="hero.sectionContent.title"
            className=""
            type="text"
            value={formData?.hero?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.hero?.sectionContent?.title}
            mandatory
          />
          <TextArea
            label="Content"
            name="hero.sectionContent.subtext"
            value={formData?.hero?.sectionContent?.subtext}
            onChange={handleChange}
            rows={3}
            placeholder="Description ..."
            error={formErrors?.hero?.sectionContent?.subtext}
            mandatory
          />

          <FileUpload
            label="Background Media"
            name="backgroundMedia"
            value={formData.hero.sectionContent.images || []}
            defaultImage={formData.hero.sectionContent.defaultImage ?? 0}
            onChange={({ fileList, defaultImage }) => {
              handleChange("hero.sectionContent.images", fileList);
              handleChange("hero.sectionContent.defaultImage", defaultImage);
            }}
            mandatory
            multiple
            acceptVideo
            error={formErrors?.hero?.sectionContent?.images}
          />
        </Card>
      </Card>
      <Card
        title={formData.filter.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/filter.png`}
            alt="Filter Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="filter.sectionContent.title"
            className=""
            type="text"
            value={formData?.filter?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.filter?.sectionContent?.title}
            mandatory
          />
          <TextArea
            label="Content"
            name="filter.sectionContent.subtext"
            value={formData?.filter?.sectionContent?.subtext}
            onChange={handleChange}
            rows={3}
            placeholder="Description ..."
            error={formErrors?.filter?.sectionContent?.subtext}
            mandatory
          />

          <FileUpload
            label="Background Media"
            name="filterMedia"
            value={formData.filter.sectionContent.image || []}
            defaultImage={0}
            onChange={({ fileList }) => {
              handleChange("filter.sectionContent.image", fileList);
            }}
            mandatory
            multiple={false}
            acceptVideo={false}
            error={formErrors?.filter?.sectionContent?.image}
          />
        </Card>
      </Card>
      <Card
        title={formData.category.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/category.png`}
            alt="Category Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="category.sectionContent.title"
            className=""
            type="text"
            value={formData?.category?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.category?.sectionContent?.title}
            mandatory
          />
          <TextArea
            label="Content"
            name="category.sectionContent.subtext"
            value={formData?.category?.sectionContent?.subtext}
            onChange={handleChange}
            rows={3}
            placeholder="Description ..."
            error={formErrors?.category?.sectionContent?.subtext}
            mandatory
          />

          <h1 className="">Product Categories</h1>
          <Select
            mode="multiple"
            placeholder="Please select"
            value={formData.category.sectionContent.productCatgories || []}
            onChange={(value) => {
              handleChange("category.sectionContent.productCatgories", value);
            }}
            options={productCategoryOptions}
            status={
              formErrors?.category?.sectionContent?.productCatgories
                ? "error"
                : ""
            }
          />
          {formErrors?.category?.sectionContent?.productCatgories && (
            <p className="text-red-500 text-xs font-medium ml-1">
              {formErrors?.category?.sectionContent?.productCatgories}
            </p>
          )}
          <ButtonSection
            sectionName="category"
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
          />
        </Card>
      </Card>
      <Card
        title={formData.filter.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/product.png`}
            alt="Product Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="product.sectionContent.title"
            className=""
            type="text"
            value={formData?.product?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.product?.sectionContent?.title}
            mandatory
          />
          <h1 className="">Products</h1>
          <Select
            mode="multiple"
            placeholder="Please select"
            value={formData.product.sectionContent.products || []}
            onChange={(value) => {
              handleChange("product.sectionContent.products", value);
            }}
            options={productOptions}
            status={
              formErrors?.product?.sectionContent?.products ? "error" : ""
            }
          />
          {formErrors?.product?.sectionContent?.products && (
            <p className="text-red-500 text-xs font-medium mt-0.5 ml-1">
              {formErrors?.product?.sectionContent?.products}
            </p>
          )}
        </Card>
      </Card>
      <Card
        title={formData.benefit.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/benefit.png`}
            alt="Benefit Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="benefit.sectionContent.title"
            className=""
            type="text"
            value={formData?.benefit?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.benefit?.sectionContent?.title}
            mandatory
          />
          <TextArea
            label="Content"
            name="benefit.sectionContent.subtext"
            value={formData?.benefit?.sectionContent?.subtext}
            onChange={handleChange}
            rows={3}
            placeholder="Description ..."
            error={formErrors?.benefit?.sectionContent?.subtext}
            mandatory
          />
          <FileUpload
            label="Background Image"
            name="image"
            value={formData.benefit.sectionContent.image || []}
            defaultImage={0}
            onChange={({ fileList }) => {
              handleChange("benefit.sectionContent.image", fileList);
            }}
            mandatory
            multiple={false}
            acceptVideo={false}
            error={formErrors?.benefit?.sectionContent?.image}
          />
          {formData.benefit.sectionContent.benefitCard.map((card, index) => (
            <Card
              index={index}
              title={`Benefit Card - ${index + 1}`}
              titleStyle="text-lg font-semibold mb-2 pb-2"
              onDelete={() => {
                const updated =
                  formData.benefit.sectionContent.benefitCard.filter(
                    (_, i) => i !== index,
                  );
                handleChange("benefit.sectionContent.benefitCard", updated);
              }}
              hasDelete={
                formData.benefit.sectionContent.benefitCard.length != 1
              }
            >
              <InputField
                label="Title"
                name={`benefit.sectionContent.benefitCard.${index}.title`}
                type="text"
                value={card.title}
                onChange={handleChange}
                placeholder="Enter Title"
                error={
                  formErrors?.benefit?.sectionContent?.benefitCard?.[index]
                    ?.title
                }
                mandatory
              />
              <TextArea
                label="Content"
                name={`benefit.sectionContent.benefitCard.${index}.subtext`}
                value={card.subtext}
                onChange={handleChange}
                rows={3}
                placeholder="Description ..."
                error={
                  formErrors?.benefit?.sectionContent?.benefitCard?.[index]
                    ?.subtext
                }
                mandatory
              />
              <FileUpload
                label="Card Image"
                name={`benefitCard-${index}-image`}
                value={card.image || []}
                defaultImage={0}
                onChange={({ fileList }) => {
                  handleChange(
                    `benefit.sectionContent.benefitCard.${index}.image`,
                    fileList,
                  );
                }}
                mandatory
                multiple={false}
                acceptVideo={false}
                error={
                  formErrors?.benefit?.sectionContent?.benefitCard?.[index]
                    ?.image
                }
              />
            </Card>
          ))}

          <button
            type="button"
            onClick={() => {
              const updated = [
                ...formData.benefit.sectionContent.benefitCard,
                { title: "", subtext: "", image: [] },
              ];
              handleChange("benefit.sectionContent.benefitCard", updated);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
          >
            + Add Benefit Card
          </button>

          <ButtonSection
            sectionName="benefit"
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
          />
        </Card>
      </Card>

      <Card
        title={formData.banner?.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/banner.png`}
            alt="Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="banner.sectionContent.title"
            className=""
            type="text"
            value={formData?.banner?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.banner?.sectionContent?.title}
            mandatory
          />
          <TextArea
            label="Content"
            name="banner.sectionContent.subtext"
            value={formData?.banner?.sectionContent?.subtext}
            onChange={handleChange}
            rows={3}
            placeholder="Description ..."
            error={formErrors?.banner?.sectionContent?.subtext}
            mandatory
          />
          <FileUpload
            label="Background Image"
            name="image"
            value={formData.banner.sectionContent.image || []}
            defaultImage={0}
            onChange={({ fileList }) => {
              handleChange("banner.sectionContent.image", fileList);
            }}
            mandatory
            multiple={false}
            acceptVideo={false}
            error={formErrors?.banner?.sectionContent?.image}
          />

          <ButtonSection
            sectionName="banner"
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
          />
        </Card>
      </Card>
      <Card
        title={formData.about?.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/about.png`}
            alt="About Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="about.sectionContent.title"
            className=""
            type="text"
            value={formData?.about?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.about?.sectionContent?.title}
            mandatory
          />
          <TextArea
            label="Content"
            name="about.sectionContent.subtext"
            value={formData?.about?.sectionContent?.subtext}
            onChange={handleChange}
            rows={3}
            placeholder="Description ..."
            error={formErrors?.about?.sectionContent?.subtext}
            mandatory
          />
          <FileUpload
            label="Background Image"
            name="image"
            value={formData.about.sectionContent.image || []}
            defaultImage={0}
            onChange={({ fileList }) => {
              handleChange("about.sectionContent.image", fileList);
            }}
            mandatory
            multiple={false}
            acceptVideo={false}
            error={formErrors?.about?.sectionContent?.image}
          />

          <ButtonSection
            sectionName="about"
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
          />
        </Card>
      </Card>
      <Card
        title={formData.testimonial.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/testimonial.png`}
            alt="Testimonial Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="testimonial.sectionContent.title"
            className=""
            type="text"
            value={formData?.testimonial?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.testimonial?.sectionContent?.title}
            mandatory
          />

          {formData?.testimonial?.sectionContent?.testimonialCard.map(
            (card, index) => (
              <Card
                index={index}
                title={`Testimonial Card - ${index + 1}`}
                titleStyle="text-lg font-semibold mb-2 pb-2"
                cardStyle=""
                onDelete={() => {
                  const updated =
                    formData.testimonial.sectionContent.testimonialCard.filter(
                      (_, i) => i !== index,
                    );
                  handleChange(
                    "testimonial.sectionContent.testimonialCard",
                    updated,
                  );
                }}
                hasDelete={
                  formData.testimonial.sectionContent.testimonialCard.length !=
                  1
                }
              >
                <InputField
                  label="Name"
                  name={`testimonial.sectionContent.testimonialCard.${index}.name`}
                  className=""
                  type="text"
                  value={card.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  error={
                    formErrors?.testimonial?.sectionContent?.testimonialCard?.[
                      index
                    ]?.name
                  }
                  mandatory
                />
                <InputField
                  label="Location"
                  name={`testimonial.sectionContent.testimonialCard.${index}.location`}
                  className=""
                  type="text"
                  value={card.location}
                  onChange={handleChange}
                  placeholder="Enter Location"
                  error={
                    formErrors?.testimonial?.sectionContent?.testimonialCard?.[
                      index
                    ]?.location
                  }
                  mandatory
                />
                <TextArea
                  label="Review"
                  name={`testimonial.sectionContent.testimonialCard.${index}.review`}
                  value={card.review}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Description ..."
                  error={
                    formErrors?.testimonial?.sectionContent?.testimonialCard?.[
                      index
                    ]?.review
                  }
                  mandatory
                />
                <FileUpload
                  label="Card Image"
                  name={`testimonialCard-${index}-image`}
                  value={card.image || []}
                  defaultImage={0}
                  onChange={({ fileList }) => {
                    handleChange(
                      `testimonial.sectionContent.testimonialCard.${index}.image`,
                      fileList,
                    );
                  }}
                  mandatory
                  multiple={false}
                  acceptVideo={false}
                  error={
                    formErrors?.testimonial?.sectionContent?.testimonialCard?.[
                      index
                    ]?.image
                  }
                />
              </Card>
            ),
          )}
          <button
            type="button"
            onClick={() => {
              const updated = [
                ...formData.testimonial.sectionContent.testimonialCard,
                { name: "", location: "", image: [], review: "" },
              ];
              handleChange(
                "testimonial.sectionContent.testimonialCard",
                updated,
              );
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
          >
            + Add Testimonial Card
          </button>
        </Card>
      </Card>
      <Card
        title={formData.article.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/article.png`}
            alt="Article Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="article.sectionContent.title"
            className=""
            type="text"
            value={formData?.article?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.article?.sectionContent?.title}
            mandatory
          />

          <h1 className="">Articles </h1>
          <Select
            mode="multiple"
            placeholder="Please select"
            value={formData.article.sectionContent.articles || []}
            onChange={(value) => {
              handleChange("article.sectionContent.articles", value);
            }}
            options={articleOptions}
            status={
              formErrors?.article?.sectionContent?.articles ? "error" : ""
            }
          />
          {formErrors?.article?.sectionContent?.articles && (
            <p className="text-red-500 text-xs font-medium mt-0.5 ml-1">
              {formErrors?.article?.sectionContent?.articles}
            </p>
          )}
          <ButtonSection
            sectionName="article"
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
          />
        </Card>
      </Card>
      <Card
        title={formData.callForAction?.sectionName}
        titleStyle="text-lg font-semibold mb-2 pb-2"
        cardStyle=""
      >
        <div className="p-2">
          <AntImage
            src={`http://localhost:3000/public/cms/callForAction.png`}
            alt="Call For Action Banner Preview"
            className="rounded-lg"
            style={{
              width: "auto",
              height: "",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </div>
        <Card className=" grid grid-cols-1 gap-4 ">
          <InputField
            label="Title"
            name="callForAction.sectionContent.title"
            className=""
            type="text"
            value={formData?.callForAction?.sectionContent?.title}
            onChange={handleChange}
            placeholder="Enter Title"
            error={formErrors?.callForAction?.sectionContent?.title}
            mandatory
          />
          <TextArea
            label="Content"
            name="callForAction.sectionContent.subtext"
            value={formData?.callForAction?.sectionContent?.subtext}
            onChange={handleChange}
            rows={3}
            placeholder="Description ..."
            error={formErrors?.callForAction?.sectionContent?.subtext}
            mandatory
          />
          <FileUpload
            label="Background Image"
            name="image"
            value={formData.callForAction.sectionContent.image || []}
            defaultImage={0}
            onChange={({ fileList }) => {
              handleChange("callForAction.sectionContent.image", fileList);
            }}
            mandatory
            multiple={false}
            acceptVideo={false}
            error={formErrors?.callForAction?.sectionContent?.image}
          />

          <ButtonSection
            sectionName="callForAction"
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
          />
        </Card>
      </Card>
      <div className=" flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CMS;
