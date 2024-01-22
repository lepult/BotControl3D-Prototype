import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllDestinationsFetch } from '../../api/destination/getAllDestinations';

export const getAllDestinationsAction = createAsyncThunk(
    'destination/getAllDestinations',
    async () => getAllDestinationsFetch(),
)