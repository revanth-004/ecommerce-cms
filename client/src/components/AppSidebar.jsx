import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CategoryIcon from "@mui/icons-material/Category";
import BuildIcon from "@mui/icons-material/Build";

import {
  DashboardFilled,
  ApartmentOutlined,
  ContainerOutlined,
  TagsOutlined,
  InfoCircleFilled,
  ProfileFilled,
  ProductFilled,
  CalculatorFilled,
  FileAddFilled,
  IdcardFilled,
  AppstoreOutlined,
  SettingOutlined,
  RightOutlined,
  ToolOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const AppSidebar = () => {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group";
  const activeClass = " text-blue-600 font-semibold";
  const idleClass = "text-(--text-primary)";

  const [open, setOpen] = useState(false);
  return (
    <aside className="fixed flex flex-col top-0 w-64 left-0 bg-primary text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-(--border-color) shadow-sm overflow-y-scroll">
      <div className="px-4 h-full">
        <div className="flex items-center my-8 px-4">
          <p className="text-xl font-bold text-(--text-primary)">EMI</p>
        </div>

        <ul className="">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <DashboardFilled className="opacity-70 " />
              <p className="text-sm text-primary">Dashboard</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/cms"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <ContainerOutlined className="opacity-70 " />
              <p className="text-sm text-primary">CMS</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/company"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <ApartmentOutlined className="opacity-70" />
              <p className="text-sm">Company</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/brand"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <ContainerOutlined className="opacity-70" />
              <p className="text-sm">Brands</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/seller"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <IdcardFilled className="opacity-70" />
              <p className="text-sm">Seller</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <IdcardFilled className="opacity-70" />
              <p className="text-sm">Customer</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <ProductFilled className="opacity-70" />
              <p className="text-sm">Products</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/offers"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <TagsOutlined className="opacity-70" />
              <p className="text-sm">Offers</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/coupons"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <ShoppingOutlined className="opacity-70" />
              <p className="text-sm">Coupons</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/articles"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : idleClass}`
              }
            >
              <ProfileFilled className="opacity-70" />
              <p className="text-sm">Articles</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/article_categories"
              className={({ isActive }) =>
                `${linkClass} flex ${isActive ? activeClass : idleClass}`
              }
            >
              <CategoryIcon fontSize="small" className="opacity-70" />
              <p className="text-sm">Article Categories</p>
            </NavLink>
          </li>

          <li className="pt-2 mt-2 border-t border-(--border-color)">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${linkClass} flex justify-between ${isActive ? activeClass : idleClass}`
              }
              onClick={() => {
                setOpen(!open);
              }}
            >
              <div className="flex items-center gap-3">
                <SettingOutlined className="opacity-70" />
                <p className="text-sm">Settings</p>
              </div>
              <button
                className=""
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <ChevronRightIcon
                  fontSize="medium"
                  className={`opacity-40 transition-transform duration-200 cursor-pointer ${open ? "rotate-90" : ""}`}
                />
              </button>
            </NavLink>
            {open && (
              <ul className="ml-4">
                <li>
                  <NavLink
                    to="/settings/product_categories"
                    className={({ isActive }) =>
                      `${linkClass} flex ${isActive ? activeClass : idleClass}`
                    }
                  >
                    <CategoryIcon fontSize="small" className="opacity-70" />
                    <p className="text-sm">Product Categories</p>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings/tax"
                    className={({ isActive }) =>
                      `${linkClass} flex  ${isActive ? activeClass : idleClass}`
                    }
                  >
                    <CalculatorFilled className="opacity-70" />
                    <p className="text-sm">Tax</p>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings/Hsn"
                    className={({ isActive }) =>
                      `${linkClass} flex  ${isActive ? activeClass : idleClass}`
                    }
                  >
                    <FileAddFilled className="opacity-70" />
                    <p className="text-sm">HSN</p>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings/tools"
                    className={({ isActive }) =>
                      `${linkClass} flex  ${isActive ? activeClass : idleClass}`
                    }
                  >
                    <BuildIcon fontSize="small" className="opacity-70" />
                    <p className="text-sm">Tools</p>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/settings/specification"
                    className={({ isActive }) =>
                      `${linkClass} flex  ${isActive ? activeClass : idleClass}`
                    }
                  >
                    <ProfileFilled className="opacity-70" />
                    <p className="text-sm">Specification</p>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings/specification_details"
                    className={({ isActive }) =>
                      `${linkClass} flex  ${isActive ? activeClass : idleClass}`
                    }
                  >
                    <InfoCircleFilled className="opacity-70" />
                    <p className="text-sm">Specification Details</p>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AppSidebar;
