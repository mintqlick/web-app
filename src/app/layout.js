import { ToastContainer } from "react-toastify";
import "./globals.css";


export const metadata = {
  title: "nodalcircle",
  description: "This is the official nodalcircle page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     
      <body>
        <ToastContainer position="top-right"/>
        {children}
        </body>
    </html>
  );
}
