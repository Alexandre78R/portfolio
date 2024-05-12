import React from 'react';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { skill } from './typeSkills';


const Skills: React.FC<skill> = ({ category, skills }) => {
  return (
    <div 
      className="flex-shrink-0 min-w-80 mr-2 rounded-lg bg-body text-white overflow-hidden"
      style={{ cursor: 'pointer' }}
    >
      <CardContent >
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
      </CardContent>
    </div>
  );
};

export default Skills;