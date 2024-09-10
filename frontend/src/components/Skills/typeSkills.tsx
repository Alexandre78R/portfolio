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
