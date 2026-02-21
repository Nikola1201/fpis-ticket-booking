import type { HomePageViewModel } from '../types/home';
import * as api from './apiConnection';


export async function fetchHomePage(): Promise<HomePageViewModel> {
  console.log(import.meta.env.VITE_API_BASE_URL, import.meta.env.VITE_API_KEY);
  const response = await api.getSingle<HomePageViewModel>('/home');
  console.log('Fetched home page data:', response);

  return response as HomePageViewModel;
}
