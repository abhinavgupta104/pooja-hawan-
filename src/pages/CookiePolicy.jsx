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
            <tr>
              <td><code>pujahavan:session-counted</code></td>
              <td>Session storage (strictly necessary)</td>
              <td>
                A single flag so one browsing session is counted once in our visitor totals.
                It holds no identifier and cannot be used to recognise you on a later visit.
              </td>
              <td>Cleared when you close the tab</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Those are the only two items we set ourselves. Neither contains personal information
        or an identifier — each is just a flag.
      </p>

      <h3>Our visitor statistics</h3>
      <p>
        We count how many pages are viewed, which pages are most popular and which website
        referred you, so we can see whether the site is useful. This runs on our own servers
        and is deliberately built to be anonymous:
      </p>
      <ul>
        <li>We store <strong>daily totals only</strong> — never a record of an individual visit.</li>
        <li>We do <strong>not</strong> store your IP address, and we do not use a cookie or any identifier to recognise you.</li>
        <li>We record only the bare hostname of the referring site (for example &ldquo;google.com&rdquo;), never the full address you came from.</li>
        <li>Nothing collected can be linked back to you, so there is nothing here to export or delete on request.</li>
      </ul>
      <p>
        Because this cannot identify anyone, it does not require your consent — and there is no
        third-party analytics provider receiving your data.
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

      <h2>4. If we add third-party analytics later</h2>
      <p>
        Our current visitor statistics are anonymous and run on our own servers, as described
        above. If we ever add a third-party analytics service that sets cookies or collects
        identifiable data, we will update this page first, list exactly what is set, and ask
        for your consent before any non-essential cookie is placed.
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
