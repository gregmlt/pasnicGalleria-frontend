import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pasnic Galleria",
  description: "Inventaire de la collection Pasnic Galleria",
};

/**
 * Layout racine Next.js — enveloppe toutes les pages.
 * ClientLayout gère : Redux Provider, rehydratation localStorage, affichage du Header.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
