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
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const itemWidth = 365;

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (container) {
      const newScrollLeft = index * itemWidth;
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = (): void => {
    if (activeIndex > 0) {
      setActiveIndex(prevIndex => {
        const newIndex = prevIndex - 1;
        scrollToIndex(newIndex);
        return newIndex;
      });
    }
  };

  const handleScrollRight = (): void => {
    if (activeIndex < data.length - 1) {
      setActiveIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        scrollToIndex(newIndex);
        return newIndex;
      });
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
    const timeoutId = setTimeout(() => {
      checkScrollPosition();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [data]);

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
          className='absolute left-0 top-1/2 transform -translate-y-1/2 w-[25px] h-[100%] cursor-pointer z-10 text-primary hover:text-secondary bg-black opacity-[50%] hover:opacity-[75%] transition-opacity duration-300'
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
        className="flex flex-row overflow-x-auto overflow-y-hidden"
        style={{
          userSelect: 'none',
          boxSizing: 'border-box',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div
          className="m-5"
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