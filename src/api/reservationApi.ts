import type { ReservationPageViewModel, ReservationPostDTO, ReservationDetailsDTO, ReservationUpdateDTO, ReservationPostDTOResult } from '../types/reservation';
import * as api from './apiConnection';


export async function fetchReservationPage(): Promise<ReservationPageViewModel> {
  console.log(import.meta.env.VITE_API_BASE_URL, import.meta.env.VITE_API_KEY);
  const response = await api.getSingle<ReservationPageViewModel>('/reservation');
  console.log('Fetched reservation page data:', response);

  return response as ReservationPageViewModel;
}

export async function submitReservation(data: ReservationPostDTO): Promise<ReservationPostDTOResult> {
  const response = await api.post<ReservationPostDTO, ReservationPostDTOResult>('/reservation', data);
  return response;
}
  
export async function getReservationDetails(accessToken: string, email: string): Promise<ReservationDetailsDTO> {
  const response = await api.getSingle<ReservationDetailsDTO>(`/reservation/details?accessToken=${accessToken}&email=${email}`);
  return response as ReservationDetailsDTO;
}

export async function updateReservation(data: ReservationUpdateDTO): Promise<ReservationUpdateDTO> {
  const response = await api.put<ReservationUpdateDTO>('/reservation', data);
  return response;
}

export async function cancelReservation(reservationId: string, customerEmail: string, accessToken: string): Promise<void> {
  await api.deleteRequest<void>(
    `/reservation/${reservationId}`,
    { customerEmail, accessToken }
  );
}