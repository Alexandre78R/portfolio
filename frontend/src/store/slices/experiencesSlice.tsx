import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ExperienceType = {
  id: number;
  jobEN: string;
  jobFR: string;
  job?: string;
  business: string;
  employmentContractEN?: string | null;
  employmentContractFR?: string | null;
  employmentContract?: string | null;
  startDateEN: string;
  startDateFR: string;
  startDate?: string;
  endDateEN: string;
  endDateFR: string;
  endDate?: string;
  month: number | null | undefined;
  typeEN: string;
  typeFR: string;
  type?: string;
};

type ExperiencesState = {
  dataExperiences: ExperienceType[];
};

const initialState: ExperiencesState = {
  dataExperiences: [],
};

const experiencesSlice = createSlice({
  name: "experiences",
  initialState,
  reducers: {
    setExperiences(state, action: PayloadAction<ExperienceType[]>) {
      state.dataExperiences = action.payload;
    },
    updateExperiences(state, action: PayloadAction<string>) {
      const lang = action.payload;
      state.dataExperiences = state.dataExperiences.map((experience) => ({
        ...experience,
        job: lang === "fr" ? experience.jobFR : experience.jobEN,
        employmentContract:
          lang === "fr"
            ? experience.employmentContractFR
            : experience.employmentContractEN,
        startDate:
          lang === "fr" ? experience.startDateFR : experience.startDateEN,
        endDate: lang === "fr" ? experience.endDateFR : experience.endDateEN,
        type: lang === "fr" ? experience.typeFR : experience.typeEN,
      }));
    },
  },
});

export const { setExperiences, updateExperiences } = experiencesSlice.actions;
export default experiencesSlice.reducer;