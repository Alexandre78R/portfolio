import "../styles/globals.css";
import "../styles/output.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../context/Theme/ThemeContext";
import { LangProvider } from "@/context/Lang/LangContext";
import Navbar from "@/components/NavBar/NavBar";
import { SectionRefsProvider } from "@/context/SectionRefs/SectionRefsContext";
import { ChoiceViewProvider } from "@/context/ChoiceView/ChoiceViewContext";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SectionRefsProvider>
    <ThemeProvider>
      <LangProvider>
        <ChoiceViewProvider>
          <Navbar />
          <Component {...pageProps} />
        </ChoiceViewProvider>
      </LangProvider>
    </ThemeProvider>
    </SectionRefsProvider>
  );
}
export default App;

