import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SkillSubItem = {
  name: string;
  image: string;
};

type Skill = {
  id: number;
  categoryFR: string;
  categoryEN: string;
  category?: string;
  skills: SkillSubItem[];
};

type SkillsState = {
  dataSkills: Skill[];
};

const initialState: SkillsState = {
  dataSkills: [],
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    setSkills(state, action: PayloadAction<Skill[]>) {
      state.dataSkills = action.payload;
    },
    updateSkillCategories(state, action: PayloadAction<string>) {
      const lang = action.payload;
      state.dataSkills = state.dataSkills.map((skill) => ({
        ...skill,
        category: lang === "fr" ? skill.categoryFR : skill.categoryEN,
      }));
    },
  },
});

export const { setSkills, updateSkillCategories } = skillsSlice.actions;
export default skillsSlice.reducer;