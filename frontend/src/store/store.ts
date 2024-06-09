import { configureStore } from '@reduxjs/toolkit';
import skillsReducer from './slices/skillsSlice';
import projectsSlice from './slices/projectsSlice';
import educationsSlice from './slices/educationsSlice';

const store = configureStore({
  reducer: {
    skills: skillsReducer,
    projects: projectsSlice,
    educations: educationsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;