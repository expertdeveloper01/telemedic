/**
 * Loader Spinner
 */

import React from "react";
import { Spinner } from "react-bootstrap";

function Loader() {

  

  return (
    // <div style={{position: 'absolute', backgroundColor: '#0002', width: '100%', height: '100%'}}>
    <Spinner
      animation="border"
      role="status"
      style={{
        height: "100px",
        width: "100px",
        margin: "auto",
        display: "block",
        // position: 'absolute',
        // left: 'calc(50% - 50px)',
        // top: 'calc(50% - 50px)'
      }}
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
    // </div>
  );
}

export default Loader;
