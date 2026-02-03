export type skills = {
  id?: number;
  category: string;
  skills: any;
};

export type skill = {
  name: string;
  image: string;
};

export type SkillTab = {
  id?: number;
  category: string;
  skills: skill;
};


export type Skill = {
  name: string;
  image: string;
};

export type SkillsCategory = {
  id?: number;
  category: string;
  skills: Skill[];
};