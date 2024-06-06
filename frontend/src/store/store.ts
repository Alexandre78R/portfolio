import { configureStore } from '@reduxjs/toolkit';

// Importez vos slices ici
import userReducer from './slices/userSlice';
import skillsReducer from './slices/skillsSlice';

const store = configureStore({
  reducer: {
    // Ajoutez vos reducers ici
    user: userReducer,
    skills: skillsReducer,
  },
});

// Types pour RootState et AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;