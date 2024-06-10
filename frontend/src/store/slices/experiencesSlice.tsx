import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { experiencesData } from "@/Data/experiencesData";

type Experience = {
  id: number,
  jobEN: string,
  jobFR: string,
  job?: string,
  business: string,
  employmentContractEN: string | null,
  employmentContractFR: string | null,
  employmentContract?: string | null,
  startDateEN: string,
  startDateFR: string,
  startDate?: string,
  endDateEN: string,
  endDateFR: string,
  endDate?: string,
}

type ExperiencesState = {
  dataExperiences: Experience[];
}

const initialState: ExperiencesState = {
  dataExperiences: experiencesData,
};

const experiencesSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {
    setExperiences(state, action: PayloadAction<Experience[]>) {
      state.dataExperiences = action.payload;
    },
    updateExperiences(state, action: PayloadAction<string>) {
      const lang = action.payload;
      state.dataExperiences = experiencesData.map(experience => ({
        ...experience,
        job: lang === "fr" ? experience.jobFR : experience.jobEN,
        employmentContract: lang === "fr" ? experience.employmentContractFR : experience.employmentContractEN,
        startDate: lang === "fr" ? experience.startDateFR : experience.startDateEN,
        endDate: lang === "fr" ? experience.endDateFR : experience.endDateEN,
      }));
    },
  },
});

export const { setExperiences, updateExperiences } = experiencesSlice.actions;
export default experiencesSlice.reducer;