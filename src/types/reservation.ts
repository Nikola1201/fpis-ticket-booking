export interface ReservationZone {
  id: string;
  name: string;
  capacity: number;
  capacityRemaining: number;
  price: number;
}

export interface ReservationDate {
  id: string;
  date: string; // ISO string
  zones: ReservationZone[];
}

export interface ReservationConcert {
  title: string;
  city: string;
  venue: string;
  address: string;
  dates: string[]; // ISO strings
  additionalInfo: string;
}

export interface ReservationCustomerForm {
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  phoneNumberLabel: string;
  addressLabel: string;
  address2Label: string;
  cityLabel: string;
  postalCodeLabel: string;
  countryLabel: string;
  companyLabel: string;
  confirmEmailLabel: string;
}

export interface ReservationPageViewModel {
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  customerForm: ReservationCustomerForm;
  concert: ReservationConcert;
  dates: ReservationDate[];
  appSettings: Record<string, string>;
}

export interface CustomerFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  confirmedEmail: string;
  phoneNumber: string;
  address: string;
  address2: string;
  city: string;
  postalCode: string;
  country: string;
  company: string;
}

export interface TicketRequest {
  zoneId: string; // Guid as string
  quantity: number;
}

export interface ReservationPostDTO {
  customer: CustomerFormRequest;
  concertDateId: string; // Guid as string
  tickets: TicketRequest[];
  promoCode?: string;
}

export interface ReservationTicketResponse {
  ticketId: string;
  zoneName: string;
  price: number;
}

export interface ReservationDiscountResponse {
  type: string;
  percentage: number;
}

export interface ReservationDetailsDTO {
  reservationId: string;
  status: string;
  customerName: string;
  customerEmail: string;
  accessToken: string;
  usedPromoCode: string | null;
  generatedPromoCode: string | null;
  isGeneratedPromoCodeUsed: boolean;
  tickets: ReservationTicketResponse[];
  discounts: ReservationDiscountResponse[];
  concertDate: string; // ISO string
  concertName: string;
  concertVenue: string;
  concertCity: string;
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  zonesDetails: ReservationZone[];
}
export interface ReservationUpdateDTO {
  customerEmail: string;
  accessToken: string;
  tickets: TicketRequest[];
}
export interface ReservationPostDTOResult{
  reservationId: string;
  token: string;
}