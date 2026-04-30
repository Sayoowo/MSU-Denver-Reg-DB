export function Badge({ className, style, children, ...props }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 500,
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
    </span>
  );
}