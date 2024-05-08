import { useLang } from "@/context/Lang/LangContext";
import Skills from "@/components/Skills/Skills";

const Home: React.FC = () => {
  const { translations } = useLang();
  return (
    <main className="bg-body">
      {/* <p className={`text-text`}>{translations?.welcome}</p> */}
      <Skills />
    </main>
  );
}

export default Home;

