import type { ReservationZone, TicketRequest } from "../types/reservation";
import React from "react";
import "../styles/cart-style.css";

export const TicketCart: React.FC<{tickets: TicketRequest[]; zones: ReservationZone[]; onRemove: (zoneId: string) => void;}> = ({ tickets, zones, onRemove }) => {
  if (tickets.length === 0) return null;
  return (
    <div className="ticket-cart">
      <h4>Tickets in Cart</h4>
      <ul>
        {tickets.map((ticket) => {
          const zone = zones.find((z) => z.id === ticket.zoneId);
          return (
            <li key={ticket.zoneId} className="ticket-cart-item">
              <span>
                {zone ? zone.name : "Zone"} &times; {ticket.quantity}
              </span>
              <button
                className="remove-ticket-btn"
                onClick={() => onRemove(ticket.zoneId)}
                type="button"
                aria-label="Remove"
              >
                &times;
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
