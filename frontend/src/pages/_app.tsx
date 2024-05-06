import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../context/Theme/ThemeContext";
import { LangProvider } from "@/context/Lang/LangContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LangProvider>
        <Component {...pageProps} />
      </LangProvider>
    </ThemeProvider>
  );
}
