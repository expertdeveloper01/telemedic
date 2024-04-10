/***
 * Page Not Found
 */

import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="container">
      <h2>Page Not Found</h2>
      <Link to="/">Go back to Home page</Link>
    </div>
  );
};

export default PageNotFound;
