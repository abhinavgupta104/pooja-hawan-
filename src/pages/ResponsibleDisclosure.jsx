import React from 'react'
import { Link } from 'react-router-dom'
import LegalPage from '../components/legal/LegalPage'
import { PAGES, LEGAL_ENTITY, LAST_UPDATED } from '../seo/seoConfig'

export default function ResponsibleDisclosure() {
  return (
    <LegalPage
      eyebrow="SECURITY"
      title="Responsible Disclosure Policy"
      intro="We welcome reports from security researchers. If you have found a vulnerability in Puja Havan, this page explains how to report it and what you can expect from us."
      lastUpdated={LAST_UPDATED}
      seo={PAGES['responsible-disclosure']}
    >
      <h2>1. Our commitment</h2>
      <p>
        {LEGAL_ENTITY.name}, which operates {LEGAL_ENTITY.brand}, takes the security of our users&rsquo;
        data seriously. We value the work of the security community and will not take legal action
        against researchers who follow this policy in good faith.
      </p>

      <h2>2. How to report</h2>
      <p>
        Email <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a> with the subject
        line <strong>&ldquo;Security Disclosure&rdquo;</strong>. Please include:
      </p>
      <ul>
        <li>The type of issue and the affected URL, endpoint or page.</li>
        <li>Clear steps to reproduce it, with a proof of concept if possible.</li>
        <li>Your assessment of the impact — what an attacker could actually achieve.</li>
        <li>Any screenshots, request/response logs or code that help us confirm it.</li>
        <li>How you would like to be credited, if you want public acknowledgement.</li>
      </ul>
      <p>
        Please report in English and send one issue per email so we can track each one properly.
      </p>

      <h2>3. What we promise</h2>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Stage</th>
              <th>Our target</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Acknowledge your report</td>
              <td>Within <strong>3 business days</strong></td>
            </tr>
            <tr>
              <td>Initial assessment and severity triage</td>
              <td>Within <strong>10 business days</strong></td>
            </tr>
            <tr>
              <td>Fix for critical and high severity issues</td>
              <td>Target <strong>30 days</strong></td>
            </tr>
            <tr>
              <td>Fix for medium and low severity issues</td>
              <td>Target <strong>90 days</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We will keep you updated on progress, tell you honestly if we decide not to act on a
        report and why, and let you know when a fix ships.
      </p>

      <h2>4. Safe harbour</h2>
      <p>
        If you make a good-faith effort to comply with this policy during your research, we will
        consider your activity authorised, we will not pursue civil or criminal action against
        you, and we will not report you to law enforcement. If a third party brings action against
        you for research that complied with this policy, we will make it known that your actions
        were authorised.
      </p>
      <p>
        This safe harbour applies only to the scope below and only where you avoid privacy
        violations, data destruction and service disruption.
      </p>

      <h2>5. In scope</h2>
      <ul>
        <li>The {LEGAL_ENTITY.domain} website and its subdomains.</li>
        <li>Our public API endpoints used by the Kundali and Panchang tools.</li>
        <li>Issues such as authentication or authorisation flaws, injection, remote code execution, server-side request forgery, exposure of personal data, insecure direct object references, stored cross-site scripting and business-logic flaws in booking or payment.</li>
      </ul>

      <h2>6. Out of scope</h2>
      <p>
        The following are generally <strong>not</strong> accepted, unless you can demonstrate a
        realistic, meaningful impact:
      </p>
      <ul>
        <li>Denial of service, volumetric, brute-force or stress testing of any kind.</li>
        <li>Social engineering or phishing of our staff, pandits or users; physical attacks.</li>
        <li>Reports produced solely by an automated scanner with no verified exploitability.</li>
        <li>Missing security headers, cookie flags or TLS configuration issues with no demonstrated impact.</li>
        <li>Self-XSS, clickjacking on pages with no sensitive action, or missing SPF/DMARC records.</li>
        <li>Vulnerabilities in third-party services we merely use (report those to Razorpay, Google Cloud and so on directly).</li>
        <li>Outdated browsers or software versions with no working proof of concept.</li>
      </ul>

      <h2>7. Rules of engagement</h2>
      <p>While researching, you must:</p>
      <ul>
        <li>Only test against accounts and data you own or have explicit permission to use.</li>
        <li><strong>Stop as soon as you confirm a vulnerability</strong> — do not pivot further into our systems.</li>
        <li>Never access, download, modify or delete another user&rsquo;s personal data. If you encounter it accidentally, stop, do not save it, and tell us immediately.</li>
        <li>Not degrade, disrupt or interrupt our services for other users.</li>
        <li>Delete any data you obtained during testing once your report is resolved.</li>
        <li>Keep the issue confidential until we have fixed it and agreed on disclosure.</li>
      </ul>

      <h2>8. Disclosure</h2>
      <p>
        Please give us a reasonable opportunity to fix an issue before making it public — we ask
        for <strong>90 days</strong> from your first report, or until a fix has shipped, whichever
        is sooner. We are happy to coordinate a public write-up with you after that, and we will
        credit you unless you prefer to stay anonymous.
      </p>

      <h2>9. Recognition</h2>
      <p>
        We do not currently run a paid bug bounty programme. We do not offer monetary rewards, but
        we will gladly acknowledge researchers who report valid issues, and we can provide a
        written confirmation of your contribution on request. If we launch a bounty in future, we
        will announce it on this page.
      </p>

      <h2>10. Contact</h2>
      <p>
        Security reports: <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a>{' '}
        (subject: &ldquo;Security Disclosure&rdquo;)<br />
        {LEGAL_ENTITY.name}<br />
        {LEGAL_ENTITY.address}
      </p>
      <p>
        For privacy questions rather than security vulnerabilities, please see our{' '}
        <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  )
}
