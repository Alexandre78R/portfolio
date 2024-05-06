import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../context/Theme/ThemeContext";
import { LangProvider } from "@/context/Lang/LangContext";
import Navbar from "@/components/NavBar/NavBar";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <Component {...pageProps} />
      </LangProvider>
    </ThemeProvider>
  );
}
export default App;

