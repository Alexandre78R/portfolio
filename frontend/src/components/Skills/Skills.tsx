import React, { useState, useRef, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { v4 as uuidv4 } from 'uuid';
import { useLang } from '@/context/Lang/LangContext';

const useStyles = makeStyles((theme) => ({
  cardContainerSkill: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: theme.spacing(2),
    scrollbarWidth: 'none', /* Firefox */
    msOverflowStyle: 'none', /* Internet Explorer 10+ */
    '&::-webkit-scrollbar': {
      display: 'none', /* WebKit */
    },
  },
  cardSkill: {
    flex: '0 0 auto',
    minWidth: 280,
    margin: theme.spacing(1),
    // margin: '5px',
    borderRadius: '20px',
    backgroundColor: '#01031b',
    color: '#F8F8FD',

    cursor: 'grab',
  },
  skillContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  leftArrow: {
      left: '10px',
  },
  rightArrow: {
    right: '10px',
},
  // title: {
  //   marginLeft: '13px',
  //   maxWidth: "20px",
  // },
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
    zIndex: 999,
  },
  skillRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(1),
    maxWidth: "240px",
  },
}));

const Skills = () => {
  const { lang, setLang, translations } = useLang();
  const classes = useStyles();
  const [cards, setCards] = useState([]);
  const containerRef = useRef(null);
  const [currentPage, setCardsPerPage] = useState(0);
  const [isLeftArrowVisible, setIsLeftArrowVisible] = useState(false);
  const [isRightArrowVisible, setIsRightArrowVisible] = useState(false);
  
  const skillsData = [
    {
      category: 'Programming Languages',
      skills: [
        { name: 'JavaScript', image: "https://img.shields.io/badge/-JavaScript-efd81d?style=flat-square&logo=JavaScript&logoColor=white" },
        { name: 'TypeScript', image: "https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" },
      ],
      color: 'bg-blue-500',
    },
    {
      category: 'Frontend Development',
      skills: [
        { name: 'React', image: "https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" },
        { name: 'Next.js', image: "https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white" },
        { name: 'Redux', image: "https://img.shields.io/badge/-Redux-8C1EB2?style=flat-square&logo=redux&logoColor=white" },
        { name: 'Tailwind CSS', image: "https://img.shields.io/badge/-Tailwind%20CSS-24CDCD?style=flat-square&logo=tailwindcss&logoColor=white" },
        { name: 'MUI', image: "https://img.shields.io/badge/-MUI-167FDC?style=flat-square&logo=mui&logoColor=white" },
        { name: 'Chakra UI', image: "https://img.shields.io/badge/-Chakra%20UI-36C5CA?style=flat-square&logo=chakra-ui&logoColor=white" },
        { name: 'Bootstrap', image: "https://img.shields.io/badge/-Bootstrap-a259ff?style=flat-square&logo=bootstrap&logoColor=white" },
        { name: 'SASS', image: "https://img.shields.io/badge/-SASS-CC69BF?style=flat-square&logo=sass&logoColor=white" },
        { name: 'HTML5', image: "https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" },
        { name: 'CSS3', image: "https://img.shields.io/badge/-CSS3-264de4?style=flat-square&logo=css3&logoColor=white" },
      ],
      color: 'bg-yellow-500',
    },
    {
      category: 'Backend Development',
      skills: [
        { name: 'Nodejs', image: "https://img.shields.io/badge/-Nodejs-44883e?style=flat-square&logo=Node.js&logoColor=white" },
        { name: 'Apollo GraphQL', image: "https://img.shields.io/badge/-Apollo%20GraphQL-311C87?style=flat-square&logo=apollo-graphql&logoColor=white" },
        { name: 'GraphQL', image: "https://img.shields.io/badge/-GraphQL-E535AB?style=flat-square&logo=graphql&logoColor=white" },
        { name: 'TypeGraphQL', image: "https://img.shields.io/badge/-TypeGraphQL-5149B8?style=flat-square&logo=graphql&logoColor=white" },
        { name: 'Express', image: "https://img.shields.io/badge/-Express-000000?style=flat-square&logoColor=white" },
      ],
      color: 'bg-green-500',
    },
    {
      category: 'Mobile App Development',
      skills: [
        { name: 'React Native', image: "https://img.shields.io/badge/-React%20Native-45b8d8?style=flat-square&logo=react&logoColor=white" },
        { name: 'Expo', image: "https://img.shields.io/badge/Expo-000000?style=flat-square&logo=expo&logoColor=white" },
      ],
      color: 'bg-pink-500',
    },
    {
      category: 'Database - Storage & Query',
      skills: [
        { name: 'PostgreSQL', image: "https://img.shields.io/badge/-PostgreSQL-1D73DC?style=flat-square&logo=PostgreSQL&logoColor=white" },
        { name: 'MySQL', image: "https://img.shields.io/badge/-MySQL-F29111?style=flat-square&logo=MySQL&logoColor=white" },
        { name: 'MongoDB', image: "https://img.shields.io/badge/-MongoDB-1DBA22?style=flat-square&logo=mongodb&logoColor=white" },
        { name: 'Prisma', image: "https://img.shields.io/badge/-Prisma-000000?style=flat-square&logo=Prisma&logoColor=white" },
        { name: 'Knex.js', image: "https://img.shields.io/badge/-Knex.js-E95602?style=flat-square&logo=Knex.js&logoColor=white" },
      ],
      color: 'bg-purple-500',
    },
    {
      category: 'DevOps',
      skills: [
        { name: 'Docker', image: "https://img.shields.io/badge/-Docker-0db7ed?style=flat-square&logo=docker&logoColor=white" },
        { name: 'Github Action', image: "https://img.shields.io/badge/-Github%20Action-000000?style=flat-square&logo=github$&logoColor=white" },
        { name: 'Caddy', image: "https://img.shields.io/badge/-Caddy-26CFA7?style=flat-square&logo=caddy&logoColor=white" },
        { name: 'Nginx', image: "https://img.shields.io/badge/-Nginx-1EA718?style=flat-square&logo=nginx&logoColor=white" },
        { name: 'Heroku', image: "https://img.shields.io/badge/-Heroku-7B0FF5?style=flat-square&logo=heroku&logoColor=white" },
      ],
      color: 'bg-red-500',
    },
    {
      category: 'Testing & Web Scraping',
      skills: [
        { name: 'Jest', image: "https://img.shields.io/badge/-Jest-FC958A?style=flat-square&logo=jest&logoColor=white" },
        { name: 'Cypress', image: "https://img.shields.io/badge/-Cypress-1FC824?style=flat-square&logo=cypress&logoColor=white" },
        { name: 'Puppeteer', image: "https://img.shields.io/badge/-Puppeteer-1DB356?style=flat-square&logo=puppeteer&logoColor=white" },
      ],
      color: 'bg-indigo-500',
    },
    {
      category: 'Tools',
      skills: [
        { name: 'Figma', image: "https://img.shields.io/badge/-Figma-a259ff?style=flat-square&logo=Figma&logoColor=white" },
        { name: 'Postman', image: "https://img.shields.io/badge/-Postman-F66526?style=flat-square&logo=Postman&logoColor=white" },
        { name: 'Git', image: "https://img.shields.io/badge/-Git-F14E32?style=flat-square&logo=git&logoColor=white" },
      ],
      color: 'bg-gray-500',
    }
  ];

  useEffect(() => {
    setCards(skillsData)
    if (containerRef?.current) {
      setIsLeftArrowVisible(containerRef.current.scrollLeft > 0);
      setIsRightArrowVisible(containerRef.current.scrollLeft < (containerRef.current.scrollWidth - containerRef.current.clientWidth));
    }
    const handleResize = () => {
      const cardsPerRow = Math.floor(window.innerWidth / 320);
      setCardsPerPage(cardsPerRow);
    };

    window?.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window?.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
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

  return (
    <div style={{ position: 'relative' }}>
      {isLeftArrowVisible && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-secondary text-body rounded-full w-8 h-8 flex justify-center items-center cursor-pointer" onClick={handleScrollLeft}>
          {'<'}
        </div>
      )}
      {isRightArrowVisible && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-secondary text-body rounded-full w-8 h-8 flex justify-center items-center cursor-pointer" onClick={handleScrollRight}>
          {'>'}
        </div>
      )}
      <div ref={containerRef} className="flex flex-row overflow-x-auto overflow-y-hidden p-2  custom-scrollbar">
        {cards.map((card) => (
            <div key={card.category} className="flex-shrink-0 min-w-80 mr-2 rounded-lg bg-body text-white overflow-hidden">
            <CardContent>
              <Typography variant="h6" component="h6" className="text-lg font-bold mb-2">
                Skills {card.category}
              </Typography>
              <div className="flex flex-col">
                {card.skills.map((skill, index) => (
                  index % 2 === 0 && (
                    <div key={index} className="flex justify-between mb-2">
                      <Typography variant="body1" component="p">
                        <img alt={skill.name} src={skill.image} />
                      </Typography>
                      {card.skills[index + 1] && (
                        <Typography variant="body1" component="p">
                          <img alt={card.skills[index + 1].name} src={card.skills[index + 1].image}  />
                        </Typography>
                      )}
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;