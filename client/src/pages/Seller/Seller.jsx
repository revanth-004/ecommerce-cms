import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import axios from "axios";
import {
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

import BasicTable from "../../components/tables/BasicTable/BasicTable";

const Seller = () => {
  const [sellers, setSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const tableHeaders = [
    ["sellerName", "Seller Name"],
    ["sellerEmail", "Email Address"],
  ];

  const filteredSellers = sellers.filter(
    (sel) =>
      sel.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sel.companyEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/sellers");
        setSellers(res.data.data);
      } catch (err) {
        console.error("Error fetching sellers", err);
      }
    };
    fetchSellers();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteDialog.id;
    setDeleteDialog({ open: false, id: null });
    try {
      await axios.delete(`http://localhost:3000/api/sellers/${id}`);
      setOrganizers((prev) => prev.filter((org) => org._id !== id));
      setSnackbar({
        open: true,
        message: "Deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  const handleDeleteCancel = () => setDeleteDialog({ open: false, id: null });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const exportCSV = () => {
    const headers = [
      "Seller Name",
      "Email",
      "Mobile",
      "Website",
      "GST Number",
      "Country",
      "State",
    ];
    const rows = sellers.map((sel) => [
      sel.sellerName,
      sel.sellerEmail,
      sel.sellerMobile,
      sel.website,
      sel.gstNumber,
      sel.country,
      sel.state,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sellers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-(--border-color)">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-64 px-4 py-2 text-sm border border-(--border-color) rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-(--color-primary) border border-(--border-color) rounded-lg shadow-sm"
          >
            <span>CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/seller/create">
            <button className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) rounded-lg shadow-lg active:scale-95">
              + Add Seller
            </button>
          </NavLink>
        </div>
      </div>

      <BasicTable
        page="seller"
        filteredData={filteredSellers}
        headers={tableHeaders}
        onDelete={handleDeleteClick}
      />

      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this seller?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          icon={<CheckIcon fontSize="inherit" />}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Seller;
