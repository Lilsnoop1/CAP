import "./globals.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Providers from "./providers.jsx";
import PageTransition from "./components/PageTransition.jsx";
export const metadata = {
  title: "Center of Alternative Perspectives",
  description: "CAP website migrated to Next.js 15 with Tailwind and Relume UI.",
  icons: {
    icon: "/cap-logo.jpg",
    shortcut: "/cap-logo.jpg",
    apple: "/cap-logo.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background-primary text-text-primary antialiased">
        <Providers>
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
