import "./globals.css";

export const metadata = {
  title: "mintqlick",
  description: "This is the official mintqlick page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     
      <body>{children}</body>
    </html>
  );
}
