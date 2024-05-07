import "../styles/globals.css";
import "../styles/output.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../context/Theme/ThemeContext";
import { LangProvider } from "@/context/Lang/LangContext";
import Navbar from "@/components/NavBar/NavBar";
import Header from "@/components/Header/Header";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <Header />
        <Component {...pageProps} />
      </LangProvider>
    </ThemeProvider>
  );
}
export default App;

