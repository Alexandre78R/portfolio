import { useLang } from "@/context/Lang/LangContext";
import { SparklesCore } from "../ui/SparklesCore";
import { useTheme } from "@/context/Theme/ThemeContext";
import themes from "@/context/Theme/themes";
import Image from 'next/image';

const Header: React.FC = () => {
  const { translations } = useLang();
  const { theme } = useTheme();
  return (
    <header>
        <div className="h-screen relative w-full bg-body flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.8}
            maxSize={1.5}
            particleDensity={100}
            className="w-full h-full bg-body"
            particleColor={themes[theme].colors.primary}
        />
        </div>
          <div className="relative z-20 flex flex-col items-center justify-center">
              <div className="w-40 h-40 relative overflow-hidden">
                  <img className="w-full h-full object-cover rounded-full border-4 border-primary transform transition-transform duration-500 rotateY-0 hover:rotateY-180" src="/img/alex-pixel.png" alt="Description de l'image" />
                  {/* <img className="w-full h-full object-cover rounded-full border-4 border-primary transform transition-transform duration-500 rotateY-180 hover:rotateY-0" src="/img/autre-image.png" alt="Description de l'image" /> */}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-center text-primary relative hover:text-secondary">{translations.headerTitle}</h1>
          </div>
        </div>
    </header>
  );
}

export default Header;

