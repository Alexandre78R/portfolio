import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { skillsData } from '@/Data/skillsData';

type SkillSubItem = {
  name: string;
  image: string;
}

type Skill = {
  id: number;
  categoryFR: string;
  categoryEN: string;
  skills: SkillSubItem[];
}

type SkillsState = {
  dataSkills: Skill[];
}

const initialState: SkillsState = {
  dataSkills: skillsData,
};

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSkills(state, action: PayloadAction<Skill[]>) {
      state.dataSkills = action.payload;
    },
    updateSkillCategories(state, action: PayloadAction<string>) {
      const lang = action.payload;
      state.dataSkills = skillsData.map(skill => ({
        ...skill,
        category: lang === "fr" ? skill.categoryFR : skill.categoryEN,
      }));
    },
  },
});

export const { setSkills, updateSkillCategories } = skillsSlice.actions;
export default skillsSlice.reducer;