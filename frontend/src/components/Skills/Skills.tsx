import React from 'react';
import { Card, Typography } from '@mui/material';
import { skills, skill } from './typeSkills';

const Skills: React.FC<skills> = ({ category, skills }): React.ReactElement => {
  return (
    <Card 
      className="flex-shrink-0 min-w-80 mr-2 rounded-lg text-white overflow-hidden ml-3 p-5 lg:ml-10"
      style={{ cursor: 'pointer', backgroundColor : "var(--body-color)"}}
    >
      <div >
        <Typography variant="h6" component="h6" className="text-lg text-text font-bold mb-2">
          {category} 
        </Typography>
        <div className="flex flex-col">
          {skills.map((skill: skill, index: number) => (
            index % 2 === 0 && (
              <div key={index} className="flex justify-between mb-2">
                <Typography variant="body1" component="p">
                  <img alt={skill.name} src={skill.image} style={{ cursor: 'auto' }} />
                </Typography>
                {skills[index + 1] && (
                  <Typography variant="body1" component="p">
                    <img alt={skills[index + 1].name} src={skills[index + 1].image} style={{ cursor: 'auto' }} />
                  </Typography>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Skills;