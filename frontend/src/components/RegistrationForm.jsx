import { useEffect, useState } from "react";
import { registerUser } from "../services/userService.js";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
};

function validateForm(form) {
  const errors = {};
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone = /^\+?[0-9][0-9\s().-]{5,18}[0-9]$/;
  const digitCount = (form.mobileNumber.match(/\d/g) || []).length;

  if (!form.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!form.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!form.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!email.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.mobileNumber.trim()) {
    errors.mobileNumber = "Enter your mobile number.";
  } else if (!phone.test(form.mobileNumber.trim()) || digitCount < 7 || digitCount > 15) {
    errors.mobileNumber = "Enter a valid number with 7–15 digits.";
  }
  return errors;
}

function getErrorMessage(error) {
  const response = error.response?.data;
  if (response?.fieldErrors) {
    return Object.values(response.fieldErrors).join(" ");
  }
  if (response?.message) return response.message;
  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }
  if (!error.response) {
    return "Could not connect to the server. Check that the backend is running.";
  }
  return "Registration could not be completed. Please try again.";
}

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setNotice(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setNotice(null);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await registerUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
      });
      setForm(initialForm);
      setErrors({});
      setNotice({ type: "success", text: "You're registered! Your details have been saved." });
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} noValidate>
      {notice && (
        <div className={`notice notice-${notice.type}`} role="status" aria-live="polite">
          <span className="notice-icon" aria-hidden="true">
            {notice.type === "success" ? "✓" : "!"}
          </span>
          <span>{notice.text}</span>
        </div>
      )}

      <div className="name-row">
        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="e.g. Alex"
            value={form.firstName}
            onChange={handleChange}
            maxLength={80}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
          {errors.firstName && <span className="field-error" id="firstName-error">{errors.firstName}</span>}
        </div>
        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="e.g. Morgan"
            value={form.lastName}
            onChange={handleChange}
            maxLength={80}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
          {errors.lastName && <span className="field-error" id="lastName-error">{errors.lastName}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          maxLength={254}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : "email-hint"}
        />
        {errors.email ? (
          <span className="field-error" id="email-error">{errors.email}</span>
        ) : (
          <span className="field-hint" id="email-hint">We’ll use this to identify your registration.</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="mobileNumber">Mobile number</label>
        <input
          id="mobileNumber"
          name="mobileNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+1 (555) 123-4567"
          value={form.mobileNumber}
          onChange={handleChange}
          maxLength={25}
          aria-invalid={Boolean(errors.mobileNumber)}
          aria-describedby={errors.mobileNumber ? "mobileNumber-error" : "mobileNumber-hint"}
        />
        {errors.mobileNumber ? (
          <span className="field-error" id="mobileNumber-error">{errors.mobileNumber}</span>
        ) : (
          <span className="field-hint" id="mobileNumber-hint">Include your country code if needed.</span>
        )}
      </div>

      <button className="submit-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Creating your account…
          </>
        ) : (
          <>
            Create account
            <span className="button-arrow" aria-hidden="true">→</span>
          </>
        )}
      </button>
      <p className="required-note"><span aria-hidden="true">*</span> All fields are required</p>
    </form>
  );
}
