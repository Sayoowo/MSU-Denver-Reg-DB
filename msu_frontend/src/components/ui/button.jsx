 
export function Button({ className, style, children, variant, ...props }) {
  return <button style={{ cursor: "pointer", padding: "8px 16px", borderRadius: "8px", border: "1px solid transparent", fontWeight: 500, fontSize: "14px", ...style }} className={className} {...props}>{children}</button>;
}