import React, { useState, useEffect, useRef } from 'react';
import Skills from '../Skills/Skills';
import { skills } from '../Skills/typeSkills';
import Projects from '../Projects/Projects';
import { Project } from '../Projects/typeProjects';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type Props = {
  data: any;
  category: string;
};

const HorizontalScroll: React.FC<Props> = ({ data, category }): React.ReactElement => {
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);  // Index de l'élément actuel
  const itemWidth = 365; // Largeur approximative d'un élément pour le défilement
  const maxIndex = data ? data.length - 1 : 0; // Le dernier index basé sur le nombre d'éléments

  // Fonction pour changer l'index
  const handlePrev = (): void => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));  // Ne va pas au-delà du début
  };

  const handleNext = (): void => {
    setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : prev));  // Ne va pas au-delà de la fin
  };

  return (
    <div style={{ position: 'relative' }} key={category}>
      {currentIndex > 0 && (
        <div
          className='absolute left-0 top-1/2 transform -translate-y-1/2 w-[25px] h-[100%] cursor-pointer z-10 text-primary hover:text-secondary bg-black opacity-[50%] hover:opacity-[75%] transition-opacity duration-300'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handlePrev}
        >
          <ArrowBackIosNewIcon />
        </div>
      )}

      <div
        className="flex flex-row overflow-hidden"
        style={{
          userSelect: 'none',
          boxSizing: 'border-box',
          width: `${itemWidth}px`,
        }}
      >
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * itemWidth}px)`,  // Translate selon l'index
            display: 'flex',
            flexDirection: 'row',
            gap: '15px',
          }}
        >
          {category === 'skills' &&
            data?.map((skill: skills, index: number) => (
              <Skills key={skill.id} category={skill.category} skills={skill.skills} />
            ))}

          {category === 'projects' &&
            data?.map((project: Project, index: number) => <Projects key={project.id} project={project} />)}
        </div>
      </div>

      {currentIndex < maxIndex && (
        <div
          className='absolute right-0 top-1/2 transform -translate-y-1/2 w-[25px] h-[100%] cursor-pointer z-10 text-primary hover:text-secondary bg-black opacity-[50%] hover:opacity-[75%] transition-opacity duration-300'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleNext}
        >
          <ArrowForwardIosIcon />
        </div>
      )}
    </div>
  );
};

export default HorizontalScroll;