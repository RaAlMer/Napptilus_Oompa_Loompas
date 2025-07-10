import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas';

export const fetchOompas = createAsyncThunk(
  'list/fetchOompas',
  async (page = 1) => {
    const res = await fetch(`${API_URL}?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data; // contains { current, total, results }
  }
);

const initialState = {
  oompas: [],
  page: 1,
  totalPages: null,
  lastFetched: null,
  loading: false,
  error: null,
  searchTerm: '',
};

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOompas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOompas.fulfilled, (state, action) => {
        const { current, total, results } = action.payload;

        const newOompas = results.filter(
          (oompa) => !state.oompas.some((existing) => existing.id === oompa.id)
        );

        state.oompas = [...state.oompas, ...newOompas];
        state.page = current;
        state.totalPages = total;
        state.loading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchOompas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm } = listSlice.actions;
export default listSlice.reducer;
