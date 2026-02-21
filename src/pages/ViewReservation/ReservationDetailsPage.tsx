import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReservationDetails,
  cancelReservation,
  updateReservation,
} from "../../api/reservationApi";
import type {
  ReservationDetailsDTO,
  ReservationUpdateDTO,
  TicketRequest,
} from "../../types/reservation";
import { TicketCart } from "../../components/TicketCart";
import "../../styles/reservation-style.css";
import "../../styles/modal-style.css";

const ReservationDetailsPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<ReservationDetailsDTO | null>(
    null
  );
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
    onClose?: () => void;
  }>({
    open: false,
    message: "",
    type: "success",
  });
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modifyTickets, setModifyTickets] = useState<TicketRequest[]>([]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setReservation(null);
    try {
      const res = await getReservationDetails(accessToken, email);
      setReservation(res);
    } catch {
      setModal({
        open: true,
        message:
          "Reservation not found. Please check your email and access token.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Group tickets by zoneName and price
  const groupedTickets =
    reservation?.tickets.reduce<
      Record<
        string,
        { zoneName: string; price: number; quantity: number; total: number }
      >
    >((acc, ticket) => {
      const key = `${ticket.zoneName}__${ticket.price}`;
      if (!acc[key]) {
        acc[key] = {
          zoneName: ticket.zoneName,
          price: ticket.price,
          quantity: 0,
          total: 0,
        };
      }
      acc[key].quantity += 1;
      acc[key].total += ticket.price;
      return acc;
    }, {}) || {};

  // --- MODIFY LOGIC ---
  const handleOpenModify = () => {
    if (!reservation) return;
    const zoneQuantities: Record<string, number> = {};
    reservation.tickets.forEach((t) => {
      const zone = reservation.zonesDetails.find((z) => z.name === t.zoneName);
      if (zone) {
        zoneQuantities[zone.id] = (zoneQuantities[zone.id] || 0) + 1;
      }
    });
    const allTickets: TicketRequest[] = reservation.zonesDetails.map(
      (zone) => ({
        zoneId: zone.id,
        quantity: zoneQuantities[zone.id] || 0,
      })
    );
    setModifyTickets(allTickets);
    setShowModifyModal(true);
  };

  const handleModifyTicketChange = (zoneId: string, quantity: number) => {
    setModifyTickets((prev) =>
      prev.map((t) =>
        t.zoneId === zoneId ? { ...t, quantity: Math.max(0, quantity) } : t
      )
    );
  };

  const handleModifyRemove = (zoneId: string) => {
    setModifyTickets((prev) =>
      prev.map((t) => (t.zoneId === zoneId ? { ...t, quantity: 0 } : t))
    );
  };

  const handleModifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reservation) return;
    setLoading(true);
    try {
      const filteredTickets = modifyTickets.filter((t) => t.quantity > 0);
      const updateDto: ReservationUpdateDTO = {
        customerEmail: reservation.customerEmail,
        accessToken: reservation.accessToken,
        tickets: filteredTickets,
      };
      await updateReservation(updateDto);
      setShowModifyModal(false);
      setModal({
        open: true,
        message: "Reservation updated successfully.",
        type: "success",
        onClose: () => navigate("/"),
      });
    } catch {
      setModal({
        open: true,
        message: "Failed to update reservation. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- CANCEL LOGIC ---
  const handleCancelReservation = async () => {
    if (!reservation) return;
    setLoading(true);
    try {
      await cancelReservation(
        reservation.reservationId,
        reservation.customerEmail,
        reservation.accessToken
      );
      setModal({
        open: true,
        message: "Reservation cancelled successfully.",
        type: "success",
        onClose: () => navigate("/"),
      });
    } catch {
      setModal({
        open: true,
        message: "Failed to cancel reservation. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (modal.onClose) {
      modal.onClose();
    } else {
      setModal({ ...modal, open: false });
    }
  };

  if (loading) {
    return (
      <main>
        <div className="reservation-root">
          <div className="reservation-content">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="reservation-root">
        <div className="reservation-content">
          {/* Modal */}
          {modal.open && (
            <div className="modal-overlay">
              <div className={`modal-box modal-${modal.type}`}>
                <p>{modal.message}</p>
                <button
                  className="modal-close-btn"
                  onClick={handleModalClose}
                  autoFocus
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {/* Modify Modal */}
          {showModifyModal && reservation && (
            <div className="modal-overlay">
              <div className="modal-box modal-success">
                <form onSubmit={handleModifySubmit}>
                  <h2>Modify Reservation</h2>
                  <h3>Tickets</h3>
                  <TicketCart
                    tickets={modifyTickets.filter((t) => t.quantity > 0)}
                    zones={reservation.zonesDetails}
                    onRemove={handleModifyRemove}
                  />
                  {reservation.zonesDetails.map((zone) => (
                    <div key={zone.id} className="reservation-form-group">
                      <label className="reservation-form-label modify-label">
                        {zone.name}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={zone.capacity}
                        value={
                          modifyTickets.find((t) => t.zoneId === zone.id)
                            ?.quantity || 0
                        }
                        onChange={(e) =>
                          handleModifyTicketChange(
                            zone.id,
                            Number(e.target.value)
                          )
                        }
                        className="reservation-form-input"
                      />
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <button className="reserve-btn" type="submit">
                      Save Changes
                    </button>
                    <button
                      className="reserve-btn"
                      type="button"
                      style={{ background: "#d32f2f" }}
                      onClick={() => setShowModifyModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {!reservation ? (
            <form
              className="reservation-form"
              onSubmit={handleSubmit}
              style={{ maxWidth: 400, margin: "0 auto" }}
            >
              <h2 style={{ marginBottom: "2rem" }}>View your reservation</h2>
              <div className="reservation-form-group">
                <label htmlFor="email" className="reservation-form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="reservation-form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="reservation-form-group">
                <label htmlFor="accessToken" className="reservation-form-label">
                  Access Token
                </label>
                <input
                  id="accessToken"
                  type="text"
                  className="reservation-form-input"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  required
                />
              </div>
              <button className="reserve-btn" type="submit">
                Submit
              </button>
            </form>
          ) : (
            <div className="reservation-details">
              <h2>Reservation Details</h2>
              <div className="details-grid">
                <div className="detail-card">
                  <h4>Reservation Information</h4>
                  <div className="info-item">
                    <strong>Status:</strong>
                    <span
                      className={`status-badge status-${reservation.status.toLowerCase()}`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Customer:</strong>
                    <span>
                      {reservation.customerName} ({reservation.customerEmail})
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Access Token:</strong>
                    <span className="access-token">
                      {reservation.accessToken}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Date:</strong>
                    <span>
                      {new Date(reservation.concertDate).toLocaleString()}
                    </span>
                  </div>
                  {/* Gift info if generated promo code is used */}
                  {reservation.isGeneratedPromoCodeUsed && (
                    <div className="info-item" style={{ marginTop: "1rem" }}>
                      <span
                        className="gift-info"
                        style={{ color: "#43a047", fontWeight: 600 }}
                      >
                        🎁 Congratulations! You will receive a gift under your
                        seat at the concert.
                      </span>
                    </div>
                  )}
                </div>
                <div className="detail-card">
                  <h4>Promo Codes</h4>
                  <div className="info-item">
                    <strong>Used Promo Code:</strong>
                    <span>{reservation.usedPromoCode || "—"}</span>
                  </div>
                  <div className="info-item">
                    <strong>Generated Promo Code:</strong>
                    <span className="access-token">
                      {reservation.generatedPromoCode || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <h3>Tickets</h3>
              <ul>
                {Object.values(groupedTickets).map(
                  ({ zoneName, price, quantity, total }) => (
                    <li className="ticket-item" key={`${zoneName}-${price}`}>
                      <div>
                        <span className="ticket-type">{zoneName}</span>
                        <span className="ticket-quantity">
                          &nbsp; {quantity} ticket{quantity > 1 ? "s" : ""} ×{" "}
                          {price}€
                        </span>
                      </div>
                      <span className="ticket-total">{total}€</span>
                    </li>
                  )
                )}
              </ul>
              {reservation.discounts && reservation.discounts.length > 0 && (
                <>
                  <h3>Discounts</h3>
                  <ul>
                    {reservation.discounts.map((d, i) => (
                      <li className="discount-item" key={i}>
                        <span className="ticket-type">{d.type}</span>
                        <span className="ticket-price">{d.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="pricing-summary">
                <div className="price-row">
                  <span className="price-label">Total Price:</span>
                  <span className="price-value">{reservation.totalPrice}€</span>
                </div>
                <div className="price-row">
                  <span className="price-label">Total Discount:</span>
                  <span className="price-value price-discount">
                    {reservation.totalDiscount ??
                      reservation.totalPrice - reservation.finalPrice}
                    €
                  </span>
                </div>
                <div className="price-row total">
                  <span className="price-label">Final Price:</span>
                  <span className="price-value price-final">
                    {reservation.finalPrice}€
                  </span>
                </div>
              </div>

              <div className="reservation-actions">
                <button
                  className="action-btn primary"
                  type="button"
                  onClick={handleOpenModify}
                >
                  <span className="btn-icon">✏️</span>
                  Modify reservation
                </button>
                <button
                  className="action-btn danger"
                  type="button"
                  onClick={handleCancelReservation}
                >
                  <span className="btn-icon">🗑️</span>
                  Cancel reservation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ReservationDetailsPage;
