import { useEffect } from "react";
import "../styles/globals.css";
import "../styles/output.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../context/Theme/ThemeContext";
import { LangProvider } from "@/context/Lang/LangContext";
import Navbar from "@/components/NavBar/NavBar";
import { SectionRefsProvider } from "@/context/SectionRefs/SectionRefsContext";
import { ChoiceViewProvider } from "@/context/ChoiceView/ChoiceViewContext";
import ReduxProvider from '../store/provider';
import { useLang } from "@/context/Lang/LangContext";

const App = ({ Component, pageProps }: AppProps): React.ReactElement => {
  const { translations } = useLang();

  return (
    <ReduxProvider>
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
    </ReduxProvider>
  );
}
export default App;

