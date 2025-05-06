import Image from "next/image";
import LogoImage from "@/assets/Property 1=Variant2.png";
import Link from "next/link";

export const metadata = {
  title: "MintQlick Authenticate",
  description: "This is the MintQlick Authentication Page",
};

export default function RootLayout({ children }) {
  return (
    <body>
      <div className="w-full h-screen landscape:h-auto lg:landscape:h-screen bg-primary flex ">
        <div className="hidden lg:block w-1/2 xl:w-5/12 h-full text-white pt-9 text-center relative">
          <div className="w-full flex justify-center absolute -top-10">
            <Link href={"/"}>
              <Image
                src={"/images/logo3.jpg"}
                alt="The Page logo"
                height={400}
                width={350}
                className="mix-blend-multiply"
              />
            </Link>
          </div>
        </div>

        {children}
      </div>
    </body>
  );
}
