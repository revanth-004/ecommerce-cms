import React from "react";
import InputField from "./input/InputField";
import FileInput from "./input/FileInput";
import TextArea from "./input/TextArea";
import SelectInput from "./input/SelectInput";
import FormLabel from "./form-ui/FormLabel";
import FormCard from "./form-ui/FormCard";
import CascadingSelectInput from "./input/CascadingSelectInput";
import { useState, useEffect, useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import axios from "axios";
import { useToast } from "../../context/ToastContext.jsx";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedCompany } from "../../features/company/companySelectors";

const EditProductForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  onCancel,
}) => {
  const { showToast } = useToast();
  const selectedCompany = useAppSelector(selectSelectedCompany);

  //Dropdown values
  const [brandOptions, setBrandOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [hsnOptions, setHsnOptions] = useState([]);
  const [sellerOptions, setSellerOptions] = useState([]);

  const brand = brandOptions.find((b) => b.value === formData?.brandId) || null;
  const category =
    categoryOptions.find((c) => c.value === formData?.productCategoryId) ||
    null;

  const seller =
    sellerOptions.find((s) => s.value === formData?.productSeller?.sellerId) ||
    null;

  const [specificationOptions, setSpecificationOptions] = useState([]);
  const [specificationDetailOptions, setSpecificationDetailOptions] = useState(
    {},
  );

  const [currentTag, setCurrentTag] = useState();

  //useEffect
  useEffect(() => {
    if (!selectedCompany) return;
    setFormData((prev) => ({
      ...prev,
      brandId: "",
      productCategoryId: "",
    }));

    axios
      .get(`http://localhost:3000/api/brands?companyId=${selectedCompany._id}`)
      .then((res) => {
        const options = res.data.data.map((b) => ({
          label: b.brandName,
          value: b._id,
        }));

        setBrandOptions(options);
      })
      .catch(console.error);
  }, [selectedCompany]);

  useEffect(() => {
    if (!selectedCompany?._id || !formData?.brandId) return;

    setCategoryOptions([]);

    axios
      .get(
        `http://localhost:3000/api/productCategory?companyId=${selectedCompany._id}&brandId=${formData.brandId}`,
      )
      .then((res) => {
        const options = res.data.data.map((b) => ({
          label: b.categoryTitle,
          value: b._id,
        }));
        setCategoryOptions(options);
      })
      .catch(console.error);
  }, [selectedCompany, formData?.brandId]);

  useEffect(() => {
    if (!selectedCompany) return;

    axios
      .get(`http://localhost:3000/api/taxes?companyId=${selectedCompany._id}`)
      .then((res) => {
        const options = res.data.data.map((b) => ({
          label: b.taxName,
          value: b._id,
        }));
        setTaxOptions(options);
      })
      .catch(console.error);
  }, [selectedCompany]);

  useEffect(() => {
    if (!selectedCompany) return;

    axios
      .get(`http://localhost:3000/api/hsn?companyId=${selectedCompany._id}`)
      .then((res) => {
        const options = res.data.data.map((b) => ({
          label: b.hsnName,
          value: b._id,
        }));
        setHsnOptions(options);
      })
      .catch(console.error);
  }, [selectedCompany]);

  useEffect(() => {
    if (!selectedCompany) return;

    axios
      .get(`http://localhost:3000/api/sellers`)
      .then((res) => {
        const options = res.data.data.map((b) => ({
          label: b.sellerName,
          value: b._id,
        }));
        setSellerOptions(options);
      })
      .catch(console.error);
  }, [selectedCompany]);

  useEffect(() => {
    if (!formData?.productSpecifications) return;
    formData.productSpecifications.forEach((ps, specIndex) => {
      (ps.specifications || []).forEach((spec, rowIndex) => {
        if (!spec.specificationId) return;
        const key = `${specIndex}-${rowIndex}`;
        if (specificationDetailOptions[key]?.length) return; // already loaded
        axios
          .get(
            `http://localhost:3000/api/specificationDetail?specificationId=${spec.specificationId}`,
          )
          .then((res) => {
            const options = res.data.data.map((d) => ({
              label: d.specificationDetail,
              value: d._id,
            }));
            setSpecificationDetailOptions((prev) => ({
              ...prev,
              [key]: options,
            }));
          })
          .catch(console.error);
      });
    });
  }, [formData?.productSpecifications]);

  //Dropdown handleChange
  const handleBrandChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      brandId: selectedOption?.value || "",
      productCategoryId: "",
      productSpecifications: [
        {
          specifications: [
            {
              specificationId: "",
              specificationDetailId: "",
            },
          ],
        },
      ],
    }));
    setCategoryOptions([]);
    setSpecificationOptions([]);
    setSpecificationDetailOptions({});
    if (formErrors.brandId) setFormErrors((prev) => ({ ...prev, brandId: "" }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      productCategoryId: selectedOption?.value || "",
    }));
    if (formErrors.productCategoryId)
      setFormErrors((prev) => ({ ...prev, productCategoryId: "" }));
  };

  const handleTaxChange = (specIndex, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.map((ps, i) =>
        i === specIndex ? { ...ps, tax: selectedOption?.value || "" } : ps,
      ),
    }));
  };

  const handleHsnChange = (specIndex, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.map((ps, i) =>
        i === specIndex ? { ...ps, hsn: selectedOption?.value || "" } : ps,
      ),
    }));
  };

  const handleSellerChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      productSeller: {
        ...prev.productSeller,
        sellerId: selectedOption?.value || "",
      },
    }));
  };

  // Media
  const handleSetDefault = (specIndex, index) => {
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.map((ps, i) =>
        i === specIndex ? { ...ps, defaultMedia: index } : ps,
      ),
    }));
  };

  const handleRemoveMedia = (specIndex, index) => {
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.map((ps, i) => {
        if (i !== specIndex) return ps;
        const updated = ps.productMedia.filter((_, j) => j !== index);
        const currentDefault = ps.defaultMedia ?? 0;
        const newDefault =
          index === currentDefault
            ? 0 // removed the default, reset to first
            : index < currentDefault
              ? currentDefault - 1 // shift index down if removed before it
              : currentDefault; // unaffected
        return {
          ...ps,
          productMedia: updated,
          defaultMedia: updated.length ? newDefault : 0,
        };
      }),
    }));
  };
  const handleRemoveSellerMedia = (index) => {
    setFormData((prev) => {
      const updated = prev.productSeller.bannerMedia.filter(
        (_, i) => i !== index,
      );
      const cur = prev.productSeller.defaultMedia ?? 0;
      const newDefault = index === cur ? 0 : index < cur ? cur - 1 : cur;
      return {
        ...prev,
        productSeller: {
          ...prev.productSeller,
          bannerMedia: updated,
          defaultMedia: updated.length ? newDefault : 0,
        },
      };
    });
  };

  //Product Specifications
  useEffect(() => {
    setSpecificationOptions([]);
    setSpecificationDetailOptions({});

    if (!formData?.brandId) return;

    axios
      .get(
        `http://localhost:3000/api/specification?brandId=${formData.brandId}`,
      )
      .then((res) => {
        const options = res.data.data.map((s) => ({
          label: s.specificationName,
          value: s._id,
        }));
        setSpecificationOptions(options);
      })
      .catch(console.error);
  }, [formData?.brandId]);

  const handleAddProductSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      productSpecifications: [
        ...(prev.productSpecifications || []),
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
    }));
  };

  const handleDeleteProductSpecification = (specIndex) => {
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.filter(
        (_, i) => i !== specIndex,
      ),
    }));
  };

  const handleAddSpecification = (specIndex) => {
    const currentSpecs =
      formData.productSpecifications?.[specIndex]?.specifications || [];
    const lastRow = currentSpecs[currentSpecs.length - 1];

    if (!lastRow?.specificationId || !lastRow?.specificationDetailId) {
      showToast("This Specification Details are Empty", "warning");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.map((ps, i) =>
        i === specIndex
          ? {
              ...ps,
              specifications: [
                ...ps.specifications,
                {
                  specificationId: "",
                  specificationDetailId: "",
                },
              ],
            }
          : ps,
      ),
    }));
  };
  const handleSpecificationChange = async (
    specIndex,
    rowIndex,
    selectedOption,
  ) => {
    // console.log("changing", specIndex, rowIndex, selectedOption);
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.map((ps, i) =>
        i === specIndex
          ? {
              ...ps,
              specifications: ps.specifications.map((s, j) =>
                j === rowIndex
                  ? {
                      specificationId: selectedOption?.value || "",
                      specificationDetailId: "",
                    }
                  : s,
              ),
            }
          : ps,
      ),
    }));

    const key = `${specIndex}-${rowIndex}`;
    setSpecificationDetailOptions((prev) => ({ ...prev, [key]: [] }));

    if (!selectedOption?.value) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/specificationDetail?specificationId=${selectedOption.value}`,
      );
      const options = res.data.data.map((d) => ({
        label: d.specificationDetail,
        value: d._id,
      }));
      setSpecificationDetailOptions((prev) => ({ ...prev, [key]: options }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpecificationDetailChange = (
    specIndex,
    rowIndex,
    selectedOption,
  ) => {
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.map((ps, i) =>
        i === specIndex
          ? {
              ...ps,
              specifications: ps.specifications.map((s, j) =>
                j === rowIndex
                  ? {
                      ...s,
                      specificationDetailId: selectedOption?.value || "",
                    }
                  : s,
              ),
            }
          : ps,
      ),
    }));
  };

  const handleRemoveSpecification = (specIndex, rowIndex) => {
    setFormData((prev) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.map((ps, i) =>
        i === specIndex
          ? {
              ...ps,
              specifications: ps.specifications.filter(
                (_, j) => j !== rowIndex,
              ),
            }
          : ps,
      ),
    }));
    const key = `${specIndex}-${rowIndex}`;
    setSpecificationDetailOptions((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const addTag = (e) => {
    e.preventDefault();
    const trimmedTag = currentTag?.trim();
    if (!trimmedTag) return;
    const currentTags = formData.productTags || [];
    if (currentTags.includes(trimmedTag)) {
      showToast("This tag already exists", "warning");
      setCurrentTag("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      productTags: [...(prev.productTags || []), trimmedTag],
    }));
    setCurrentTag("");
  };
  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      productTags: prev.productTags.filter((_, i) => i !== index),
    }));
  };

  // General
  const handleChange = (e) => {
    const { name, value } = e.target;

    const seoFields = [
      "metaKeyword",
      "metaDescription",
      "h1",
      "h2",
      "h3",
      "h4",
    ];
    const measurementFields = ["length", "width", "height", "breadth"];

    if (seoFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        productSEO: { ...prev.productSEO, [name]: value },
      }));
    } else if (measurementFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        productMeasurements: { ...prev.productMeasurements, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  // console.log("===========================");
  // console.log(formData);
  if (!formData) {
    return <div className="text-sm text-gray-400">Loading ...</div>;
  }
  console.log(formErrors);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormCard title="Product Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Product Name"
            name="productName"
            type="text"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            error={formErrors.productName}
            mandatory
          />

          <SelectInput
            label="Brand"
            options={brandOptions}
            value={brand}
            onChange={handleBrandChange}
            placeholder="Search brand..."
            error={formErrors.brandId}
            mandatory
          />
          <SelectInput
            label="Product Category"
            options={categoryOptions}
            value={category}
            onChange={handleCategoryChange}
            placeholder="Search Category..."
            error={formErrors.productCategoryId}
            mandatory
          />

          <TextArea
            label="Product Description"
            name="productDescription"
            value={formData.productDescription}
            onChange={(e) => {
              setFormData((p) => ({
                ...p,
                productDescription: e.target.value,
              }));
              setFormErrors((p) => ({ ...p, productDescription: "" }));
            }}
            rows={5}
            placeholder="Description ..."
            error={formErrors.productDescription}
            mandatory
          />
        </div>
      </FormCard>
      <FormCard
        title={
          <div className="flex gap-4 items-center">
            <p>Product Specification</p>
            <button
              type="button"
              onClick={handleAddProductSpecification}
              className="flex gap-2 px-4 py-1 text-white bg-(--color-primary) rounded-md font-medium text-sm cursor-pointer"
            >
              Add
              <PlusOutlined
                style={{ fontSize: "16px" }}
                className="opacity-40"
              />
            </button>
          </div>
        }
      >
        {(formData.productSpecifications || []).map((ps, specIndex) => {
          const specTax = taxOptions.find((t) => t.value === ps.tax) || null;
          const specHsn = hsnOptions.find((h) => h.value === ps.hsn) || null;

          return (
            <FormCard
              key={specIndex}
              title={
                <div className="flex justify-between items-center">
                  <p>Product Specification - {specIndex + 1}</p>
                  {formData?.productSpecifications?.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteProductSpecification(specIndex)
                      }
                      className="flex gap-2 px-4 py-1 text-white bg-red-400 border border-(--border-color) rounded-md font-medium text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <FormLabel title="Specification" mandatory />
                  <button
                    type="button"
                    onClick={() => handleAddSpecification(specIndex)}
                    className="flex gap-2 px-4 py-1 text-white bg-(--color-primary) border border-(--border-color) rounded-md font-medium text-sm cursor-pointer w-fit"
                  >
                    Add Specification
                    <PlusOutlined
                      style={{ fontSize: "16px" }}
                      className="opacity-40"
                    />
                  </button>

                  {(ps.specifications?.length > 0
                    ? [...ps.specifications].reverse()
                    : [
                        {
                          specificationId: "",
                          specificationDetailId: "",
                        },
                      ]
                  ).map((spec, reversedIndex) => {
                    const rowIndex =
                      (ps.specifications.length || 1) - 1 - reversedIndex;
                    const key = `${specIndex}-${rowIndex}`;
                    const excludedIds = (ps.specifications || [])
                      .filter((_, j) => j !== rowIndex)
                      .map((s) => s.specificationId)
                      .filter(Boolean);
                    const availableSpecOptions = specificationOptions.filter(
                      (opt) => !excludedIds.includes(opt.value),
                    );
                    return (
                      <div key={rowIndex} className="flex items-center gap-2">
                        <p className="">{reversedIndex + 1}</p>
                        <CascadingSelectInput
                          mandatory
                          showDelete={ps.specifications.length > 1}
                          onDelete={() =>
                            handleRemoveSpecification(specIndex, rowIndex)
                          }
                          firstPlaceholder="Select Specification"
                          firstOptions={availableSpecOptions}
                          firstValue={
                            spec.specificationId
                              ? {
                                  label:
                                    specificationOptions.find(
                                      (o) => o.value === spec.specificationId,
                                    )?.label || spec.specificationId,
                                  value: spec.specificationId,
                                }
                              : null
                          }
                          onFirstChange={(opt) =>
                            handleSpecificationChange(specIndex, rowIndex, opt)
                          }
                          secondPlaceholder="Select Details"
                          secondOptions={specificationDetailOptions[key] || []}
                          secondValue={
                            spec.specificationDetailId
                              ? {
                                  label:
                                    (
                                      specificationDetailOptions[key] || []
                                    ).find(
                                      (o) =>
                                        o.value === spec.specificationDetailId,
                                    )?.label || spec.specificationDetailId,
                                  value: spec.specificationDetailId,
                                }
                              : null
                          }
                          onSecondChange={(opt) =>
                            handleSpecificationDetailChange(
                              specIndex,
                              rowIndex,
                              opt,
                            )
                          }
                          secondDisabled={!spec.specificationId}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-4">
                  <InputField
                    label="Product MRP Price"
                    name={`price-${specIndex}`}
                    type="number"
                    value={ps.productPrice || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        productSpecifications: prev.productSpecifications.map(
                          (p, i) =>
                            i === specIndex
                              ? { ...p, productPrice: e.target.value }
                              : p,
                        ),
                      }))
                    }
                    placeholder="Enter product Price"
                    error={
                      formErrors?.productSpecifications?.[specIndex]
                        ?.productPrice
                    }
                    mandatory
                  />
                  <InputField
                    label="Product Selling Price"
                    name={`selling-price-${specIndex}`}
                    type="number"
                    value={ps.productSellingPrice || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        productSpecifications: prev.productSpecifications.map(
                          (p, i) =>
                            i === specIndex
                              ? {
                                  ...p,
                                  productSellingPrice: e.target.value,
                                }
                              : p,
                        ),
                      }))
                    }
                    placeholder="Enter product Price"
                    error={
                      formErrors?.productSpecifications?.[specIndex]
                        ?.productSellingPrice
                    }
                    mandatory
                  />
                  <InputField
                    label="Product Stock"
                    name={`stock-${specIndex}`}
                    type="number"
                    value={ps.productStock || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        productSpecifications: prev.productSpecifications.map(
                          (p, i) =>
                            i === specIndex
                              ? { ...p, productStock: e.target.value }
                              : p,
                        ),
                      }))
                    }
                    placeholder="Enter Product Stock"
                    error={
                      formErrors?.productSpecifications?.[specIndex]
                        ?.productStock
                    }
                  />
                  <SelectInput
                    label="Tax"
                    options={taxOptions}
                    value={specTax}
                    onChange={(opt) => handleTaxChange(specIndex, opt)}
                    placeholder="Search Tax..."
                    error={formErrors?.productSpecifications?.[specIndex]?.tax}
                    mandatory
                  />
                  <SelectInput
                    label="HSN"
                    options={hsnOptions}
                    value={specHsn}
                    onChange={(opt) => handleHsnChange(specIndex, opt)}
                    placeholder="Search Hsn..."
                    error={formErrors?.productSpecifications?.[specIndex]?.hsn}
                    mandatory
                  />
                  <div className="flex gap-4">
                    <Switch
                      checked={ps.isActive ?? true}
                      onChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          productSpecifications: prev.productSpecifications.map(
                            (p, i) =>
                              i === specIndex ? { ...p, isActive: checked } : p,
                          ),
                        }))
                      }
                    />
                    <p>{(ps.isActive ?? true) ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <FileInput
                  label="Product Media"
                  name={`productMedia-${specIndex}`}
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;
                    setFormData((prev) => ({
                      ...prev,
                      productSpecifications: prev.productSpecifications.map(
                        (ps, i) => {
                          if (i !== specIndex) return ps;

                          const updated = [
                            ...(ps.productMedia || []),
                            ...files,
                          ];
                          return {
                            ...ps,
                            productMedia: updated,
                            defaultMedia: ps.defaultMedia ?? 0,
                          };
                        },
                      ),
                    }));
                  }}
                  mandatory
                  multiple={true}
                  error={
                    formErrors?.productSpecifications?.[specIndex]?.productMedia
                  }
                  acceptVideo={true}
                />
                <div className="flex flex-wrap gap-4">
                  {(ps.productMedia || []).map((file, mediaIndex) => {
                    const src =
                      file instanceof File
                        ? URL.createObjectURL(file)
                        : "http://localhost:3000" + file;
                    return (
                      <div
                        key={mediaIndex}
                        className="w-1/5 h-40 border border-gray-100 rounded-lg"
                      >
                        <div
                          className={`w-full h-10/12 flex justify-center items-center rounded-xl border-2 ${mediaIndex === Number(ps.defaultMedia) ? "border-blue-400" : "border-gray-200"}`}
                        >
                          <img
                            src={src}
                            alt="Product"
                            className={`p-1 max-w-full max-h-full rounded-xl`}
                          />
                        </div>
                        <div className="flex justify-between p-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleSetDefault(specIndex, mediaIndex)
                            }
                            className="text-xs text-blue-400"
                          >
                            Set as Default
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMedia(specIndex, mediaIndex)
                            }
                            className="text-xs text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FormCard>
          );
        })}
      </FormCard>
      <FormCard title="Seller Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="Seller"
            options={sellerOptions}
            value={seller}
            onChange={handleSellerChange}
            placeholder="Search Seller..."
            error={formErrors?.sellerId}
            mandatory
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <FileInput
            className=""
            label="Seller Banner"
            // desc="(Recommended resolution: 120 × 40 px. Accepted formats: JPEG, PNG.)"
            name="sellerMedia"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (!files.length) return;
              setFormErrors((prev) => ({
                ...prev,
                sellerMedia: "",
              }));
              setFormData((prev) => {
                const updated = [
                  ...(prev.productSeller?.sellerMedia || []),
                  ...files,
                ];
                return {
                  ...prev,
                  productSeller: {
                    ...prev.productSeller,
                    sellerMedia: updated,
                    defaultMedia: prev.productSeller?.defaultMedia ?? 0,
                  },
                };
              });
            }}
            mandatory
            multiple={true}
            acceptVideo={true}
            error={formErrors?.sellerMedia}
          />
          <div className="flex flex-wrap gap-4 ">
            {(formData.productSeller?.sellerMedia || []).map((file, index) => {
              const src =
                file instanceof File
                  ? URL.createObjectURL(file)
                  : "http://localhost:3000" + file;
              return (
                <div
                  key={index}
                  className="w-1/5 h-40 border border-gray-100 border-rounded-lg"
                >
                  {/* <img
                    src={src}
                    alt="Seller Image Preview"
                    className={`p-1 w-full max-h-5/6 rounded-xl border-2  ${index === Number(formData.productSeller?.defaultMedia) ? "border-blue-400" : "border-gray-200"}`}
                  /> */}
                  <div
                    className={`w-full h-10/12 flex justify-center items-center rounded-xl border-2 ${index === Number(formData.productSeller?.defaultMedia) ? "border-blue-400" : "border-gray-200"}`}
                  >
                    <img
                      src={src}
                      alt="Seller Image Preview"
                      className={`p-1 max-w-full max-h-full rounded-xl`}
                    />
                  </div>
                  <div className="flex justify-between p-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          productSeller: {
                            ...prev.productSeller,
                            defaultMedia: index,
                          },
                        }))
                      }
                      className="text-xs text-blue-400"
                    >
                      Set as Default
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSellerMedia(index)}
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FormCard>
      <FormCard title="SEO Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Meta Keyword"
            name="metaKeyword"
            type="text"
            onChange={handleChange}
            value={formData.productSEO?.metaKeyword || ""}
            placeholder="Enter Meta Keyword"
            // error={formErrors.productName}
            // mandatory
          />
          <InputField
            label="Meta Description"
            name="metaDescription"
            type="text"
            value={formData.productSEO?.metaDescription || ""}
            onChange={handleChange}
            placeholder="Enter Meta Description"
            // error={formErrors.productName}
            // mandatory
          />
          <InputField
            label="H1"
            name="h1"
            type="text"
            value={formData.productSEO?.h1 || ""}
            onChange={handleChange}
            placeholder="Enter H1"
            // error={formErrors.productName}
            // mandatory
          />
          <InputField
            label="H2"
            name="h2"
            type="text"
            value={formData.productSEO?.h2 || ""}
            onChange={handleChange}
            placeholder="Enter H2"
            // error={formErrors.productName}
            // mandatory
          />
          <InputField
            label="H3"
            name="h3"
            type="text"
            value={formData.productSEO?.h3 || ""}
            onChange={handleChange}
            placeholder="Enter H3"
            // error={formErrors.productName}
            // mandatory
          />
          <InputField
            label="H4"
            name="h4"
            type="text"
            value={formData.productSEO?.h4 || ""}
            onChange={handleChange}
            placeholder="Enter H4"
            // error={formErrors.productName}
            // mandatory
          />
        </div>
      </FormCard>
      <FormCard title="Measurement Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Height"
            name="height"
            type="number"
            value={formData.productMeasurements?.height || ""}
            onChange={handleChange}
            placeholder="Enter product height"
            // error={formErrors.productName}
            // mandatory
          />
          <InputField
            label="Width"
            name="width"
            type="number"
            value={formData.productMeasurements?.width || ""}
            onChange={handleChange}
            placeholder="Enter product width"
            // error={formErrors.productName}
            // mandatory
          />
          <InputField
            label="Length"
            name="length"
            type="number"
            value={formData.productMeasurements?.length || ""}
            onChange={handleChange}
            placeholder="Enter product length"
            // error={formErrors.productName}
            // mandatory
          />
          <InputField
            label="Breadth"
            name="breadth"
            type="number"
            value={formData.productMeasurements?.breadth || ""}
            onChange={handleChange}
            placeholder="Enter product breadth"
            // error={formErrors.productName}
            // mandatory
          />
        </div>
      </FormCard>

      <FormCard title="Tags">
        <div className="flex gap-4 items-center">
          <InputField
            name="productTag"
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="Add tag ..."
            className="w-64"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-6 py-2 text-white bg-blue-600 rounded-md font-semibold shadow-sm hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-1 p-2">
          {formData.productTags?.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-(--bg-input)  border border-(--border-color) px-3 rounded-full text-sm"
            >
              <span className="text-(--text-primary)">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-lg text-gray-400 hover:text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
          {formData.productTags?.length === 0 && (
            <p className="text-gray-400 text-sm mt-2">No tags added yet.</p>
          )}
        </div>
      </FormCard>
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-white bg-(--color-primary) border border-(--border-color) rounded-md font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-(--color-primary) text-white border border-(--border-color) rounded-md font-medium shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
