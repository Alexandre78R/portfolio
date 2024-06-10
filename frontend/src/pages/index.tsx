import Head from 'next/head';
import { useEffect, useState } from "react";
import { useLang } from "@/context/Lang/LangContext";
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import Title from "@/components/Title/Title";
import ChoiceView from "@/components/ChoiceView/ChoiceView";
import Header from "@/components/Header/Header";
import AboutMe from "@/components/AboutMe/AboutMe";
import Footer from "@/components/Footer/Footer";
import Terminal from "@/components/Terminal/Terminal";
import { useChoiceView } from "@/context/ChoiceView/ChoiceViewContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateSkillCategories } from "@/store/slices/skillsSlice";
import { updateProjectDescriptions } from "@/store/slices/projectsSlice";
import { updateEducationsTitle } from "@/store/slices/educationsSlice";
import { updateExperiences } from "@/store/slices/experiencesSlice";
import { useRouter } from 'next/router';

const Home: React.FC = (): React.ReactElement  => {

  const router = useRouter();
  const { translations } = useLang();
  const { aboutMeRef, projectRef, skillRef, choiceViewRef, terminalRef } = useSectionRefs();
  const { selectedView, setSelectedView } = useChoiceView();

  const dispatch = useDispatch<AppDispatch>();
  const dataSkills = useSelector((state: RootState) => state.skills.dataSkills);
  const dataProjects = useSelector((state: RootState) => state.projects.dataProjects);

  useEffect(() => {
    dispatch(updateSkillCategories(translations.file));
    dispatch(updateProjectDescriptions(translations.file));
    dispatch(updateEducationsTitle(translations.file));
    dispatch(updateExperiences(translations.file));
  }, [translations])

  const handleViewSelect: (view : string) => void = (view : string): void => {
    setSelectedView(view);
  };
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = translations.file;
    }
  }, [translations]);

  // State pour stocker l'URL canonique
  const [canonicalUrl, setCanonicalUrl] = useState<string>('');
  const [urlDomaine, setUrlDomaine] = useState<string>('');

  useEffect(() => {
    // Vérification pour s'assurer que le code s'exécute côté client
    if (typeof window !== 'undefined') {
      // Construit l'URL canonique en utilisant le chemin actuel
      const url = `${window.location.origin}${router.asPath}`;
      setCanonicalUrl(url);
      setUrlDomaine(window.location.origin)
    }
  }, [router.asPath]);

  return (
    <>
    <Head>
      <title>{translations.titleHTML}</title>
      <meta name="title" content={translations.titleHTML} />
      <meta name="description" content={translations.descHTML} />
      <meta property="og:title" content={translations.titleHTML} />
      <meta property="og:description" content={translations.descHTML} />
      <meta property="og:url" content={urlDomaine} />
      <meta property="og:type" content="Portfolio" />
      <meta property="twitter:title" content={translations.titleHTML} />
      <meta property="twitter:description" content={translations.descHTML} />
      <link rel="canonical" href={canonicalUrl} />
      
      <script type="application/ld+json">
        {/* Organisation */}
        {`{
          "@context": "http://schema.org",
          "@type": "Organization",
          "name": ${translations.titleHTML},
          "url": ${urlDomaine},
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "contact.alexandre-renard.dev",
            "contactType": "Service client"
          }
        }`}
        {/* BreadcrumbList (fil d'Ariane) */}
        {`{
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": ${canonicalUrl}
              }
            ]
          }`}
      </script>
    </Head>
    <Header />
    <main className="bg-body mt-[10%]">
      <section className="ml-3" ref={choiceViewRef}>
        <Title title={translations.nameCategoryChoiceView} />
        <ChoiceView 
          selectedView={selectedView} 
          setSelectedView={setSelectedView} 
          handleViewSelect={handleViewSelect}
        />
      </section>
      {
        selectedView === "terminal" ? 
        <>
          <section className="ml-3 mt-[5%] mb-[5%]" ref={terminalRef}>
            <Title title="Terminal" />
            <div className="ml-3 flex flex-col items-center">
              <Terminal />
            </div>
          </section>
        </>
        :
        <>
          <section className="ml-3 mt-[5%]" ref={aboutMeRef} id="aboutme">
            <Title title={translations.nameCategoryAboutMe} />
            <AboutMe />
          </section>
          <section className="ml-3 mt-[5%]" ref={skillRef} id="skill">
            <Title title={translations.nameCategorySkills} />
            <div className="mt-[1%]">
              <HorizontalScroll data={dataSkills} category="skills" />
            </div>
          </section>
          <section className="ml-3 mt-[5%]" ref={projectRef} id="project">
            <Title title={translations.nameCategoryProjects} />
            <HorizontalScroll data={dataProjects} category="projects" />
          </section>
        </>
      }
      </main>
      <Footer />
    </>
  );
}

export default Home;