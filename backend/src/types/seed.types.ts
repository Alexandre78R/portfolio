// Skill individuelle
export interface SkillData {
  name: string;
  image: string;
}

// Catégorie de skill avec skills imbriqués
export interface SkillCategoryData {
  id: number;
  categoryEN: string;
  categoryFR: string;
  skills: SkillData[];
}

// Pour les projets
export interface ProjectSkillData {
  name: string; // le nom de la skill associée au projet
}

export interface ProjectData {
  title: string;
  descriptionEN: string;
  descriptionFR: string;
  typeDisplay: string;
  github?: string | null;
  contentDisplay?: string | undefined;
  skills: ProjectSkillData[];
}

// Pour l'éducation
export interface EducationData {
  titleEN: string;
  titleFR: string;
  diplomaLevelEN: string;
  diplomaLevelFR: string;
  school: string;
  location: string;
  year: number;
  startDateEN: string;
  startDateFR: string;
  endDateEN: string;
  endDateFR: string;
  month: number;
  typeEN: string;
  typeFR: string;
}

// Pour les expériences
export interface ExperienceData {
  jobEN: string;
  jobFR: string;
  business: string;
  employmentContractEN: string;
  employmentContractFR: string;
  startDateEN: string;
  startDateFR: string;
  endDateEN: string;
  endDateFR: string;
  month: number;
  typeEN: string;
  typeFR: string;
}