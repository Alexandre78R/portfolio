import React, { useState, useRef, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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

const Skills = () => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); 
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0); 
  const [isClickOnImage, setIsClickOnImage] = useState(false);

  // Fonction appelée lorsque l'utilisateur clique sur le composant
  const handleMouseDown = (event) => {
    setIsDragging(true); // Définit isDragging à true
    setStartX(event.pageX - containerRef.current.offsetLeft); // Enregistre la position X du clic de la souris
    setScrollLeft(containerRef.current.scrollLeft); // Enregistre la position actuelle de défilement horizontal
    if (event.target.tagName === 'IMG') {
      setIsClickOnImage(true); // Si l'élément cliqué est une image, définit isClickOnImage à true
    }
  };

  // Fonction appelée lorsque l'utilisateur déplace la souris
  const handleMouseMove = (event) => {
    if (!isDragging || isClickOnImage) return; // Si l'utilisateur ne fait pas glisser la souris ou s'il a cliqué sur une image, quitte la fonction
    const x = event.pageX - containerRef.current.offsetLeft; // Calcul de la position X actuelle de la souris
    const walk = (x - startX) * 1.0; // Calcul du déplacement horizontal par rapport à la position initiale
    containerRef.current.scrollLeft = scrollLeft - walk; // Met à jour la position de défilement horizontal
  };

  const handleMouseUp = () => {
    setIsDragging(false); 
    setIsClickOnImage(false); 
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setIsClickOnImage(false); 
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp); // Ajoute un écouteur d'événements mouseup sur window

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp); // Supprime l'écouteur d'événements lors du démontage
    };
  }, [isDragging]); 

  // Effet pour ajouter et supprimer les écouteurs d'événements mousedown et mouseup sur le conteneur
  useEffect(() => {
    containerRef.current.addEventListener('mousedown', handleMouseDown); // Ajoute un écouteur d'événements mousedown sur le conteneur
    containerRef.current.addEventListener('mouseup', handleMouseUp); // Ajoute un écouteur d'événements mouseup sur le conteneur

    return () => {
      containerRef.current.removeEventListener('mousedown', handleMouseDown); // Supprime l'écouteur d'événements lors du démontage
      containerRef.current.removeEventListener('mouseup', handleMouseUp); // Supprime l'écouteur d'événements lors du démontage
    };
  }, [startX, scrollLeft]); 

  // Effet pour ajouter et supprimer l'écouteur d'événement mousemove sur le conteneur en fonction de isDragging et isClickOnImage
  useEffect(() => {
    if (isDragging && !isClickOnImage) {
      containerRef.current.addEventListener('mousemove', handleMouseMove); // Ajoute un écouteur d'événements mousemove sur le conteneur
    } else {
      containerRef.current.removeEventListener('mousemove', handleMouseMove); // Supprime l'écouteur d'événements lorsque l'utilisateur ne fait pas glisser la souris ou s'il a cliqué sur une image
    }
    return () => {
      containerRef.current.removeEventListener('mousemove', handleMouseMove); // Supprime l'écouteur d'événements lors du démontage
    };
  }, [isDragging, isClickOnImage]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        className="flex flex-row overflow-x-auto overflow-y-hidden p-2 custom-scrollbar"
        style={{ userSelect: 'none' }}
      >
        {skillsData.map((card) => (
          <div 
          key={card.category}
          className="flex-shrink-0 min-w-80 mr-2 rounded-lg bg-body text-white overflow-hidden"
          style={{ cursor: 'pointer' }} 
          >
            <CardContent>
              <Typography variant="h6" component="h6" className="text-lg font-bold mb-2">
                Skills {card.category}
              </Typography>
              <div className="flex flex-col">
                {card.skills.map((skill, index) => (
                  index % 2 === 0 && (
                    <div key={index} className="flex justify-between mb-2">
                      <Typography variant="body1" component="p">
                        <img alt={skill.name} src={skill.image} style={{ cursor: 'auto' }} />
                      </Typography>
                      {card.skills[index + 1] && (
                        <Typography variant="body1" component="p">
                          <img alt={card.skills[index + 1].name} src={card.skills[index + 1].image} style={{ cursor: 'auto' }} />
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