import React from 'react'
import { Link } from 'react-router-dom'
import LegalPage from '../components/legal/LegalPage'
import { PAGES, LEGAL_ENTITY, LAST_UPDATED } from '../seo/seoConfig'

export default function RefundPolicy() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Refund & Cancellation Policy"
      intro="Plans change. This policy sets out exactly when you can cancel, how much you get back, and what happens in the rare case a pandit cannot attend."
      lastUpdated={LAST_UPDATED}
      seo={PAGES['refund-policy']}
    >
      <h2>1. Cancellation by you</h2>
      <p>
        The refund depends on how far ahead of the scheduled start time you cancel. Pandits block
        their day and samagri is bought in advance, so the closer the ceremony, the less we can
        recover.
      </p>

      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>When you cancel</th>
              <th>Refund on the service fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>24 hours or more before the scheduled time</td>
              <td><strong>100% refund</strong></td>
            </tr>
            <tr>
              <td>Between 12 and 24 hours before</td>
              <td><strong>50% refund</strong></td>
            </tr>
            <tr>
              <td>Less than 12 hours before, or no-show</td>
              <td><strong>No refund</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        To cancel, call or WhatsApp us on{' '}
        <a href={`tel:${LEGAL_ENTITY.phoneHref}`}>{LEGAL_ENTITY.phoneDisplay}</a> or email{' '}
        <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a> with your booking
        reference. The cancellation time is recorded when we receive your request.
      </p>

      <h2>2. If the pandit does not arrive</h2>
      <p>
        If the assigned pandit fails to attend and we cannot arrange a suitable replacement in
        time, you receive a <strong>100% refund plus a ₹200 credit</strong> towards a future
        booking. This is our commitment to you and applies regardless of the notice period.
      </p>

      <h2>3. Rescheduling</h2>
      <ul>
        <li>You may reschedule <strong>free of charge once</strong>, if you tell us at least 24 hours before the scheduled time, subject to pandit and muhurat availability.</li>
        <li>Later or repeat reschedule requests are treated as a cancellation followed by a new booking, under the table above.</li>
        <li>If we have to reschedule (pandit illness, emergency), you may choose a new slot or take a full refund.</li>
      </ul>

      <h2>4. Samagri and physical items</h2>
      <ul>
        <li><strong>Before dispatch</strong> — cancel any samagri kit for a full refund of the item cost.</li>
        <li><strong>After dispatch</strong> — the cost of samagri already purchased and dispatched for your ceremony is non-refundable, as these are perishable and consecrated goods.</li>
        <li><strong>Damaged or wrong items</strong> — report within 48 hours of delivery with photographs and we will replace the item or refund it in full.</li>
        <li>For hygiene and religious reasons, opened or used samagri cannot be returned.</li>
      </ul>

      <h2>5. Online, e-puja and virtual ceremonies</h2>
      <p>
        The same cancellation windows apply. If the ceremony fails due to a technical problem on
        our side and cannot be completed or rescheduled, you receive a full refund. Failures
        caused by your own internet connection or device do not qualify, though we will always
        try to reschedule you.
      </p>

      <h2>6. Free tools</h2>
      <p>
        The Kundali, Panchang and Numerology tools are provided free of charge, so no payment or
        refund arises in connection with them.
      </p>

      <h2>7. How refunds are paid</h2>
      <ul>
        <li>Refunds go back to the <strong>original payment method</strong> through Razorpay. We cannot redirect a refund to a different account.</li>
        <li>We initiate approved refunds within <strong>3 business days</strong> of confirming the cancellation.</li>
        <li>Your bank or card issuer typically takes a further <strong>5&ndash;7 business days</strong> to credit it. Timelines outside our control are set by your bank.</li>
        <li>Payment-gateway charges on the original transaction may be deducted where a payment is reversed, as permitted by law.</li>
        <li>We will confirm by email or WhatsApp once the refund is initiated, with a reference number.</li>
      </ul>

      <h2>8. Quality concerns</h2>
      <p>
        If the ceremony was not performed as described, tell us within <strong>7 days</strong>{' '}
        with the details. We investigate with the pandit and, depending on what we find, may offer
        a partial or full refund, a credit, or a repeat ceremony at no cost. Because a ceremony
        already performed cannot be undone, refunds in these cases are decided case by case and
        in good faith.
      </p>
      <p>
        Please note that we cannot offer refunds on the basis that a ritual did not produce a
        hoped-for result — as explained in our{' '}
        <Link to="/terms-of-service">Terms of Service</Link>, no outcome is promised.
      </p>

      <h2>9. Disputes</h2>
      <p>
        If you are unhappy with a refund decision, write to{' '}
        <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a>. We acknowledge within
        48 hours and aim to close the matter within 30 days. Please raise the issue with us
        before initiating a chargeback so we have a chance to put it right.
      </p>
    </LegalPage>
  )
}
