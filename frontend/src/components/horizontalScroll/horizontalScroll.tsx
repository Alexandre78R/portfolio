import React, { useState, useEffect, useRef, MouseEvent } from 'react';
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

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    setStartX(event.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
    const target: HTMLElement = event.target as HTMLElement;
    if (target.tagName === 'IMG') {
      setIsClickOnImage(true);
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
    if (!isDragging || isClickOnImage) return;
    const x: number = event.pageX - containerRef.current!.offsetLeft;
    const walk: number = (x - startX) * 1.0;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
    setIsClickOnImage(false);
  };

  const handleScrollLeft = (): void => {
    containerRef.current!.scrollBy({ left: -360, behavior: 'smooth' });
  };

  const handleScrollRight = (): void => {
    containerRef.current!.scrollBy({ left: 360, behavior: 'smooth' });
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
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('scroll', checkScrollPosition);
    }
    checkScrollPosition();

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [startX, scrollLeft]);

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
          className='text-secondary bg-primary opacity-[65%] hover:opacity-100 transition-opacity duration-300'
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '25px',
            height: '100%', 
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
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
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
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
          className='text-secondary bg-primary opacity-75 hover:opacity-100 transition-opacity duration-300'
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '25px',
            height: '100%',
            // backgroundColor: 'rgba(0, 0, 0, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
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