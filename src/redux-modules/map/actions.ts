import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllMapsFetch } from '../../api/map/getAllMaps';

export const getAllMapsAction = createAsyncThunk(
    'map/getAllMaps',
    async () => getAllMapsFetch(),
)