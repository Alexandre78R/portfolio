import React, { useState, useEffect, useRef } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import YouTube, { YouTubeProps } from 'react-youtube';
import GitHubIcon from '@mui/icons-material/GitHub';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';


const useStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  card: {
    flex: '0 0 auto',
    minWidth: '300px',
    margin: '10px',
    backgroundColor: '#01031b',
    color: '#F8F8FD',
  },
  mediaContainer: {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
},
  imgContainer: {
    width: '100%',
    paddingBottom: '10px',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '30px',
    height: '30px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 888,
  },
  description: {
      maxWidth: '320px',
      paddingTop: '10px',
    lineHeight: '125%',
  },
  descriptionVideo: {
    maxWidth: '320px',
    paddingTop: '10px',
    lineHeight: '125%',
},
  leftArrow: {
      left: '10px',
    },
    rightArrow: {
        right: '10px',
    },
    expandedContent: {
        opacity: 1,
    maxHeight: '500px',
    transition: 'opacity 1.5s ease, max-height 1.5s ease',
  },
  hiddenContent: {
      opacity: 0,
      maxHeight: 0,
      overflow: 'hidden',
      transition: 'opacity 1.5s ease, max-height 1.5s ease',
    },
    image: {
        width : "280px",
        height: '190px',
        
        objectFit: 'cover',
    },
    projectContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    projectRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: theme.spacing(1),
    },
    seemoreDescription: {
        color:  "red",
    },
}));

const Projects = () => {
    const data = [
      {
        id: '1',
        title: 'WildCodeHub',
        description: 'WildCodeHub est une plateforme de développement de code en ligne axée sur JavaScript. Les utilisateurs peuvent créer, tester et partager leur code, avec une interface intuitive et des fonctionnalités de sauvegarde. Des interactions sociales sont prévues, et des évolutions incluront le support de nouveaux langages et la collaboration en temps réel.',
        typeDisplay: 'image',
        github: 'https://github.com/WildCodeSchool/2309-wns-jaune-wild-code-hub',
        contentDisplay: 'https://i.goopics.net/tilvu0.png',
        skills: [
          { name: 'TypeScript', image: 'https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white' },
          { name: 'Next.js', image: "https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white" },
          { name: 'Redux', image: "https://img.shields.io/badge/-Redux-8C1EB2?style=flat-square&logo=redux&logoColor=white" },
          { name: 'Chakra UI', image: "https://img.shields.io/badge/-Chakra%20UI-36C5CA?style=flat-square&logo=chakra-ui&logoColor=white" },
          { name: 'SASS', image: "https://img.shields.io/badge/-SASS-CC69BF?style=flat-square&logo=sass&logoColor=white" },
          { name: 'Nodejs', image: "https://img.shields.io/badge/-Nodejs-44883e?style=flat-square&logo=Node.js&logoColor=white" },
          { name: 'Apollo GraphQL', image: "https://img.shields.io/badge/-Apollo%20GraphQL-311C87?style=flat-square&logo=apollo-graphql&logoColor=white" },
          { name: 'TypeGraphQL', image: "https://img.shields.io/badge/-TypeGraphQL-5149B8?style=flat-square&logo=graphql&logoColor=white" },
          { name: 'PostgreSQL', image: "https://img.shields.io/badge/-PostgreSQL-1D73DC?style=flat-square&logo=PostgreSQL&logoColor=white" },
          { name: 'Docker', image: "https://img.shields.io/badge/-Docker-0db7ed?style=flat-square&logo=docker&logoColor=white" },
          { name: 'Github Action', image: "https://img.shields.io/badge/-Github%20Action-000000?style=flat-square&logo=github$&logoColor=white" },
          { name: 'Caddy', image: "https://img.shields.io/badge/-Caddy-26CFA7?style=flat-square&logo=caddy&logoColor=white" },
          { name: 'Nginx', image: "https://img.shields.io/badge/-Nginx-1EA718?style=flat-square&logo=nginx&logoColor=white" },
          { name: 'Jest', image: "https://img.shields.io/badge/-Jest-FC958A?style=flat-square&logo=jest&logoColor=white" },
          { name: 'Figma', image: "https://img.shields.io/badge/-Figma-a259ff?style=flat-square&logo=Figma&logoColor=white" },
          { name: 'Postman', image: "https://img.shields.io/badge/-Postman-F66526?style=flat-square&logo=Postman&logoColor=white" },
          { name: 'Git', image: "https://img.shields.io/badge/-Git-F14E32?style=flat-square&logo=git&logoColor=white" },
        ],
      },
      {
        id: '2',
        title: 'Makesense intranet',
        description: "Makesense, fondée en 2010, encourage la durabilité et l'engagement à travers des projets écologiques et sociaux. Une plateforme intranet est nécessaire pour créer, évaluer et voter sur les projets. Les administrateurs peuvent gérer les utilisateurs, les publications et les rôles, les décisions étant prises par un système de vote basé sur le rôle de l'utilisateur.",
        typeDisplay: 'video',
        github: 'https://github.com/Alexandre78R/makesense-client',
        contentDisplay: '-t7cRO6EUXc',
        skills: [
          { name: 'JavaScript', image: 'https://img.shields.io/badge/-JavaScript-efd81d?style=flat-square&logo=JavaScript&logoColor=white' },
          { name: 'React', image: "https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" },
          { name: 'Redux', image: "https://img.shields.io/badge/-Redux-8C1EB2?style=flat-square&logo=redux&logoColor=white" },
          { name: 'SASS', image: "https://img.shields.io/badge/-SASS-CC69BF?style=flat-square&logo=sass&logoColor=white" },
          { name: 'Nodejs', image: "https://img.shields.io/badge/-Nodejs-44883e?style=flat-square&logo=Node.js&logoColor=white" },
          { name: 'Express', image: "https://img.shields.io/badge/-Express-000000?style=flat-square&logoColor=white" },
          { name: 'MySQL', image: "https://img.shields.io/badge/-MySQL-F29111?style=flat-square&logo=MySQL&logoColor=white" },
          { name: 'Figma', image: "https://img.shields.io/badge/-Figma-a259ff?style=flat-square&logo=Figma&logoColor=white" },
          { name: 'Postman', image: "https://img.shields.io/badge/-Postman-F66526?style=flat-square&logo=Postman&logoColor=white" },
          { name: 'Git', image: "https://img.shields.io/badge/-Git-F14E32?style=flat-square&logo=git&logoColor=white" },
        ],
      },
      {
        id: '40',
        title: 'Wonder Match',
        description: 'Wonder Match est une application pour les voyageurs intrépides, vous aide à choisir votre destination en quelques étapes simples : sélectionnez les continents désirés, faites défiler les suggestions, puis décidez : Match ou Pass. Explorez les activités, sites touristiques et spots pour selfies, pour des vacances parfaitement planifiées.',
        typeDisplay: 'video',
        github: 'https://github.com/Alexandre78R/WonderMatch',
        contentDisplay: '08M89dwH9Bs',
        skills: [
          { name: 'JavaScript', image: 'https://img.shields.io/badge/-JavaScript-efd81d?style=flat-square&logo=JavaScript&logoColor=white' },
          { name: 'React', image: "https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" },
          { name: 'SASS', image: "https://img.shields.io/badge/-SASS-CC69BF?style=flat-square&logo=sass&logoColor=white" },
          { name: 'Figma', image: "https://img.shields.io/badge/-Figma-a259ff?style=flat-square&logo=Figma&logoColor=white" },
          { name: 'Postman', image: "https://img.shields.io/badge/-Postman-F66526?style=flat-square&logo=Postman&logoColor=white" },
          { name: 'Git', image: "https://img.shields.io/badge/-Git-F14E32?style=flat-square&logo=git&logoColor=white" },
        ],
      },
      {
        id: '44',
        title: 'GuessWhat',
        description: 'GuessWhat est une application de quiz qui permet aux utilisateurs de personnaliser leur joueur, de choisir leurs thèmes préférés, et de régler le nombre de questions ainsi que le temps par question. Avec une interface conviviale, GuessWhat offre un divertissement personnalisé et flexible pour les passionnés de quiz.',
        typeDisplay: 'video',
        github: 'https://github.com/Alexandre78R/Guess',
        contentDisplay: '91KSSnN06LI',
        skills: [
          { name: 'JavaScript', image: 'https://img.shields.io/badge/-JavaScript-efd81d?style=flat-square&logo=JavaScript&logoColor=white' },
          { name: 'React', image: "https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" },
          { name: 'HTML5', image: "https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" },
          { name: 'CSS3', image: "https://img.shields.io/badge/-CSS3-264de4?style=flat-square&logo=css3&logoColor=white" },
          { name: 'Nodejs', image: "https://img.shields.io/badge/-Nodejs-44883e?style=flat-square&logo=Node.js&logoColor=white" },
          { name: 'Express', image: "https://img.shields.io/badge/-Express-000000?style=flat-square&logoColor=white" },
          { name: 'Figma', image: "https://img.shields.io/badge/-Figma-a259ff?style=flat-square&logo=Figma&logoColor=white" },
          { name: 'Postman', image: "https://img.shields.io/badge/-Postman-F66526?style=flat-square&logo=Postman&logoColor=white" },
          { name: 'Git', image: "https://img.shields.io/badge/-Git-F14E32?style=flat-square&logo=git&logoColor=white" },
        ],
      },
      {
        id: '22',
        title: 'NotesApp',
        description: "NotesApp est une application de prise de notes avec une authentification complète. Espace de administrateur pour gérer les utilisateur, Les utilisateurs peuvent se connecter, s'inscrire, consulter les notes, tout en bénéficiant de fonctionnalités de récupération et de réinitialisation du mot de passe.",
        typeDisplay: 'image',
        github: 'https://github.com/Alexandre78R/NotesApp',
        contentDisplay: 'https://cdn.discordapp.com/attachments/362231367100137474/1236371179296526518/image.png?ex=6637c3e3&is=66367263&hm=c4762a4dd883b11d29314f91ccc936f52b7f946a9d9c856460c7e2921cd2c9f5&',
        skills: [
          { name: 'JavaScript', image: 'https://img.shields.io/badge/-JavaScript-efd81d?style=flat-square&logo=JavaScript&logoColor=white' },
          { name: 'React', image: "https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" },
          { name: 'Redux', image: "https://img.shields.io/badge/-Redux-8C1EB2?style=flat-square&logo=redux&logoColor=white" },
          { name: 'CSS3', image: "https://img.shields.io/badge/-CSS3-264de4?style=flat-square&logo=css3&logoColor=white" },
          { name: 'Nodejs', image: "https://img.shields.io/badge/-Nodejs-44883e?style=flat-square&logo=Node.js&logoColor=white" },
          { name: 'Express', image: "https://img.shields.io/badge/-Express-000000?style=flat-square&logoColor=white" },
          { name: 'Figma', image: "https://img.shields.io/badge/-Figma-a259ff?style=flat-square&logo=Figma&logoColor=white" },
          { name: 'Postman', image: "https://img.shields.io/badge/-Postman-F66526?style=flat-square&logo=Postman&logoColor=white" },
          { name: 'Git', image: "https://img.shields.io/badge/-Git-F14E32?style=flat-square&logo=git&logoColor=white" },
        ],
      },
      {
        id: '55',
        title: 'CV Hermione Granger',
        description: "Nous avons travaillé à quatre sur la création d'un petit site internet sur le thème d'un CV fictif, mettant en lumière le parcours de la célèbre Hermione Granger à Poudlard. En utilisant HTML, CSS et JavaScript, nous avons collaboré pour donner vie à cette idée en concevant une interface interactive et attrayante. Le site présente de manière imaginative le parcours scolaire, les compétences et les réalisations de Hermione Granger dans l'univers magique de Poudlard. À travers des animations subtiles et des mises en page élégantes, nous avons cherché à capturer l'esprit de ce personnage emblématique de la saga Harry Potter.",
        typeDisplay: 'video',
        github: 'https://github.com/Alexandre78R/CV-Hermione',
        contentDisplay: 'gVehEwmhY_o',
        skills: [
          { name: 'JavaScript', image: 'https://img.shields.io/badge/-JavaScript-efd81d?style=flat-square&logo=JavaScript&logoColor=white' },
          { name: 'HTML5', image: "https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" },
          { name: 'CSS3', image: "https://img.shields.io/badge/-CSS3-264de4?style=flat-square&logo=css3&logoColor=white" },
        ],
      },
      {
        id: '33',
        title: 'Fast News Application',
        description: "Nous avons développé une application mobile utilisant React Native qui permet d'accéder à un large éventail d'informations et de les consulter hors ligne. En utilisant une API de news, nous avons mis au point une technologie pour capturer les articles complets sous forme d'images compressées, garantissant une expérience utilisateur fluide sans utiliser de données mobiles.",
        typeDisplay: 'video',
        github: 'https://github.com/thomassauveton/fastnews',
        contentDisplay: 'EHUvTDavByU',
        skills: [
          { name: 'JavaScript', image: 'https://img.shields.io/badge/-JavaScript-efd81d?style=flat-square&logo=JavaScript&logoColor=white' },
          { name: 'React Native', image: "https://img.shields.io/badge/-React%20Native-45b8d8?style=flat-square&logo=react&logoColor=white" },
          { name: 'Expo', image: "https://img.shields.io/badge/Expo-000000?style=flat-square&logo=expo&logoColor=white" },
          { name: 'Redux', image: "https://img.shields.io/badge/-Redux-8C1EB2?style=flat-square&logo=redux&logoColor=white" },
          { name: 'Bootstrap', image: "https://img.shields.io/badge/-Bootstrap-a259ff?style=flat-square&logo=bootstrap&logoColor=white" },
          { name: 'HTML5', image: "https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" },
          { name: 'CSS3', image: "https://img.shields.io/badge/-CSS3-264de4?style=flat-square&logo=css3&logoColor=white" },
        ],
      },
    ]; 
const classes = useStyles();
  const [cards, setCards] = useState([]);
  const containerRef = useRef(null);
  const [isLeftArrowVisible, setIsLeftArrowVisible] = useState(false);
  const [isRightArrowVisible, setIsRightArrowVisible] = useState(false);

//   useEffect(() => {
//     setCards(data)
//   }, []);
  useEffect(() => {
    setCards(data)
    if (containerRef.current) {
      setIsLeftArrowVisible(containerRef.current.scrollLeft > 0);
      console.log(containerRef.current.scrollLeft < (containerRef.current.scrollWidth - containerRef.current.clientWidth))
      setIsRightArrowVisible(containerRef.current.scrollLeft < (containerRef.current.scrollWidth - containerRef.current.clientWidth));
    }
    const handleScroll = () => {
      if (containerRef.current) {
        setIsLeftArrowVisible(containerRef.current.scrollLeft > 0);
        setIsRightArrowVisible(containerRef.current.scrollLeft < (containerRef.current.scrollWidth - containerRef.current.clientWidth));
      }
    };

    containerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const opts: YouTubeProps['opts'] = {
    height: '200',
    width: '310',
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft - containerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft + containerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }

  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const [expandedText, setExpandedText] = React.useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());

  const handleExpandClick = (cardId: string) => {
    const newExpandedCards = new Set(expandedCards);
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
    <div style={{ position: 'relative' }}>
      {isLeftArrowVisible && (
        <div className={classes.arrow + ' ' + classes.leftArrow} onClick={handleScrollLeft}>
          {'<'}
        </div>
      )}
      {isRightArrowVisible && (
        <div className={classes.arrow + ' ' + classes.rightArrow} onClick={handleScrollRight}>
          {'>'}
        </div>
      )}
      <div ref={containerRef} className={classes.cardContainer}>
        {cards.map((project) => (
          <div key={project.id} className="flex-shrink-0 w-72 md:w-96 lg:w-1/4 xl:w-1/5 p-4">
            <Card className={classes.card}>
              <CardContent>
                {project.typeDisplay === 'video' ? (
                  <div className={classes.mediaContainer}>
                    <YouTube videoId={project.contentDisplay} opts={opts} onReady={onPlayerReady} />
                    <Typography variant="h5" component="h2" className={classes.descriptionVideo}>
                      {project.title}
                    </Typography>
                    {project.description.length > 100 && !expandedText.has(project.id)
                      ? (
                        <>
                        <p className={classes.descriptionVideo}>{project.description.substring(0, 100) + '...'}</p>
                        <p onClick={() => handleExpandTextClick(project.id)} className={classes.seemoreDescription}>{expandedText.has(project.id) ? 'Voir moins' : 'Voir plus'}</p>
                        </>
                      )
                      : 
                      project.description.length < 100 ? 
                      <p className={classes.descriptionVideo}>{project.description}</p>
                      :
                      <>
                      <p className={classes.descriptionVideo}>{project.description}</p>
                      <p onClick={() => handleExpandTextClick(project.id)} className={classes.seemoreDescription}>{expandedText.has(project.id) ? 'Voir moins' : 'Voir plus'}</p>
                      </>
                    }
                  </div>
                ) : (
                  <div className={classes.imgContainer}>
                    <img src={project.contentDisplay} alt="Card Image" className={classes.image} />
                    <Typography variant="h5" component="h2" className={classes.description}>
                      {project.title}
                    </Typography>
                    {project.description.length > 100 && !expandedText.has(project.id)
                      ? (
                        <>
                        <p className={classes.descriptionVideo}>{project.description.substring(0, 100) + '...'}</p>
                        <p onClick={() => handleExpandTextClick(project.id)} className={classes.seemoreDescription}>{expandedText.has(project.id) ? 'Voir moins' : 'Voir plus'}</p>
                        </>
                      )
                      : 
                      project.description.length < 100 ? 
                      <p className={classes.descriptionVideo}>{project.description}</p>
                      :
                      <>
                      <p className={classes.descriptionVideo}>{project.description}</p>
                      <p onClick={() => handleExpandTextClick(project.id)} className={classes.seemoreDescription}>{expandedText.has(project.id) ? 'Voir moins' : 'Voir plus'}</p>
                      </>
                    }
                  </div>
                )}
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <a href={project.github} target='_blank'>
                  <GitHubIcon  style={{ color: 'red' }} /> 
                  </a>
                </IconButton>
                <ExpandMore
                  expand={expandedCards.has(project.id)}
                  onClick={() => handleExpandClick(project.id)}
                  aria-expanded={expandedCards.has(project.id)}
                  aria-label="show more"
                  style={{ color: 'red' }}
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <CardContent className={expandedCards.has(project.id) ? classes.expandedContent : classes.hiddenContent}>
                {/* Placeholder content */}
                {/* {project.skills.map((skill, index) => (
                  <img key={index} src={skill.image} alt={skill.name} />
                ))} */}
                <div className={classes.projectContainer}>
                  {project.skills.map((skill, index) => (
                    index % 2 === 0 && (
                      <div key={`${skill}${index}`} className={classes.projectRow}>
                        <Typography variant="body1" component="p">
                          <img alt={skill.name} src={skill.image} />
                        </Typography>
                        {project.skills[index + 1] && (
                          <Typography variant="body1" component="p">
                            <img alt={project.skills[index + 1].name} src={project.skills[index + 1].image} />
                          </Typography>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;