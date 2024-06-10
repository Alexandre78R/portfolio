import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { projectsData } from '@/Data/projectsData';

type SkillsProject = { 
    name: string;
    image: string;
}

type Project = {
    id: number;
    title: string;
    descriptionFR: string;
    descriptionEN: string;
    typeDisplay: string;
    github: string;
    contentDisplay: string;
    skills: SkillsProject[];
}

type ProjectsState = {
  dataProjects: Project[];
}

const initialState: ProjectsState = {
  dataProjects: projectsData,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.dataProjects = action.payload;
    },
    updateProjectDescriptions(state, action: PayloadAction<string>) {
      const lang = action.payload;
      state.dataProjects = projectsData?.slice().reverse().map(project => ({
        ...project,
        description: lang === "fr" ? project.descriptionFR : project.descriptionEN,
      }));
    },
  },
});

export const { setProjects, updateProjectDescriptions } = projectsSlice.actions;
export default projectsSlice.reducer;