"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Header from "./Header";
import usersReducer, { setUser } from "@/reducers/users";

/**
 * Store Redux unique, créé au niveau du layout pour être partagé
 * par toutes les pages (Search, Dashboard, ArtDetails, etc.).
 */
const store = configureStore({
  reducer: { users: usersReducer },
});

/**
 * Contenu interne du layout — a accès au store Redux.
 * Responsabilités :
 * - Rehydrater le store depuis localStorage au premier chargement (survie au refresh)
 * - Afficher ou masquer le Header selon la page courante
 */
function LayoutContent({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    // Restaure la session après un refresh de page
    const token = localStorage.getItem("pg_token");
    const role = localStorage.getItem("pg_role");
    if (token && role) {
      dispatch(setUser({ token, role }));
    }
  }, []);

  // Le Header est masqué sur la page de connexion
  const showHeader = pathname !== "/";

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}

/**
 * Wrapper Provider — expose le store Redux à toute l'application.
 * C'est ce composant qui est importé dans layout.jsx.
 */
export default function ClientLayout({ children }) {
  return (
    <Provider store={store}>
      <LayoutContent>{children}</LayoutContent>
    </Provider>
  );
}
