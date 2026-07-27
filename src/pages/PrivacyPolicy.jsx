import React from 'react'
import { Link } from 'react-router-dom'
import LegalPage from '../components/legal/LegalPage'
import { PAGES, LEGAL_ENTITY, LAST_UPDATED } from '../seo/seoConfig'

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Privacy Policy"
      intro="This policy explains what personal information we collect when you use Puja Havan, why we collect it, how long we keep it, and the choices you have."
      lastUpdated={LAST_UPDATED}
      seo={PAGES['privacy-policy']}
    >
      <h2>1. Introduction</h2>
      <p>
        {LEGAL_ENTITY.brand} ({LEGAL_ENTITY.domain}) is operated by {LEGAL_ENTITY.name}
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We respect your privacy and are
        committed to protecting the personal data you share with us. This policy applies to our
        website, our booking flow and the astrology tools we provide (Kundali, Panchang and
        Numerology).
      </p>
      <p>
        We follow the Information Technology Act, 2000 and its rules, and the Digital Personal
        Data Protection Act, 2023 (DPDP Act) as applicable in India. By using our services you
        agree to the practices described here.
      </p>

      <h2>2. Information we collect</h2>

      <h3>a. Information you give us</h3>
      <ul>
        <li><strong>Booking details</strong> — your name, phone number, email address, service address, puja type, preferred date and any instructions you add.</li>
        <li><strong>Birth details for astrology tools</strong> — date, time and place of birth that you enter to generate a Kundali or numerology report.</li>
        <li><strong>Enquiries</strong> — anything you send us through the contact form, WhatsApp or email.</li>
        <li><strong>Pandit applications</strong> — if you register as a pandit, your qualifications, experience, identity documents and references.</li>
      </ul>

      <h3>b. Information collected automatically</h3>
      <ul>
        <li>Device and browser type, operating system, approximate location derived from your IP address, pages viewed and time spent.</li>
        <li>Cookies and similar technologies — see our <Link to="/cookie-policy">Cookie Policy</Link>.</li>
        <li><strong>Precise location</strong> only if you explicitly allow it, to show accurate local Panchang timings. You can refuse, and we fall back to a city you type in.</li>
      </ul>

      <h3>c. What we do not collect</h3>
      <p>
        We do <strong>not</strong> store your card numbers, UPI PIN, CVV or net-banking
        credentials. All payments are processed on the secure infrastructure of our payment
        gateway (Razorpay); we receive only a transaction reference and payment status.
      </p>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To confirm, schedule and fulfil your puja booking, and to share the necessary details with the assigned pandit.</li>
        <li>To generate the astrological report you requested.</li>
        <li>To send booking confirmations, reminders and service updates by WhatsApp, SMS or email.</li>
        <li>To process payments and issue refunds.</li>
        <li>To respond to your questions and provide customer support.</li>
        <li>To improve our services, troubleshoot problems, prevent fraud and keep the platform secure.</li>
        <li>To comply with legal, tax and regulatory obligations.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell your personal data. We do not use your birth details for
        anything other than generating the report you asked for.
      </p>

      <h2>4. Who we share it with</h2>
      <ul>
        <li><strong>Pandits</strong> — only the details required to perform your ceremony (name, address, contact number, date and service).</li>
        <li><strong>Payment gateway</strong> — Razorpay, to process your transaction under its own privacy policy.</li>
        <li><strong>Infrastructure providers</strong> — hosting, cloud computing and communication services that operate our website and backend on our instructions.</li>
        <li><strong>Authorities</strong> — where disclosure is required by law, court order or a valid government request.</li>
        <li><strong>Business transfers</strong> — if our business is merged or acquired, your data may transfer to the successor entity under this same policy.</li>
      </ul>

      <h2>5. Data retention</h2>
      <p>
        We keep booking and transaction records for as long as needed to provide the service and
        to meet statutory accounting and tax requirements (generally up to eight years). Enquiry
        messages are kept for up to two years. Birth details submitted to the astrology tools are
        processed to generate your chart and are not used for any other purpose; where a report is
        generated without an account, the calculation is not retained after your session.
      </p>

      <h2>6. Security</h2>
      <p>
        We use HTTPS/TLS encryption in transit, access controls, and reputable cloud providers
        with their own physical and network safeguards. No method of transmission or storage is
        completely secure, so we cannot guarantee absolute security — but we take reasonable steps
        expected of a service of our size, and we will notify you and the authorities of a
        reportable breach as required by law.
      </p>
      <p>
        If you believe you have found a security vulnerability, please report it under our{' '}
        <Link to="/responsible-disclosure">Responsible Disclosure Policy</Link>.
      </p>

      <h2>7. Your rights</h2>
      <p>Subject to applicable law, you may:</p>
      <ul>
        <li>Ask for a copy of the personal data we hold about you.</li>
        <li>Ask us to correct or complete inaccurate data.</li>
        <li>Ask us to erase data we no longer need to keep.</li>
        <li>Withdraw consent for marketing messages at any time.</li>
        <li>Nominate another person to exercise your rights in the event of death or incapacity.</li>
        <li>Raise a grievance with us, and escalate to the Data Protection Board of India if unresolved.</li>
      </ul>
      <p>
        To exercise any of these, email{' '}
        <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a>. We respond within
        30 days. Some data may be retained where the law requires it.
      </p>

      <h2>8. Children</h2>
      <p>
        Our services are intended for users aged 18 and above. We do not knowingly collect
        personal data from children without verifiable parental consent. Where a booking or
        ceremony involves a child (for example Namkaran or Annaprashan), the details are provided
        by the parent or guardian making the booking.
      </p>

      <h2>9. Third-party links</h2>
      <p>
        Our site may link to other websites. We are not responsible for their content or privacy
        practices; please read their policies before sharing information with them.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;last updated&rdquo; date above
        always reflects the current version, and material changes will be highlighted on this
        page.
      </p>

      <h2>11. Grievance Officer</h2>
      <p>
        In accordance with the Information Technology Act, 2000 and the rules made thereunder,
        the contact details of our Grievance Officer are:
      </p>
      <p>
        <strong>Grievance Officer</strong><br />
        {LEGAL_ENTITY.name}<br />
        {LEGAL_ENTITY.address}<br />
        Email: <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a><br />
        Phone: <a href={`tel:${LEGAL_ENTITY.phoneHref}`}>{LEGAL_ENTITY.phoneDisplay}</a><br />
        Hours: Monday&ndash;Sunday, 6:00 AM &ndash; 10:00 PM IST
      </p>
    </LegalPage>
  )
}
