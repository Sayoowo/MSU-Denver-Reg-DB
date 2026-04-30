 
export function Card({ className, style, children, ...props }) {
  return <div style={style} className={className} {...props}>{children}</div>;
}
export function CardHeader({ className, style, children, ...props }) {
  return <div style={{ padding: "1.5rem 1.5rem 0", ...style }} className={className} {...props}>{children}</div>;
}
export function CardTitle({ className, style, children, ...props }) {
  return <h3 style={{ fontWeight: 600, fontSize: "18px", ...style }} className={className} {...props}>{children}</h3>;
}
export function CardDescription({ className, style, children, ...props }) {
  return <p style={{ fontSize: "14px", color: "#6B7280", ...style }} className={className} {...props}>{children}</p>;
}
export function CardContent({ className, style, children, ...props }) {
  return <div style={{ padding: "1.5rem", ...style }} className={className} {...props}>{children}</div>;
}