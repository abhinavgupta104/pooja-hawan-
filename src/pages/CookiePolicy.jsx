import React from 'react'
import { Link } from 'react-router-dom'
import LegalPage from '../components/legal/LegalPage'
import { PAGES, LEGAL_ENTITY, LAST_UPDATED } from '../seo/seoConfig'

export default function CookiePolicy() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Cookie Policy"
      intro="This page explains the small amount of data Puja Havan stores in your browser, what it is used for, and how you can clear or block it."
      lastUpdated={LAST_UPDATED}
      seo={PAGES['cookie-policy']}
    >
      <h2>1. What cookies and local storage are</h2>
      <p>
        Cookies are small text files a website stores in your browser. Related technologies —
        <strong> local storage</strong> and <strong>session storage</strong> — let a site keep
        small pieces of information on your device without sending them back with every request.
        We refer to all of these together as &ldquo;cookies&rdquo; in this policy.
      </p>

      <h2>2. What we actually use</h2>
      <p>
        We keep this deliberately minimal. {LEGAL_ENTITY.brand} does <strong>not</strong> use
        advertising cookies, does <strong>not</strong> track you across other websites, and does{' '}
        <strong>not</strong> sell or share browsing data with data brokers.
      </p>

      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Lifetime</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>pujahavan:chunk-reloaded</code></td>
              <td>Session storage (strictly necessary)</td>
              <td>
                Set only if the site was updated while your tab was open, so we can refresh the
                page once to load the new version without getting stuck in a reload loop.
              </td>
              <td>Cleared when you close the tab</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        That is the only item we set ourselves. It contains no personal information and no
        identifier — just a flag.
      </p>

      <h3>Location permission</h3>
      <p>
        The Panchang page may ask your browser for your location to show accurate local sunrise,
        sunset and muhurat timings. This is a browser permission rather than a cookie, it is only
        requested when you use that feature, and you can decline and type a city instead.
      </p>

      <h2>3. Third-party cookies</h2>
      <p>
        Some services we rely on may set their own cookies when you interact with them:
      </p>
      <ul>
        <li>
          <strong>Razorpay</strong> — our payment gateway sets cookies during checkout for
          security, fraud prevention and to complete your transaction. These are governed by
          Razorpay&rsquo;s own privacy and cookie policies.
        </li>
        <li>
          <strong>Google Fonts</strong> — our typefaces are served by Google Fonts. Google does
          not set cookies for font requests, but it does receive your IP address as part of
          serving the file.
        </li>
      </ul>
      <p>
        We do not control third-party cookies. Please review those providers&rsquo; policies for
        details.
      </p>

      <h2>4. If we add analytics later</h2>
      <p>
        We may add privacy-respecting analytics in future to understand which pages are useful.
        If we do, we will update this page first, list what is set, and — where the law requires
        consent — ask for it before any non-essential cookie is placed.
      </p>

      <h2>5. How to control cookies</h2>
      <p>
        You can delete or block cookies and clear site storage at any time in your browser
        settings:
      </p>
      <ul>
        <li><strong>Chrome</strong> — Settings → Privacy and security → Third-party cookies / Clear browsing data</li>
        <li><strong>Safari</strong> — Settings → Privacy → Manage Website Data</li>
        <li><strong>Firefox</strong> — Settings → Privacy &amp; Security → Cookies and Site Data</li>
        <li><strong>Edge</strong> — Settings → Cookies and site permissions</li>
      </ul>
      <p>
        Because the only item we set is strictly necessary and short-lived, blocking it will not
        break browsing — though in rare cases you may need to refresh manually after we deploy an
        update. Blocking Razorpay&rsquo;s cookies will prevent payments from completing.
      </p>

      <h2>6. More information</h2>
      <p>
        For how we handle personal data generally, see our{' '}
        <Link to="/privacy-policy">Privacy Policy</Link>. Questions about this policy can go to{' '}
        <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a>.
      </p>
    </LegalPage>
  )
}
