import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Social = {
  id: number;
  title: string;
  url: string;
  tab: number;
};

export type SocialsState = {
  dataSocials: Social[];
};

const initialState: SocialsState = {
  dataSocials: [],
};

const socialsSlice = createSlice({
  name: "socials",
  initialState,
  reducers: {
    setSocials(state, action: PayloadAction<Social[]>) {
      state.dataSocials = action.payload;
    },
  },
});

export const { setSocials } = socialsSlice.actions;
export default socialsSlice.reducer;
