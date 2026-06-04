import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
// import { validate } from "../../utils/articleValidation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchCompanies } from "../../features/company/companySlice";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import SelectInput from "../../components/form/input/SelectInput.jsx";
import FormCard from "../../components/form/form-ui/FormCard.jsx";
import FormLabel from "../../components/form/form-ui/FormLabel";
import InputField from "../../components/form/input/InputField.jsx";

const initialState = {
  companyId: "",
  brandId: "",
  articleTitle: "",
  articleContent: "",
};

const CreateArticles = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const [articleData, setArticleData] = useState("");

  const dispatch = useAppDispatch();

  //useEffect
  useEffect(() => {
    // Fetch brands for company
    if (!selectedCompany)
      return () => {
        setBrands([]);
      };

    setFormData((prev) => ({
      ...prev,
      brandId: "",
    }));

    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => setBrands(res.data.data))
      .catch((err) => console.error("Error fetching brands", err));

    return () => {
      setBrands([]);
    };
  }, [selectedCompany?._id]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      ...formData,
      companyId: selectedCompany._id,
      articleContent: articleData,
    };
    try {
      const response = await axios.post(
        `http://localhost:3000/api/article`,
        payload,
      );

      showToast(response.data.message, "success");
      navigate("/articles");
    } catch (err) {
      let message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create an articles ";
      showToast(message, "error");
    }
  };
  const brandOptions = brands.map((b) => ({
    value: b._id,
    label: b.brandName,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormCard title="Article Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <InputField
            label="Article Title"
            name="articleTitle"
            type="text"
            value={formData?.articleTitle}
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
              className="mb-14 "
              style={{ height: "400px" }}
            />
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95"
          >
            + Add
          </button>
        </div>
      </FormCard>
    </form>
  );
};

export default CreateArticles;
