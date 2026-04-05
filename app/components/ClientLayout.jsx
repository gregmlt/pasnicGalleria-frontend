"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Header from "./Header";
import usersReducer, { setUser } from "@/reducers/users";

/**
 * Store Redux unique, partagé par toutes les pages.
 */
const store = configureStore({
  reducer: { users: usersReducer },
});

/**
 * Contenu interne — accès au store Redux.
 * - Rehydrate la session depuis localStorage au refresh
 * - Affiche le Header sur toutes les pages sauf la connexion
 */
function LayoutContent({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("pg_token");
    const role = localStorage.getItem("pg_role");
    if (token && role) {
      dispatch(setUser({ token, role }));
    }
  }, []);

  const showHeader = pathname !== "/";

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}

/**
 * Wrapper principal — fournit Redux + Google OAuth à toute l'application.
 */
export default function ClientLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <Provider store={store}>
        <LayoutContent>{children}</LayoutContent>
      </Provider>
    </GoogleOAuthProvider>
  );
}
