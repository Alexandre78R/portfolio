import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { educationsData } from "@/Data/educationsData";

type Education = {
  id: number;
  title?: string;
  titleFR: string;
  titleEN: string;
  school: string;
  location: string;
  year: number;
}

type EducationsState = {
  dataEducations: Education[];
}

const initialState: EducationsState = {
  dataEducations: educationsData,
};

const educationsSlice = createSlice({
  name: 'educations',
  initialState,
  reducers: {
    setEducations(state, action: PayloadAction<Education[]>) {
      state.dataEducations = action.payload;
    },
    updateEducationsTitle(state, action: PayloadAction<string>) {
      const lang = action.payload;
      state.dataEducations = educationsData.map(education => ({
        ...education,
        title: lang === "fr" ? education.titleFR : education.titleEN,
      }));
    },
  },
});

export const { setEducations, updateEducationsTitle } = educationsSlice.actions;
export default educationsSlice.reducer;