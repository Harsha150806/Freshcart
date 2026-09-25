const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="spinner-wrap" style={{ flexDirection: "column", gap: "1rem" }}>
    <div className="spinner"></div>
    <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>{message}</p>
  </div>
);

export default LoadingSpinner;
