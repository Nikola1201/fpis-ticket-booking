import React, { useState } from "react";
import type { ReservationCustomerForm } from "../types/reservation";

interface ReservationFormProps {
  customerForm: Partial<ReservationCustomerForm>;
  customerFormLabels: ReservationCustomerForm;
  promoCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPromoCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const requiredFields = [
  "firstNameLabel",
  "lastNameLabel",
  "emailLabel",
  "confirmEmailLabel",
  "addressLabel",
  "cityLabel",
  "postalCodeLabel",
  "countryLabel",
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d+\-\s()]{7,}$/;

export const ReservationForm: React.FC<ReservationFormProps> = ({
  customerForm,
  customerFormLabels,
  promoCode,
  onChange,
  onPromoCodeChange,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    requiredFields.forEach((key) => {
      const value = customerForm[key as keyof ReservationCustomerForm];
      if (!value || value.trim() === "") {
        newErrors[key] = "Required";
      }
    });

    // String length checks
    if (
      customerForm.firstNameLabel &&
      customerForm.firstNameLabel.length > 100
    ) {
      newErrors.firstNameLabel = "Max 100 characters";
    }
    if (
      customerForm.lastNameLabel &&
      customerForm.lastNameLabel.length > 100
    ) {
      newErrors.lastNameLabel = "Max 100 characters";
    }
    if (
      customerForm.addressLabel &&
      customerForm.addressLabel.length > 200
    ) {
      newErrors.addressLabel = "Max 200 characters";
    }
    if (
      customerForm.address2Label &&
      customerForm.address2Label.length > 200
    ) {
      newErrors.address2Label = "Max 200 characters";
    }
    if (
      customerForm.cityLabel &&
      customerForm.cityLabel.length > 100
    ) {
      newErrors.cityLabel = "Max 100 characters";
    }
    if (
      customerForm.postalCodeLabel &&
      customerForm.postalCodeLabel.length > 20
    ) {
      newErrors.postalCodeLabel = "Max 20 characters";
    }
    if (
      customerForm.countryLabel &&
      customerForm.countryLabel.length > 100
    ) {
      newErrors.countryLabel = "Max 100 characters";
    }
    if (
      customerForm.companyLabel &&
      customerForm.companyLabel.length > 100
    ) {
      newErrors.companyLabel = "Max 100 characters";
    }

    // Email format
    if (
      customerForm.emailLabel &&
      !emailRegex.test(customerForm.emailLabel)
    ) {
      newErrors.emailLabel = "Invalid email";
    }
    if (
      customerForm.confirmEmailLabel &&
      !emailRegex.test(customerForm.confirmEmailLabel)
    ) {
      newErrors.confirmEmailLabel = "Invalid email";
    }
    // Email match
    if (
      customerForm.emailLabel &&
      customerForm.confirmEmailLabel &&
      customerForm.emailLabel !== customerForm.confirmEmailLabel
    ) {
      newErrors.confirmEmailLabel = "Emails do not match";
    }

    // Phone (optional, but if present, must be valid)
    if (
      customerForm.phoneNumberLabel &&
      customerForm.phoneNumberLabel.length > 0 &&
      !phoneRegex.test(customerForm.phoneNumberLabel)
    ) {
      newErrors.phoneNumberLabel = "Invalid phone";
    }

    // Promo code (optional, but if present, must be exactly 10 chars)
    if (
      promoCode &&
      promoCode.length !== 10
    ) {
      newErrors.promoCode = "Promo code must be exactly 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validate()) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  };

  return (
    <form className="reservation-form" onSubmit={handleSubmit} noValidate>
      <h3>Reservation Details</h3>
      {Object.entries(customerFormLabels).map(([key, label]) => (
        <div key={key} className="reservation-form-group">
          <label htmlFor={key} className="reservation-form-label">
            {label}
          </label>
          <input
            type="text"
            id={key}
            name={key}
            value={customerForm[key as keyof ReservationCustomerForm] || ""}
            onChange={onChange}
            className="reservation-form-input"
          />
          {errors[key] && (
            <span className="reservation-form-error">{errors[key]}</span>
          )}
        </div>
      ))}
      <div className="reservation-form-group">
        <label htmlFor="promoCode" className="reservation-form-label">
          Promo Code
        </label>
        <input
          type="text"
          id="promoCode"
          name="promoCode"
          value={promoCode}
          onChange={onPromoCodeChange}
          className="reservation-form-input"
        />
        {errors.promoCode && (
          <span className="reservation-form-error">{errors.promoCode}</span>
        )}
      </div>
      <button type="submit" className="reserve-btn">
        Submit Reservation
      </button>
    </form>
  );
};