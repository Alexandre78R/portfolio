import { useLang } from "@/context/Lang/LangContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import { skillsData } from "@/Data/skillsData";

const Home: React.FC = () => {
  const { translations } = useLang();
  return (
    <main className="bg-body">
      <>
        <HorizontalScroll data={skillsData} category="skills" />
      </>
    </main>
  );
}

export default Home;

