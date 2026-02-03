import Lang from "@/lang/typeLang";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AboutMe = {
  id: number;
  titleEN: string;
  titleFR: string;
  descriptionEN: string;
  descriptionFR: string;
};

export type AboutMeState = {
  dataAboutMe: AboutMe | null;
};

const initialState: AboutMeState = {
  dataAboutMe: null,
};

const aboutMeSlice = createSlice({
  name: "aboutMe",
  initialState,
  reducers: {
    setAboutMe(state, action: PayloadAction<AboutMe | null>) {
      state.dataAboutMe = action.payload;
    },
    updateAboutMeContent(state, action: PayloadAction<Lang["file"]>) {
      if (!state.dataAboutMe) return;
      
      const lang: Lang["file"] = action.payload;
      state.dataAboutMe = {
        ...state.dataAboutMe,
        title: lang === "fr" ? state.dataAboutMe.titleFR : state.dataAboutMe.titleEN,
        description: lang === "fr" ? state.dataAboutMe.descriptionFR : state.dataAboutMe.descriptionEN,
      } as any;
    },
  },
});

export const { setAboutMe, updateAboutMeContent } = aboutMeSlice.actions;
export default aboutMeSlice.reducer;
