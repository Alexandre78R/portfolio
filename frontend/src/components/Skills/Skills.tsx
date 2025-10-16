import React, { FC, ReactElement } from "react";
import { Card, Typography } from "@mui/material";
import { Skill, SkillsCategory } from "./typeSkills";

const Skills: FC<SkillsCategory> = ({ category, skills }): JSX.Element => {
  return (
    <Card
      className="flex-shrink-0 w-[350px] rounded-lg text-white overflow-hidden"
      style={{ cursor: "pointer", backgroundColor: "var(--body-color)" }}
    >
      <div className="ml-6">
        <p className="text-md text-text font-bold mb-2">{category}</p>
        <div className="flex flex-col">
          {skills.map((skillItem: Skill, index: number) =>
            index % 2 === 0 ? (
              <div key={index} className="flex items-center mb-2">
                <Typography variant="body1" component="p" className="flex-1">
                  <img alt={skillItem.name} src={skillItem.image} />
                </Typography>

                {skills[index + 1] && (
                  <Typography
                    variant="body1"
                    component="p"
                    className="flex-1 ml-2"
                  >
                    <img
                      alt={skills[index + 1].name}
                      src={skills[index + 1].image}
                    />
                  </Typography>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </Card>
  );
};

export default Skills;
