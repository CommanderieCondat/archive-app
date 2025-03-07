import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Login from "@/app/Login"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'MongoDB Archives',
  description: 'Displaying files from MongoDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* <Login/> */}
        {children}
      </body>
    </html>
  );
}

