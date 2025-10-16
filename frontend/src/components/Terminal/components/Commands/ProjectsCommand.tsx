import { useState, useEffect } from "react";
import { Message } from "../Message";
import { useLang } from "@/context/Lang/LangContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ButtonCustom from "@/components/Button/Button";
import { CardActions, CardContent, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dynamic from "next/dynamic";
import { Project, SkillsProject } from "@/store/slices/projectsSlice";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const ProjectsCommand: React.FC = () => {

  const dataProjects: Project[] = useSelector(
    (state: RootState) => state.projects.dataProjects
  );

  const { translations, lang } = useLang();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const datasPerPage: number = 1;

  const [isClient, setIsClient] = useState<boolean>(false);

  // Responsive chunk size
  const [chunkSize, setChunkSize] = useState<number>(2);

  const [expandedText, setExpandedText] = useState<Set<number>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (dataProjects.length > 0) setIsClient(true);
  }, [dataProjects]);

  const getChunkSize = (): number => {
    if (typeof window === "undefined") return 2;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 300) return 2;
    return 2;
  };

  useEffect(() => {
    setChunkSize(getChunkSize());
    const handleResize = (): void => setChunkSize(getChunkSize());
    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  const pagination = (): Project[] => {
    const indexLast: number = currentPage * datasPerPage;
    const indexFirst: number = indexLast - datasPerPage;
    return dataProjects.slice(indexFirst, indexLast);
  };

  const next = (): void => setCurrentPage((prev) => prev + 1);
  const previous = (): void => setCurrentPage((prev) => prev - 1);

  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const chunkedArr: T[][] = [];
    for (let i: number = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const handleExpandClick = (cardId: number): void => {
    const newExpanded = new Set(expandedCards);
    expandedCards.has(cardId) ? newExpanded.delete(cardId) : newExpanded.add(cardId);
    setExpandedCards(newExpanded);
  };

  const handleExpandTextClick = (cardId: number): void => {
    const newExpanded = new Set(expandedText);
    expandedText.has(cardId) ? newExpanded.delete(cardId) : newExpanded.add(cardId);
    setExpandedText(newExpanded);
  };

  return (
    <Message>
      {pagination()
        .slice()
        .reverse()
        .map((project: Project) => {
          const description: string =
            lang === "fr" ? project.descriptionFR : project.descriptionEN;

          return (
            <Message key={project.id}>
              <div className="flex">
                {project.typeDisplay === "video" ? (
                  <div className="video-container">
                    {isClient && (
                      <ReactPlayer
                        url={`${process.env.NEXT_PUBLIC_API_URL}/api/upload/${project.typeDisplay}/${project.contentDisplay}`}
                        width="310px"
                        height="170px"
                        controls
                      />
                    )}
                  </div>
                ) : (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/upload/${project.typeDisplay}/${project.contentDisplay}`}
                    alt={project.title}
                    className="w-[350px] h-[170px] pb-2 overflow-hidden"
                  />
                )}
              </div>

              <div className="sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[35%]">
                <Typography variant="h5" component="h4" className="max-w-320px">
                  {project.title}
                </Typography>

                {description.length > 90 && !expandedText.has(project.id) ? (
                  <>
                    <p className="max-w-320px pt-2 leading-125%">
                      {description.substring(0, 90) + "..."}
                    </p>
                    <p
                      onClick={() => handleExpandTextClick(project.id)}
                      className="text-primary hover:text-secondary cursor-pointer"
                    >
                      {translations.buttonSeeMore}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="max-w-320px pt-2 leading-125%">{description}</p>
                    {description.length > 90 && (
                      <p
                        onClick={() => handleExpandTextClick(project.id)}
                        className="text-primary hover:text-secondary cursor-pointer"
                      >
                        {translations.buttonSeeLess}
                      </p>
                    )}
                  </>
                )}
              </div>

              <CardActions disableSpacing className="flex justify-between items-center p-0">
                <IconButton aria-label="add to favorites">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${project.title} - Github`}
                    >
                      <GitHubIcon className="text-primary hover:text-secondary" />
                    </a>
                  )}
                  <button
                    className="ml-2 m-1"
                    title={`${project.title} - ${translations.navbarButtonSkill}`}
                  >
                    <ExpandMoreIcon
                      onClick={() => handleExpandClick(project.id)}
                      className={`text-primary hover:text-secondary transition-transform transform ${
                        expandedCards.has(project.id) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </IconButton>
              </CardActions>

              <CardContent
                className={`transition-opacity transition-max-h ${
                  expandedCards.has(project.id)
                    ? "opacity-100 max-h-500"
                    : "opacity-0 max-h-0 overflow-hidden transition"
                }`}
              >
                {chunkArray<SkillsProject>(project.skills, chunkSize).map(
                  (skillChunk: SkillsProject[], idx: number) => (
                    <div key={idx} className="flex space-x-3 m-3">
                      {skillChunk.map((skill: SkillsProject) => (
                        <img key={skill.name} alt={skill.name} src={skill.image} />
                      ))}
                    </div>
                  )
                )}
              </CardContent>
            </Message>
          );
        })}

      <div className="flex mt-[-2%] mb-2 sm:ml-3 md:ml-4 lg:ml-6">
        <div className="mr-4">
          <ButtonCustom
            onClick={currentPage > 1 ? previous : undefined}
            text={translations.buttonPaginationPrevious}
            disable={currentPage <= 1}
            disableHover={currentPage <= 1}
          />
        </div>
        <ButtonCustom
          onClick={currentPage < Math.ceil(dataProjects.length / datasPerPage) ? next : undefined}
          text={translations.buttonPaginationNext}
          disable={currentPage >= Math.ceil(dataProjects.length / datasPerPage)}
          disableHover={currentPage >= Math.ceil(dataProjects.length / datasPerPage)}
        />
      </div>
    </Message>
  );
};

export default ProjectsCommand;