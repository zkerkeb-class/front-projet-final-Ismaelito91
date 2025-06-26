import React from "react";
import "./Loader.css";

const Loader = ({ size = "medium", overlay = false, message = "" }) => {
  const sizeClass = `loader--${size}`;

  if (overlay) {
    return (
      <div className="loader-overlay">
        <div className="loader-content">
          <div className={`loader ${sizeClass}`}>
            <div className="loader__spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          {message && <p className="loader__message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`loader ${sizeClass}`}>
      <div className="loader__spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {message && <p className="loader__message">{message}</p>}
    </div>
  );
};

export default Loader;
