function DashboardCard({ title, value, icon, variant = "indigo" }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "indigo":
        return { bg: "#e0e7ff", color: "#4f46e5" };
      case "cyan":
        return { bg: "#ecfeff", color: "#06b6d4" };
      case "amber":
        return { bg: "#fffbeb", color: "#d97706" };
      case "emerald":
        return { bg: "#ecfdf5", color: "#059669" };
      default:
        return { bg: "#f1f5f9", color: "#64748b" };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="col-xl-3 col-md-6">
      <div className="card stat-card p-4 h-100 d-flex flex-row align-items-center justify-content-between">
        <div>
          <h6 className="text-uppercase text-muted fw-semibold mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
            {title}
          </h6>
          <h2 className="fw-bold mb-0" style={{ color: "var(--text-color)" }}>{value}</h2>
        </div>
        <div 
          className="d-flex align-items-center justify-content-center rounded-circle" 
          style={{ width: "56px", height: "56px", fontSize: "1.6rem", backgroundColor: styles.bg, color: styles.color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
