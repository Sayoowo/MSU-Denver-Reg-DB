 export function Table({ children, ...props }) {
  return <table style={{ width: "100%", borderCollapse: "collapse" }} {...props}>{children}</table>;
}
export function TableHeader({ children, ...props }) {
  return <thead {...props}>{children}</thead>;
}
export function TableBody({ children, ...props }) {
  return <tbody {...props}>{children}</tbody>;
}
export function TableRow({ children, style, ...props }) {
  return <tr style={{ borderBottom: "1px solid #E5E7EB", ...style }} {...props}>{children}</tr>;
}
export function TableHead({ children, style, ...props }) {
  return <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, fontSize: "13px", ...style }} {...props}>{children}</th>;
}
export function TableCell({ children, style, ...props }) {
  return <td style={{ padding: "12px", fontSize: "14px", ...style }} {...props}>{children}</td>;
}
