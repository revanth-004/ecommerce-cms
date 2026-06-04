import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import SelectInput from "../../components/form/input/SelectInput.jsx";
import FormCard from "../../components/form/form-ui/FormCard.jsx";
import InputField from "../../components/form/input/InputField.jsx";

const initialState = {
  companyId: "",
  brandId: "",
  articleCategoryId: "",
  articleTitle: "",
  articleContent: "",
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ font: [] }],
    [{ size: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["image"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "link",
  "image",
  "color",
  "background",
  "align",
];

const ArticleForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [articleData, setArticleData] = useState("");
  const [brands, setBrands] = useState([]);
  const [articleCategory, setArticleCategory] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  // Fetch article data if editing
  useEffect(() => {
    if (!isEdit) return;

    axios
      .get(`http://localhost:3000/api/article/${id}`)
      .then((res) => {
        setFormData(res.data.data);
        setArticleData(res.data.data.articleContent || "");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch brands when company changes
  useEffect(() => {
    if (!selectedCompany) return setBrands([]);

    // Don't reset brandId on edit — preserve the fetched value
    if (!isEdit) {
      setFormData((prev) => ({ ...prev, brandId: "" }));
    }

    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data))
      .catch((err) => console.error("Error fetching brands", err));

    return () => setBrands([]);
  }, [selectedCompany?._id]);

  // Fetch articleCategory when company changes
  useEffect(() => {
    if (!formData.brandId) return setArticleCategory([]);

    axios
      .get(
        `http://localhost:3000/api/articleCategory?brandId=${formData.brandId}`,
      )
      .then((res) => setArticleCategory(res.data.data))
      .catch((err) => console.error("Error fetching article categories", err));

    return () => setArticleCategory([]);
  }, [formData.brandId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      companyId: selectedCompany._id,
      articleContent: articleData,
    };

    try {
      const response = isEdit
        ? await axios.put(`http://localhost:3000/api/article/${id}`, payload)
        : await axios.post(`http://localhost:3000/api/article`, payload);

      showToast(response.data.message, "success");
      navigate("/articles");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to save article";
      showToast(message, "error");
    }
  };

  const brandOptions = brands.map((b) => ({
    value: b._id,
    label: b.brandName,
  }));

  const articleCategoryOptions = articleCategory.map((c) => ({
    value: c._id,
    label: c.articleCategoryTitle,
  }));

  console.log(formData);

  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormCard title={isEdit ? "Edit Article" : "Create Article"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Brand"
            options={brandOptions}
            value={
              brandOptions.find((o) => o.value === formData.brandId) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({ ...p, brandId: opt?.value }))
            }
            placeholder="Choose..."
            error={formErrors.brandId}
            mandatory
          />
          <SelectInput
            label="Article Category"
            options={articleCategoryOptions}
            value={
              articleCategoryOptions.find(
                (o) => o.value === formData.articleCategoryId,
              ) || null
            }
            onChange={(opt) =>
              setFormData((p) => ({ ...p, articleCategoryId: opt?.value }))
            }
            placeholder="Choose..."
            error={formErrors.articleCategoryId}
            mandatory
          />
          <InputField
            label="Article Title"
            name="articleTitle"
            type="text"
            value={formData.articleTitle}
            onChange={handleChange}
            placeholder="Enter Article Title"
            error={formErrors.articleTitle}
            mandatory
          />
          <div className="col-span-2">
            <ReactQuill
              theme="snow"
              value={articleData}
              onChange={setArticleData}
              modules={modules}
              formats={formats}
              className="mb-14"
              style={{ height: "400px" }}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/articles")}
            className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
          >
            {isEdit ? "Save Changes" : "+ Add"}
          </button>
        </div>
      </FormCard>
    </form>
  );
};

export default ArticleForm;
