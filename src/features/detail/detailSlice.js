import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDetail = createAsyncThunk(
  'detail/fetchDetail',
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch detail');
      }
      const data = await response.json();
      return { id, data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const detailSlice = createSlice({
  name: 'detail',
  initialState: {
    entities: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDetail.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.entities[id] = {
          data,
          lastFetched: Date.now(),
        };
        state.status = 'succeeded';
      })
      .addCase(fetchDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default detailSlice.reducer;
