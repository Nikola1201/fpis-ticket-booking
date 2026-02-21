import React, { useEffect, useState } from "react";
import type {
  ReservationPageViewModel,
  ReservationDate,
  ReservationZone,
  ReservationCustomerForm,
  TicketRequest,
  CustomerFormRequest,
} from "../../types/reservation";
import { ReservationForm } from "../../components/ReservationForm";
import { TicketCart } from "../../components/TicketCart";
import { fetchReservationPage } from "../../api/reservationApi";
import { submitReservation } from "../../api/reservationApi";
import "../../styles/reservation-style.css";
import "../../styles/modal-style.css";

const ReservationPage: React.FC = () => {
  const [data, setData] = useState<ReservationPageViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<ReservationDate | null>(
    null
  );
  const [selectedZone, setSelectedZone] = useState<ReservationZone | null>(
    null
  );
  const [ticketCount, setTicketCount] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [customerForm, setCustomerForm] = useState<
    Partial<ReservationCustomerForm>
  >({});
  const [ticketRequests, setTicketRequests] = useState<TicketRequest[]>([]);
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({ open: false, message: "", type: "success" });

  useEffect(() => {
    fetchReservationPage()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="reservation-root">Loading...</div>;
  if (!data)
    return (
      <div className="reservation-root">Failed to load reservation page.</div>
    );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value,
    });
  };

  // Add or update ticket request in the cart
  const handleAddToCart = () => {
    if (!selectedZone || ticketCount < 1) return;
    setTicketRequests((prev) => {
      const existing = prev.find((t) => t.zoneId === selectedZone.id);
      if (existing) {
        // Update quantity (replace with new value)
        return prev.map((t) =>
          t.zoneId === selectedZone.id ? { ...t, quantity: ticketCount } : t
        );
      }
      // Add new ticket request
      return [...prev, { zoneId: selectedZone.id, quantity: ticketCount }];
    });
    setShowForm(false);
  };

  // Remove ticket request from the cart
  const handleRemoveTicket = (zoneId: string) => {
    setTicketRequests((prev) => prev.filter((t) => t.zoneId !== zoneId));
  };

  const handleReservationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedDate) {
      setModal({
        open: true,
        message: "Please select a concert date.",
        type: "error",
      });
      return;
    }
    if (ticketRequests.length === 0) {
      setModal({
        open: true,
        message: "Please add at least one ticket to your cart.",
        type: "error",
      });
      return;
    }

    // Map ReservationCustomerForm to CustomerCreateDTO
    const customer: CustomerFormRequest = {
      firstName: customerForm.firstNameLabel || "",
      lastName: customerForm.lastNameLabel || "",
      email: customerForm.emailLabel || "",
      confirmedEmail: customerForm.confirmEmailLabel || "",
      phoneNumber: customerForm.phoneNumberLabel || "",
      address: customerForm.addressLabel || "",
      address2: customerForm.address2Label || "",
      city: customerForm.cityLabel || "",
      postalCode: customerForm.postalCodeLabel || "",
      country: customerForm.countryLabel || "",
      company: customerForm.companyLabel || "",
    };

    const reservation: import("../../types/reservation").ReservationPostDTO = {
      customer,
      concertDateId: selectedDate.id,
      tickets: ticketRequests,
      promoCode: promoCode && promoCode.length === 10 ? promoCode : undefined,
    };

    try {
      const result = await submitReservation(reservation);
      setModal({
        open: true,
        message: "Reservation submitted successfully! Your access code is " + (result.token || ""),
        type: "success",
      });
      // Optionally reset form and cart
      setShowForm(false);
      setCustomerForm({});
      setPromoCode("");
      setTicketRequests([]);
      setSelectedDate(null);
      setSelectedZone(null);
      setTicketCount(1);
    } catch {
      setModal({
        open: true,
        message: "Failed to submit reservation. Please check your input and try again.",
        type: "error",
      });
    }
  };

  // Get all zones for the selected date (for cart display)
  const zonesForCart =
    selectedDate?.zones || data.dates.flatMap((d) => d.zones);

  return (
    <div className="reservation-root">
      <div className="reservation-content">
        {/* Modal */}
        {modal.open && (
          <div className={`modal-overlay`}>
            <div className={`modal-box modal-${modal.type}`}>
              <p>{modal.message}</p>
              <button
                className="modal-close-btn"
                onClick={() => setModal({ ...modal, open: false })}
                autoFocus
              >
                Close
              </button>
            </div>
          </div>
        )}
        <img
          className="reservation-image"
          src={data.imageUrl}
          alt={data.title}
        />
        <h1 className="reservation-title">{data.title}</h1>
        <h2 className="reservation-subtitle">{data.subtitle}</h2>
        <p className="reservation-description">{data.description}</p>
        <div className="concert-details">
          <h3>Concert Details</h3>
          <p>
            <strong>Title:</strong> {data.concert.title}
          </p>
          <p>
            <strong>City:</strong> {data.concert.city}
          </p>
          <p>
            <strong>Venue:</strong> {data.concert.venue}
          </p>
          <p>
            <strong>Address:</strong> {data.concert.address}
          </p>
          <p>
            <strong>Info:</strong> {data.concert.additionalInfo}
          </p>
        </div>
        <div className="date-select">
          <label htmlFor="date">Choose a date:</label>
          <select
            id="date"
            value={selectedDate?.id || ""}
            onChange={(e) => {
              const date =
                data.dates.find((d) => d.id === e.target.value) || null;
              setSelectedDate(date);
              setSelectedZone(null);
              setTicketCount(1);
            }}
          >
            <option value="">-- Select Date --</option>
            {data.dates.map((date) => (
              <option key={date.id} value={date.id}>
                {new Date(date.date).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        {selectedDate && (
          <div className="zone-select">
            <label htmlFor="zone">Choose a zone:</label>
            <select
              id="zone"
              value={selectedZone?.id || ""}
              onChange={(e) => {
                const zone =
                  selectedDate.zones.find((z) => z.id === e.target.value) ||
                  null;
                setSelectedZone(zone);
                setTicketCount(1);
              }}
            >
              <option value="">-- Select Zone --</option>
              {selectedDate.zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} (Price: {zone.price}€, Remaining:{" "}
                  {zone.capacityRemaining}/{zone.capacity})
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedZone && (
          <div className="ticket-select">
            <label htmlFor="ticketCount">Number of tickets:</label>
            <input
              id="ticketCount"
              type="number"
              min={1}
              max={selectedZone.capacityRemaining}
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
            />

            <div className="zone-info">
              <p>
                <strong>Zone:</strong> {selectedZone.name}
              </p>
              {/* Early Bird Discount Logic */}
              {(() => {
                const earlyBirdUntilStr =
                  data.appSettings?.EarlyBirdDiscountDaysBefore;
                const earlyBirdPercentStr =
                  data.appSettings?.EarlyBirdDiscountPercentage;
                const earlyBirdDays = earlyBirdUntilStr
                  ? parseInt(earlyBirdUntilStr, 10)
                  : null;
                const earlyBirdPercent = earlyBirdPercentStr
                  ? parseFloat(earlyBirdPercentStr)
                  : null;

                const concertDate = selectedDate
                  ? new Date(selectedDate.date)
                  : null;
                const now = new Date();

                let isEarlyBird = false;
                if (concertDate && earlyBirdDays !== null) {
                  const diffDays = Math.ceil(
                    (concertDate.getTime() - now.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  isEarlyBird = diffDays >= earlyBirdDays;
                }

                if (isEarlyBird && earlyBirdPercent) {
                  const discounted = (
                    selectedZone.price *
                    (1 - earlyBirdPercent / 100)
                  ).toFixed(2);
                  return (
                    <p>
                      <strong>Price per ticket:</strong>
                      <span className="price-strikethrough">
                        {selectedZone.price}€
                      </span>
                      <span className="price-discounted">{discounted}€</span>
                      <span className="price-earlybird">
                        (Early Bird -{earlyBirdPercent}%)
                      </span>
                    </p>
                  );
                } else {
                  return (
                    <p>
                      <strong>Price per ticket:</strong> {selectedZone.price}€
                    </p>
                  );
                }
              })()}
              <p>
                <strong>Available:</strong> {selectedZone.capacityRemaining} /{" "}
                {selectedZone.capacity}
              </p>
            </div>
            {!showForm && (
              <button
                className="reserve-btn add-to-cart-btn"
                onClick={handleAddToCart}
                type="button"
              >
                Add to Cart
              </button>
            )}
            {/* Reserve Button */}
            {!showForm && (
              <button
                className="reserve-btn"
                onClick={() => setShowForm(true)}
                type="button"
              >
                Reserve your spot now
              </button>
            )}
          </div>
        )}
        {/* Ticket Cart */}
        <TicketCart
          tickets={ticketRequests}
          zones={zonesForCart}
          onRemove={handleRemoveTicket}
        />
        {/* Reservation Form */}
        {showForm && (
          <ReservationForm
            customerForm={customerForm}
            customerFormLabels={data.customerForm}
            promoCode={promoCode}
            onChange={handleFormChange}
            onPromoCodeChange={(e) => setPromoCode(e.target.value)}
            onSubmit={handleReservationSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ReservationPage;