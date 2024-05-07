import { useLang } from "@/context/Lang/LangContext";

const Home: React.FC = () => {
  const { translations } = useLang();
  return (
    <main className="bg-body">
      <p className={`text-text`}>{translations?.welcome}</p>
    </main>
  );
}

export default Home;

