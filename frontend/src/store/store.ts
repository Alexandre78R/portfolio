import { configureStore } from "@reduxjs/toolkit";

import skillsReducer from "./slices/skillsSlice";
import projectsReducer from "./slices/projectsSlice";
import educationsReducer from "./slices/educationsSlice";
import experiencesReducer from "./slices/experiencesSlice";
import socialsReducer from "./slices/socialsSlice";
import aboutMeReducer from "./slices/aboutMeSlice";

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    projects: projectsReducer,
    educations: educationsReducer,
    experiences: experiencesReducer,
    socials: socialsReducer,
    aboutMe: aboutMeReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;