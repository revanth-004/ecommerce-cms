import React from "react";
import { useLocation, NavLink } from "react-router";

const routeNameMap = {
  dashboard: "Dashboard",
  company: "Company",
  brand: "Brand",
  seller: "Seller",
  customer: "Customer",
  create: "Create",
  edit: "Edit",
  view: "View",
  products: "Products",
  offers: "Offers",
  coupons: "Coupons",
  settings: "Settings",
  product_categories: "Product Categories",
  tools: "Tools",
  specification: "Specification ",
  specification_details: "Specification Detail",
};

const PageBreadCrumbs = () => {
  const { pathname } = useLocation();

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    // if segment looks like a MongoDB id (24 hex chars), label it by previous segment
    const isId = /^[a-f0-9]{24}$/i.test(segment);
    const label = isId
      ? routeNameMap[segments[index - 1]] + " Detail"
      : routeNameMap[segment] || segment;

    return { label, path, isId };
  });

  return (
    <nav className="flex items-center gap-1 text-sm">
      <NavLink
        to="/"
        className="text-(--text-muted) hover:text-(--text-primary) transition-colors"
      >
        Home
      </NavLink>

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.path}>
            <span className="text-(--text-muted)">/</span>
            {isLast ? (
              <span className="text-(--text-primary) font-medium">
                {crumb.label}
              </span>
            ) : (
              <NavLink
                to={crumb.path}
                className="text-(--text-muted) hover:text-(--text-primary) transition-colors"
              >
                {crumb.label}
              </NavLink>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default PageBreadCrumbs;
