import { useEffect, useState } from "react";
import { CardContent, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";
import GitHubIcon from "@mui/icons-material/GitHub";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ProjectComponent } from "./typeProjects";
import { useLang } from "@/context/Lang/LangContext";
import ReactPlayer from "react-player";

const Projects: React.FC<ProjectComponent> = ({
  project,
}): React.ReactElement => {
  const [expandedText, setExpandedText]: [
    Set<string>,
    React.Dispatch<React.SetStateAction<Set<string>>>
  ] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards]: [
    Set<string>,
    React.Dispatch<React.SetStateAction<Set<string>>>
  ] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState<boolean>(false);
  const { translations } = useLang();

  useEffect(() => {
    if (project) {
      setIsClient(true);
    }
  }, [project]);

  const handleExpandClick: (cardId: string) => void = (
    cardId: string
  ): void => {
    const newExpandedCards: Set<string> = new Set(expandedCards);
    if (expandedCards.has(cardId)) {
      newExpandedCards.delete(cardId);
    } else {
      newExpandedCards.add(cardId);
    }
    setExpandedCards(newExpandedCards);
  };

  const handleExpandTextClick: (cardId: string) => void = (
    cardId: string
  ): void => {
    const newExpandedText: Set<string> = new Set(expandedText);
    if (expandedText.has(cardId)) {
      newExpandedText.delete(cardId);
    } else {
      newExpandedText.add(cardId);
    }
    setExpandedText(newExpandedText);
  };

  return (
    <div className="bg-body text-text">
      <div key={project?.id} className="flex-shrink-0 w-50 bg-body text-text">
        <div className="flex-shrink-0 w-50 bg-body text-text m-5">
          <div>
            {project?.typeDisplay === "video" ? (
              <div className="w-full h-auto overflow-hidden bg-body text-text">
                <div className="video-container">
                  {isClient && (
                    <ReactPlayer
                      url={`/videos/${project.contentDisplay}`}
                      width="310px"
                      height="170px"
                      controls
                    />
                  )}
                </div>
                <p className="text-xl max-w-320px pt-0.5">{project?.title}</p>
                {project?.description?.length > 150 &&
                !expandedText.has(project?.id) ? (
                  <>
                    <p className="max-w-320px pt-2 leading-normal">
                      {project?.description.substring(0, 150) + "..."}
                    </p>
                    <p
                      title={
                        expandedText.has(project?.id)
                          ? translations.buttonSeeLess
                          : translations.buttonSeeMore
                      }
                      onClick={() => handleExpandTextClick(project?.id)}
                      className="text-primary hover:text-secondary"
                    >
                      {expandedText.has(project?.id)
                        ? translations.buttonSeeLess
                        : translations.buttonSeeMore}
                    </p>
                  </>
                ) : project?.description?.length < 150 ? (
                  <p className="max-w-320px pt-2 leading-normal">
                    {project?.description}
                  </p>
                ) : (
                  <>
                    <p className="max-w-320px pt-2 leading-normal">
                      {project?.description}
                    </p>
                    <p
                      title={
                        expandedText.has(project?.id)
                          ? translations.buttonSeeLess
                          : translations.buttonSeeMore
                      }
                      onClick={() => handleExpandTextClick(project?.id)}
                      className="text-primary hover:text-secondary"
                    >
                      {expandedText.has(project?.id)
                        ? translations.buttonSeeLess
                        : translations.buttonSeeMore}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="w-320px h-170 overflow-hidden bg-body text-text">
                <img
                  src={project?.contentDisplay}
                  alt={project?.title}
                  className="max-w-[310px] pb-2 overflow-hidden"
                />
                <p className="text-xl max-w-320px pt-0.5">{project?.title}</p>
                {project?.description?.length > 150 &&
                !expandedText.has(project?.id) ? (
                  <>
                    <p className="max-w-320px pt-2 leading-125%">
                      {project?.description?.substring(0, 150) + "..."}
                    </p>
                    <p
                      title={
                        expandedText.has(project?.id)
                          ? translations.buttonSeeLess
                          : translations.buttonSeeMore
                      }
                      onClick={() => handleExpandTextClick(project?.id)}
                      className="text-primary hover:text-secondary"
                    >
                      {expandedText.has(project?.id)
                        ? translations.buttonSeeLess
                        : translations.buttonSeeMore}
                    </p>
                  </>
                ) : project?.description?.length < 150 ? (
                  <p className="max-w-320px pt-2 leading-125%">
                    {project?.description}
                  </p>
                ) : (
                  <>
                    <p className="max-w-320px pt-2 leading-125%">
                      {project?.description}
                    </p>
                    <p
                      title={
                        expandedText.has(project?.id)
                          ? translations.buttonSeeLess
                          : translations.buttonSeeMore
                      }
                      onClick={() => handleExpandTextClick(project?.id)}
                      className="text-primary hover:text-secondary"
                    >
                      {expandedText.has(project?.id)
                        ? translations.buttonSeeLess
                        : translations.buttonSeeMore}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          <CardActions
            disableSpacing
            className="flex justify-between items-center p-0"
          >
            <IconButton aria-label="add to favorites">
              {project?.github && (
                <a
                  href={project?.github}
                  target="_blank"
                  rel="alternate"
                  title={`${project?.title} - Github`}
                >
                  <GitHubIcon className="text-primary hover:text-secondary" />
                </a>
              )}
            </IconButton>
            <button
              className="flex items-center"
              title={`${project?.title} - ${translations.navbarButtonSkill}`}
            >
              <ExpandMoreIcon
                onClick={() => handleExpandClick(project?.id)}
                className={`text-primary transition-transform transform ${
                  expandedCards.has(project?.id) ? "rotate-180" : ""
                }`}
              />
            </button>
          </CardActions>
          <CardContent
            className={`transition-opacity transition-max-h ${
              expandedCards.has(project?.id)
                ? "opacity-100 max-h-500 expanded-animation-open"
                : "opacity-0 max-h-0 overflow-hidden transition expanded-animation-close"
            }`}
          >
            <div className="flex flex-col">
              {project?.skills.map(
                (skill, index) =>
                  index % 2 === 0 && (
                    <div
                      key={skill?.name}
                      className="flex justify-between items-center m-1"
                    >
                      <Typography variant="body1" component="p">
                        <img alt={skill?.name} src={skill?.image} />
                      </Typography>
                      {project.skills[index + 1] && (
                        <Typography variant="body1" component="p">
                          <img
                            alt={project?.skills[index + 1]?.name}
                            src={project?.skills[index + 1]?.image}
                          />
                        </Typography>
                      )}
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default Projects;
