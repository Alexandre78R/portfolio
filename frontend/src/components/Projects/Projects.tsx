import { useState,} from 'react';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProjectComponent } from './typeProjects';

const Projects: React.FC<ProjectComponent> = ( { project } ) => {
  const [expandedText, setExpandedText] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  const handleExpandClick = (cardId: string) => {
    const newExpandedCards = new Set(expandedCards);
    console.log("newExpandedCards", cardId)
    if (expandedCards.has(cardId)) {
      newExpandedCards.delete(cardId);
    } else {
      newExpandedCards.add(cardId);
    }
    setExpandedCards(newExpandedCards);
  };

  const handleExpandTextClick = (cardId: string) => {
    const newExpandedText = new Set(expandedText);
    if (expandedText.has(cardId)) {
      newExpandedText.delete(cardId);
    } else {
      newExpandedText.add(cardId);
    }
    setExpandedText(newExpandedText);
  };

  return (
    <div className='bg-body text-text' >
      <div key={project?.id} className="flex-shrink-0 w-70 bg-body text-text">
        <div className="flex-shrink-0 w-70 bg-body text-text m-10">
          <div>
            {project?.typeDisplay === 'video' ? (
              <div className="w-full h-auto overflow-hidden bg-body text-text">
                <iframe width="310" height="170" src={`https://www.youtube-nocookie.com/embed/${project?.contentDisplay}`}></iframe>
                <Typography variant="h5" component="h2" className="max-w-320px pt-0.5">
                  {project?.title}
                </Typography>
                {project?.description?.length > 110 && !expandedText.has(project?.id)
                  ? (
                    <>
                    <p className="max-w-320px pt-2 leading-normal">{project?.description.substring(0, 110) + '...'}</p>
                    <p onClick={() => handleExpandTextClick(project?.id)} className='text-primary hover:text-secondary'>{expandedText.has(project?.id) ? 'Voir moins' : 'Voir plus'}</p>
                    </>
                  )
                  : 
                  project?.description?.length < 110 ? 
                  <p className="max-w-320px pt-2 leading-normal">{project?.description}</p>
                  :
                  <>
                  <p className="max-w-320px pt-2 leading-normal">{project?.description}</p>
                  <p onClick={() => handleExpandTextClick(project?.id)} className='text-primary hover:text-secondary'>{expandedText.has(project?.id) ? 'Voir moins' : 'Voir plus'}</p>
                  </>
                }
              </div>
            ) : (
              <div className="w-320px h-170 overflow-hidden bg-body text-text">
                <img src={project?.contentDisplay} alt="Card Image" className="max-w-[310px] pb-2 overflow-hidden" />
                <Typography variant="h5" component="h2" className="max-w-320px">
                  {project?.title}
                </Typography>
                {project?.description?.length > 110 && !expandedText.has(project?.id)
                  ? (
                    <>
                    <p className="max-w-320px pt-2 leading-125%">{project?.description?.substring(0, 110) + '...'}</p>
                    <p onClick={() => handleExpandTextClick(project?.id)} className='text-primary hover:text-secondary'>{expandedText.has(project?.id) ? 'Voir moins' : 'Voir plus'}</p>
                    </>
                  )
                  : 
                  project?.description?.length < 110 ? 
                  <p className="max-w-320px pt-2 leading-125%">{project?.description}</p>
                  :
                  <>
                  <p className="max-w-320px pt-2 leading-125%">{project?.description}</p>
                  <p onClick={() => handleExpandTextClick(project?.id)} className='text-primary hover:text-secondary'>{expandedText.has(project?.id) ? 'Voir moins' : 'Voir plus'}</p>
                  </>
                }
              </div>
            )}
          </div>
          <CardActions disableSpacing className="flex justify-between items-center">
            <IconButton aria-label="add to favorites">
              <a href={project?.github} target='_blank'>
                <GitHubIcon className='text-primary hover:text-secondary' /> 
              </a>
            </IconButton>
            <div className="flex items-center">
              <ExpandMoreIcon
                onClick={() => handleExpandClick(project?.id)}
                className={`text-primary transition-transform transform ${expandedCards.has(project?.id) ? 'rotate-180' : ''}`}
              />
            </div>
          </CardActions>
          <CardContent className={`transition-opacity transition-max-h ${expandedCards.has(project?.id) ? 'opacity-100 max-h-500 expanded-animation-open' : 'opacity-0 max-h-0 overflow-hidden transition expanded-animation-close'}`}>
            <div className="flex flex-col">
              {project?.skills.map((skill, index) => (
                index % 2 === 0 && (
                  <div key={skill?.name} className="flex justify-between items-center m-1">
                    <Typography variant="body1" component="p">
                      <img alt={skill?.name} src={skill?.image} />
                    </Typography>
                    {project.skills[index + 1] && (
                      <Typography variant="body1" component="p">
                        <img alt={project?.skills[index + 1]?.name} src={project?.skills[index + 1]?.image} />
                      </Typography>
                    )}
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </div>
      </div>
  </div>
  );
};

export default Projects;