 
export function Input({ className, style, ...props }) {
  return <input style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box", ...style }} className={className} {...props} />;
}