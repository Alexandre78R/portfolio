import { useLang } from "@/context/Lang/LangContext";
import Projects from "@/components/Projects/Projects";

const Home: React.FC = () => {
  const { translations } = useLang();
  return (
    <main className="bg-body">
      {/* <p className={`text-text`}>{translations?.welcome}</p> */}
      <Projects />
    </main>
  );
}

export default Home;

