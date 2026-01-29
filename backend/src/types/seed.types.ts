export interface SkillData {
  name: string;
  image: string;
}

export interface SkillCategoryData {
  id: number;
  categoryEN: string;
  categoryFR: string;
  skills: SkillData[];
}

export interface ProjectSkillData {
  name: string;
}

export interface ProjectData {
  title: string;
  descriptionEN: string;
  descriptionFR: string;
  typeDisplay: string;
  github?: string | null;
  contentDisplay?: string | undefined;
  image?: string | null;
  video?: string | null;
  skills: ProjectSkillData[];
}

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

export interface SignatureData {
  name: string;
  description: string;
}

export interface AboutMeData {
  titleEN: string;
  titleFR: string;
  descriptionEN: string;
  descriptionFR: string;
  isVisible?: boolean;
}