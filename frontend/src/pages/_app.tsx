import "../styles/globals.css";
import "../styles/output.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../context/Theme/ThemeContext";
import { LangProvider } from "@/context/Lang/LangContext";
import Navbar from "@/components/NavBar/NavBar";
import { SectionRefsProvider } from "@/context/SectionRefs/SectionRefsContext";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SectionRefsProvider>
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <Component {...pageProps} />
      </LangProvider>
    </ThemeProvider>
    </SectionRefsProvider>
  );
}
export default App;

