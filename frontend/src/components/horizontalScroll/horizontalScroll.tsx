import React, { useState, useEffect, useRef, MouseEvent} from 'react';
import Skills from '../Skills/Skills';
import { skills } from '../Skills/typeSkills';
import Projects from '../Projects/Projects';
import { Project } from '../Projects/typeProjects';

type Props = {
  data: any;
  category: string;
}

const HorizontalScroll: React.FC<Props> = ({ data, category }) => {

  const containerRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isClickOnImage, setIsClickOnImage] = useState<boolean>(false);

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) : void => {
    setIsDragging(true);
    setStartX(event.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    const target: HTMLElement = event.target as HTMLElement; 
    if (target.tagName === 'IMG') {
      setIsClickOnImage(true);
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) : number  => {
    if (!isDragging || isClickOnImage) return containerRef.current.scrollLeft;
    const x: number = event.pageX - containerRef.current.offsetLeft;
    const walk: number = (x - startX) * 1.0;
    return containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () : void => {
    setIsDragging(false);
    setIsClickOnImage(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () : void => {
      if (isDragging) {
        setIsDragging(false);
        setIsClickOnImage(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    containerRef?.current?.addEventListener('mousedown', handleMouseDown);
    containerRef?.current?.addEventListener('mouseup', handleMouseUp);

    return () => {
      containerRef?.current?.removeEventListener('mousedown', handleMouseDown);
      containerRef?.current?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [startX, scrollLeft]);

  useEffect(() => {
    if (isDragging && !isClickOnImage) {
      containerRef?.current?.addEventListener('mousemove', handleMouseMove);
    } else {
      containerRef?.current?.removeEventListener('mousemove', handleMouseMove);
    }
    return () => {
      containerRef?.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, isClickOnImage]);

  return (
    <div style={{ position: 'relative' }} key={category}>
      <div
        ref={containerRef}
        className="flex flex-row overflow-x-auto overflow-y-hidden p-2 custom-scrollbar"
        style={{ userSelect: 'none' }}
      >
        { category === "skills" &&
          data?.map((skill: skills) => (
              <Skills key={skill.id} category={skill.category} skills={skill.skills} />
          ))
        }

        { category === "projects" &&
          data?.map((project: Project) => (
              <Projects key={project.id} project={project} />
          ))
        }
      </div>
    </div>
  );
};

export default HorizontalScroll;