import { useState, useEffect, useContext } from "react";
import { Message } from "../Message";
import { useLang } from "@/context/Lang/LangContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ButtonCustom from "@/components/Button/Button";
import { SkillTab } from "@/components/Skills/typeSkills";
import { CardActions, CardContent, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProjectsCommand: React.FC = () => {
    
    const dataProjects = useSelector((state: RootState) => state.projects.dataProjects);
    const { translations } = useLang();

    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(1);
    const datasPerPage: number = 1;
    
    const pagination: () => SkillTab[] | any[] = (): SkillTab[] | any[] => {
        const indexLast: number = currentPage * datasPerPage;
        const indexFirst: number = indexLast - datasPerPage;
        return dataProjects.slice(indexFirst, indexLast);
    };
    
    const next: () => void  = () : void => {
        setCurrentPage(currentPage + 1);
    };

    const previous: () => void  = (): void => {
        setCurrentPage(currentPage - 1);
    };
    
    const chunkArray: (array: any[], size: number) => any[] = (array: any[], size: number): any[] => {
        const chunkedArr: any[] = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const getChunkSize: () => number = (): number => {
        if (window.innerWidth >= 1024) return 4; // Desktop
        if (window.innerWidth >= 768) return 3; // Tablet
        if (window.innerWidth >= 300) return 2; // Large mobile
        return 2; // Mini Mobile
    };

    const [chunkSize, setChunkSize]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(getChunkSize());

    useEffect(() => {
        const handleResize: () => void = () => setChunkSize(getChunkSize());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [expandedText, setExpandedText]: [Set<string>, React.Dispatch<React.SetStateAction<Set<string>>>] = useState<Set<string>>(new Set());
    const [expandedCards, setExpandedCards]: [Set<string>, React.Dispatch<React.SetStateAction<Set<string>>>] = useState<Set<string>>(new Set());
  
    const handleExpandClick: (cardId: string) => void = (cardId: string) : void => {
      const newExpandedCards: Set<string> = new Set(expandedCards);
      if (expandedCards.has(cardId)) {
        newExpandedCards.delete(cardId);
      } else {
        newExpandedCards.add(cardId);
      }
      setExpandedCards(newExpandedCards);
    };
  
    const handleExpandTextClick: (cardId: string) => void = (cardId: string) : void => {
      const newExpandedText: Set<string> = new Set(expandedText);
      if (expandedText.has(cardId)) {
        newExpandedText.delete(cardId);
      } else {
        newExpandedText.add(cardId);
      }
      setExpandedText(newExpandedText);
    };
    
    return (
        <Message>
            {
                pagination()?.slice().reverse().map((project, index) => {
                    return (
                        <Message key={project.id}>
                            <div key={index} className="flex">
                                {project?.typeDisplay === 'video' ? (
                                    <iframe width="320" height="170" src={`/videos/${project.contentDisplay}`} allowFullScreen></iframe>
                                ) : (
                                    <img src={project?.contentDisplay} alt="Card Image" className="w-[350px] h-[170px] pb-2 overflow-hidden" />
                                )}
                            </div>
                            <div className="sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[35%]">
                                <Typography variant="h5" component="h4" className="max-w-320px">
                                {project?.title}
                                </Typography>
                                {project?.description?.length > 90 && !expandedText.has(project?.id)
                                ? (
                                    <>
                                    <p className="max-w-320px pt-2 leading-125%">{project?.description?.substring(0, 90) + '...'}</p>
                                    <p onClick={() => handleExpandTextClick(project?.id)} className='text-primary hover:text-secondary'>{expandedText.has(project?.id) ? translations.buttonSeeLess : translations.buttonSeeMore}</p>
                                    </>
                                )
                                : 
                                project?.description?.length < 90 ? 
                                    <p className="max-w-320px pt-2 leading-125%">{project?.description}</p>
                                :
                                <>
                                    <p className="max-w-320px pt-2 leading-125%">{project?.description}</p>
                                    <p onClick={() => handleExpandTextClick(project?.id)} className='text-primary hover:text-secondary'>{expandedText.has(project?.id) ? translations.buttonSeeLess : translations.buttonSeeMore}</p>
                                </>
                                }
                            </div>
                            <CardActions disableSpacing className="flex justify-between items-center p-0">
                                <IconButton aria-label="add to favorites" >
                                <a href={project?.github} target='_blank' rel="alternate" title={`${project?.title} - Github`}>
                                    <GitHubIcon className='text-primary hover:text-secondary' /> 
                                </a>
                                <button className="ml-2 m-1" title={`${project?.title} - ${translations.navbarButtonSkill}`}>
                                    <ExpandMoreIcon
                                        onClick={() => handleExpandClick(project?.id)}
                                        className={`text-primary hover:text-secondary transition-transform transform ${expandedCards.has(project?.id) ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                </IconButton>
                            </CardActions>
                            <CardContent className={`transition-opacity transition-max-h ${expandedCards.has(project?.id) ? 'opacity-100 max-h-500' : 'opacity-0 max-h-0 overflow-hidden transition'}`}>
                            {chunkArray(project.skills, chunkSize).map((skillChunk, index) => (
                                <div key={index} className="flex space-x-3 m-3">
                                    {skillChunk.map((skillImg: any) => (
                                        <img key={skillImg.name} alt={skillImg.name} src={skillImg.image} />
                                    ))}
                                </div>
                            ))}
                            </CardContent>
                        </Message>
                    )
                })
            }
            <div className="flex mt-[-2%] mb-2 sm:ml-3 md:ml-4 lg:ml-6">
                <div className="mr-4">
                    <ButtonCustom 
                        onClick={currentPage > 1? previous : undefined}
                        text={translations.buttonPaginationPrevious}
                        disable={currentPage > 1? false : true}
                        disableHover={currentPage > 1? false : true}
                    />
                </div>
                <ButtonCustom
                    onClick={currentPage < Math.ceil(dataProjects.length / datasPerPage) ? next : undefined}
                    text={translations.buttonPaginationNext}
                    disable={currentPage < Math.ceil(dataProjects.length / datasPerPage) ? false : true}
                    disableHover={currentPage < Math.ceil(dataProjects.length / datasPerPage) ? false : true}
                />
            </div>
        </Message>
    );
};

export default ProjectsCommand;