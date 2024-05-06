import { ThemeProvider, useTheme } from "@/context/Theme/ThemeContext";
import { useLang } from "@/context/Lang/LangContext";
import Typography from '@material-ui/core/Typography';

const Home: React.FC = () => {
  const { toggleTheme } = useTheme();
  const { translations } = useLang();

  return (
    <main>
      <p className={`text-text`}>{translations?.welcome}</p>
    </main>
  );
}

export default Home;

