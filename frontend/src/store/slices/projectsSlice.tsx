import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SkillsProject = {
  name: string;
  image: string;
};

export type Project = {
  id: number;
  title: string;
  descriptionFR: string;
  descriptionEN: string;
  typeDisplay: string;
  github: string | null;
  contentDisplay: string;
  image: string | null;
  video: string | null;
  skills: SkillsProject[];
};

export type ProjectsState = {
  dataProjects: Project[];
};

const initialState: ProjectsState = {
  dataProjects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.dataProjects = action.payload;
    },
    updateProjectDescriptions(state, action: PayloadAction<string>) {
      const lang = action.payload;
      state.dataProjects = state.dataProjects.map((project) => ({
        ...project,
        description:
          lang === "fr" ? project.descriptionFR : project.descriptionEN,
      })) as any;
    },
  },
});

export const { setProjects, updateProjectDescriptions } = projectsSlice.actions;
export default projectsSlice.reducer;