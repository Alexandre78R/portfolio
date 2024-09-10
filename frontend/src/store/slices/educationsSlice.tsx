import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { educationsData } from "@/Data/educationsData";

export type EducationType = {
  id: number;
  title?: string;
  titleFR: string;
  titleEN: string;
  diplomaLevel?: string;
  diplomaLevelFR: string;
  diplomaLevelEN: string;
  school: string;
  location: string;
  year: number;
  startDateEN: string;
  startDateFR: string;
  startDate?: string;
  endDateEN: string;
  endDateFR: string;
  endDate?: string;
  month: number | null;
  typeEN: string;
  typeFR: string;
  type?: string;
};

type EducationsState = {
  dataEducations: EducationType[];
};

const initialState: EducationsState = {
  dataEducations: educationsData,
};

const educationsSlice = createSlice({
  name: "educations",
  initialState,
  reducers: {
    setEducations(state, action: PayloadAction<EducationType[]>) {
      state.dataEducations = action.payload;
    },
    updateEducationsTitle(state, action: PayloadAction<string>) {
      const lang = action.payload;
      state.dataEducations = educationsData.map((education) => ({
        ...education,
        title: lang === "fr" ? education.titleFR : education.titleEN,
        diplomaLevel:
          lang === "fr" ? education.diplomaLevelFR : education.diplomaLevelEN,
        startDate:
          lang === "fr" ? education.startDateFR : education.startDateEN,
        endDate: lang === "fr" ? education.endDateFR : education.endDateEN,
        type: lang === "fr" ? education.typeFR : education.typeEN,
      }));
    },
  },
});

export const { setEducations, updateEducationsTitle } = educationsSlice.actions;
export default educationsSlice.reducer;
