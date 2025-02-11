import React from 'react'

const LoadingSpineer = ({isLoading}) => {
  if (!isLoading) return null;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <button
        className="btn"
        style={{ backgroundColor: "#2DDC1B", color: "white" }}
        type="button"
        disabled
      >
        <span
          className="spinner-grow spinner-grow-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Loading...
      </button>
    </div>
  );
}

export default LoadingSpineer
