import RegistrationForm from "./components/RegistrationForm.jsx";

export default function App() {
  return (
    <main className="page-shell">
      <section className="intro" aria-labelledby="page-title">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">A good place to start</p>
        <h1 id="page-title">Make it official.</h1>
        <p className="intro-copy">
          Create your account in a moment. We just need a few details to get
          you set up.
        </p>
        <div className="privacy-note">
          <span className="privacy-icon" aria-hidden="true">✓</span>
          <span>Your details are only used to create your registration.</span>
        </div>
      </section>

      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-heading">
          <p className="step-label">YOUR DETAILS <span>01 / 01</span></p>
          <h2 id="form-title">Create your account</h2>
          <p>All fields are required.</p>
        </div>
        <RegistrationForm />
      </section>

      <footer className="page-footer">
        <span>Simple, secure registration</span>
        <span className="footer-dot" aria-hidden="true">·</span>
        <span>Ready when you are</span>
      </footer>
    </main>
  );
}
