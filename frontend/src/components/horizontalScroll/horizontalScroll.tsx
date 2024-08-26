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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isClickOnImage, setIsClickOnImage] = useState<boolean>(false);
  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const itemWidth = 360; // Largeur approximative d'un élément pour le défilement

  // Fonction de défilement fluide
  const smoothScroll = (scrollBy: number) => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: scrollBy, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    setStartX(event.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
    const target: HTMLElement = event.target as HTMLElement;
    if (target.tagName === 'IMG') {
      setIsClickOnImage(true);
    }
  };

  const handleMouseMove = (event: MouseEvent): void => {
    if (!isDragging || isClickOnImage) return;
    const x: number = event.pageX - containerRef.current!.offsetLeft;
    const walk: number = (x - startX) * 1.0; // Vitesse du défilement
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
    setIsClickOnImage(false);
  };

  const handleScrollLeft = (): void => {
    smoothScroll(-itemWidth);
  };

  const handleScrollRight = (): void => {
    smoothScroll(itemWidth);
  };

  const checkScrollPosition = (): void => {
    const container = containerRef.current;
    if (container) {
      const isScrollableContent = container.scrollWidth > container.clientWidth;
      setIsScrollable(isScrollableContent);
      setIsAtStart(container.scrollLeft === 0);
      setIsAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = (): void => {
      if (isDragging) {
        setIsDragging(false);
        setIsClickOnImage(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [isDragging]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', (e) => handleMouseDown(e as unknown as React.MouseEvent<HTMLDivElement>));
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('scroll', checkScrollPosition);
    }
    checkScrollPosition();

    return () => {
      if (container) {
        container.removeEventListener('mousedown', (e) => handleMouseDown(e as unknown as React.MouseEvent<HTMLDivElement>));
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      if (isDragging && !isClickOnImage) {
        container.addEventListener('mousemove', handleMouseMove);
      } else {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isDragging, isClickOnImage]);

  return (
    <div style={{ position: 'relative' }} key={category}>
      {!isAtStart && isScrollable && (
        <div
          className='absolute right-0 top-1/2 transform -translate-y-1/2 w-[25px] h-[100%] cursor-pointer z-10 text-primary hover:text-secondary bg-black opacity-[50%] hover:opacity-[75%] transition-opacity duration-300'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleScrollLeft}
        >
          <ArrowBackIosNewIcon />
        </div>
      )}

      <div
        ref={containerRef}
        className="flex flex-row overflow-x-hidden overflow-y-hidden"
        style={{
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '15px',
          }}
        >
          {category === 'skills' &&
            data?.map((skill: skills) => (
              <Skills key={skill.id} category={skill.category} skills={skill.skills} />
            ))}

          {category === 'projects' &&
            data?.map((project: Project) => <Projects key={project.id} project={project} />)}
        </div>
      </div>

      {!isAtEnd && isScrollable && (
        <div
          className='absolute right-0 top-1/2 transform -translate-y-1/2 w-[25px] h-[100%] cursor-pointer z-10 text-primary hover:text-secondary bg-black opacity-[50%] hover:opacity-[75%] transition-opacity duration-300'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleScrollRight}
        >
          <ArrowForwardIosIcon />
        </div>
      )}
    </div>
  );
};

export default HorizontalScroll;