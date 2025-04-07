import Image from "next/image";
import LogoImage from "@/assets/Property 1=Variant2.png";

export const metadata = {
  title: "MintQlick Authenticate",
  description: "This is the MintQlick Authentication Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {" "}
        <div className="w-full h-screen landscape:h-auto lg:landscape:h-screen bg-primary flex ">
          <div className="hidden lg:block w-1/2 xl:w-5/12 h-full text-white pt-9 text-center ">
            <div className="w-full flex justify-center relative">
              <Image src={LogoImage} alt="" height={120} width={150} />
            </div>
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}
