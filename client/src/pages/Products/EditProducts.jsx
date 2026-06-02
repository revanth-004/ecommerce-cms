import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import EditProductForm from "../../components/form/EditProductForm";
import { validate } from "../../utils/productValidation.js";
import { useToast } from "../../context/ToastContext.jsx";

const EditProducts = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const uploadMedia = async (ps) => {
    const files = (ps.productMedia || []).filter((m) => m instanceof File);
    if (!files.length) return ps;

    const formMedia = new FormData();
    files.forEach((f) => formMedia.append("files", f));
    const res = await axios.post(
      "http://localhost:3000/upload/multiple",
      formMedia,
    );
    const uploadedPaths = res.data.files.map((f) => f.filePath);
    let uploadIndex = 0;
    const resolvedMedia = (ps.productMedia || []).map((m) =>
      m instanceof File ? uploadedPaths[uploadIndex++] : m,
    );
    return {
      ...ps,
      productMedia: resolvedMedia,
    };
  };

  // load product
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/${id}`)
      .then((res) => {
        const data = res.data.data;
        // console.log(data);

        setFormData({
          ...data,
          productSpecifications: data.productSpecifications?.length
            ? data.productSpecifications.map((ps) => ({
                ...ps,
                specifications:
                  Array.isArray(ps.specifications) && ps.specifications.length
                    ? ps.specifications
                    : [
                        {
                          specificationId: "",
                          specificationDetailId: "",
                        },
                      ],
              }))
            : [
                {
                  specifications: [
                    {
                      specificationId: "",
                      specificationDetailId: "",
                    },
                  ],
                  productPrice: "",
                  productSellingPrice: "",
                  tax: "",
                  hsn: "",
                  productMedia: [],
                  defaultMedia: "",
                  productStock: 0,
                  isActive: true,
                },
              ],
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast("Check input fields ", "warning");
      return;
    }

    const resolvedSpecs = await Promise.all(
      formData.productSpecifications.map(async (ps) => {
        const resolved = await uploadMedia(ps);
        return {
          ...resolved,
          specifications: ps.specifications.filter(
            (s) => s.specificationId && s.specificationDetailId,
          ),
        };
      }),
    );

    const sellerFiles = (formData.productSeller?.sellerMedia || []).filter(
      (m) => m instanceof File,
    );
    let resolvedSellerMedia = formData.productSeller?.sellerMedia || [];
    if (sellerFiles.length) {
      const fd = new FormData();
      sellerFiles.forEach((f) => fd.append("files", f));
      const res = await axios.post("http://localhost:3000/upload/multiple", fd);
      const uploadedPaths = res.data.files.map((f) => f.filePath);
      let uploadIndex = 0;
      resolvedSellerMedia = resolvedSellerMedia.map((m) =>
        m instanceof File ? uploadedPaths[uploadIndex++] : m,
      );
    }

    try {
      const payload = {
        ...formData,
        productSpecifications: resolvedSpecs,
        productSeller: {
          ...formData.productSeller,
          sellerMedia: resolvedSellerMedia,
        },
      };

      console.log(payload);

      const response = await axios.put(
        `http://localhost:3000/api/products/${id}`,
        payload,
      );

      showToast(response.data.message, "success");
      navigate("/products");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <EditProductForm
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/products")}
        />
      </div>
    </div>
  );
};

export default EditProducts;
