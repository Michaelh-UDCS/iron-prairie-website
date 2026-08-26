// emailService.ts
// Automated Proposal Generation & Order Notification Service for Iron Prairie Fabrication Group LLC
// Outbound Sender: Sales@ironprairiefabrication.com
// IPG Team Recipients: Sales@, Alicia@, Russell@, mhuerta@ironprairiefabrication.com

export interface EmailRecipient {
  name: string;
  email: string;
}

export const IPG_SALES_EMAIL = 'Sales@ironprairiefabrication.com';

// Full IPG Internal Notification Distribution List
export const OWNER_NOTIFICATION_RECIPIENTS: EmailRecipient[] = [
  { name: 'IPG Sales Desk', email: 'Sales@ironprairiefabrication.com' },
  { name: 'Alicia Huerta', email: 'Alicia@ironprairiefabrication.com' },
  { name: 'Russell Huerta', email: 'Russell@ironprairiefabrication.com' },
  { name: 'Michael Huerta', email: 'mhuerta@ironprairiefabrication.com' }
];

export interface EmailNotificationRecord {
  id: string;
  orderId: string;
  poNumber: string;
  companyName: string;
  recipients: string[];
  subject: string;
  sentAt: string;
  totalAmount: number;
  totalWeightLbs: number;
  isHotShot: boolean;
  status: 'Delivered' | 'Simulated Dispatch' | 'Ready for Client Send';
  rawHtml: string;
  rawText: string;
  actionRequired: string;
  type?: 'proposal' | 'order' | 'abandoned_cart';
}

export interface ProposalPayload {
  proposalId: string;
  createdAt: string;
  expiresAt: string;
  companyName: string;
  buyerName: string;
  email: string;
  jobsiteAddress: string;
  items: any[];
  subtotal: number;
  shippingCost: number;
  hotShotFee: number;
  totalAmount: number;
  totalWeightLbs: number;
  shippingMethod: string;
  isHotShot: boolean;
  leadTimeEstimate: string;
  notes?: string;
}

/**
 * Generate formatted plain text order summary for emails / clipboard
 */
export function generateOrderEmailText(order: any): string {
  const isRush = order.isHotShot;
  const isLarge = order.isLargeOrder;
  const orderDateStr = order.createdAt || order.orderDate || new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

  const header = `=======================================================
🔥 CONFIRMED PADDLE BLIND ORDER - IRON PRAIRIE FABRICATION
=======================================================
Order ID:     ${order.orderId}
PO Number:    ${order.poNumber}
Order Date:   ${orderDateStr}
From:         ${IPG_SALES_EMAIL}
Priority:     ${isRush ? '🔥 HOT SHOT EMERGENCY (2-4 HR BURN & DISPATCH)' : isLarge ? '🏭 HIGH-VOLUME MILL ALLOCATION (>10k / >1,000 lbs)' : '⚡ STANDARD NEXT-DAY IN-STOCK DISPATCH'}

-------------------------------------------------------
CLIENT & CONTACT DETAILS
-------------------------------------------------------
Company:      ${order.companyName}
Buyer / Lead: ${order.contactName || order.buyerName}
Work Email:   ${order.email}
Receiving:    ${order.jobsiteAddress || 'Direct Plant Receiving'}

-------------------------------------------------------
PAYMENT & COMMERCIAL TERMS
-------------------------------------------------------
Method:       ${order.paymentMethod || 'Net 30 Commercial PO'}
Status:       ${order.paymentStatus || 'Net 30 Authorized'}
Scheduled:    ${order.scheduledShipDate || 'Next Business Day'}
Carrier:      ${order.carrierName || 'Standard Freight'} (${order.shippingMethod || 'Standard Parcel'})

-------------------------------------------------------
BILL OF MATERIALS (BOM) / CUT MANIFEST
-------------------------------------------------------
${order.items.map((item: any, idx: number) => {
  const accessories = [
    item.addTHadle ? 'Integral CNC T-Handle' : '',
    item.addLockoutHole ? '3/8" Lockout Hole' : '',
    item.addLiftingLug ? 'Crane Lifting Lug' : '',
    item.addPlateDog ? 'Plate Dog' : '',
    item.addWedge ? 'Fit-Up Wedge' : ''
  ].filter(Boolean).join(', ');

  return `Item #${idx + 1}:
  Part #:       ${item.partNumber || item.sku}
  NPS & Class:  ${item.nps} Class ${item.pressureClass}# (${item.facing || 'Flat Face'})
  Material:     ${item.materialName || item.materialCode || item.material}
  Thickness:    ${item.thicknessLabel || item.dimensions?.thicknessFraction || '11 Ga'} | OD: ${item.od || item.dimensions?.od}"
  Quantity:     ${item.quantity} units
  Unit Weight:  ${item.actualWeightLbs || item.finishedWeightPerUnit} lbs (Total: ${((item.actualWeightLbs || item.finishedWeightPerUnit) * item.quantity).toFixed(2)} lbs)
  Handle Stamp: "${item.handleStamp || item.handleStamping || 'STANDARD'}"
  MTR Required: ${item.requireMTR || item.includeMTR ? 'YES (MTR PACKET MANDATORY)' : 'NO (UTILITY)'}
  Accessories:  ${accessories || 'None'}
  Line Price:   $${((item.unitPrice || 0) * item.quantity).toFixed(2)}`;
}).join('\n\n')}

-------------------------------------------------------
FINANCIAL TOTALS
-------------------------------------------------------
Subtotal:     $${order.subtotal?.toFixed(2)}
Shipping:     $${order.shippingCost?.toFixed(2)}
Hot Shot Fee: $${order.hotShotFee?.toFixed(2) || '0.00'}
GRAND TOTAL:  $${order.totalAmount?.toFixed(2)}
Total Weight: ${order.totalWeightLbs} lbs

-------------------------------------------------------
⚡ SHOP ACTION REQUIRED:
${isRush
  ? '1. Verify in-stock domestic plate immediately\n2. Queue CNC plasma table top priority #1\n3. Stamp heat numbers and stage for dedicated Hot Shot courier.'
  : isLarge
  ? '1. Stage master plates with steel supplier\n2. Schedule dedicated plasma table burn shift\n3. Prepare MTR compliance packet.'
  : '1. Pull in-stock domestic plate from rack\n2. Cut, deburr, and hard-stamp heat numbers\n3. Package and stage for carrier pickup.'}
=======================================================`;

  return header;
}

/**
 * Generate rich HTML email body for Order Notification
 */
export function generateOrderEmailHtml(order: any): string {
  const isRush = order.isHotShot;
  const isLarge = order.isLargeOrder;

  const rows = order.items.map((item: any) => {
    const accessories = [
      item.addTHadle ? '<span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:4px;font-size:10px;">T-Handle</span>' : '',
      item.addLiftingLug ? '<span style="background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:4px;font-size:10px;">Lifting Lug</span>' : '',
      item.addPlateDog ? '<span style="background:#f1f5f9;color:#334155;padding:2px 6px;border-radius:4px;font-size:10px;">Plate Dog</span>' : '',
      item.addWedge ? '<span style="background:#f1f5f9;color:#334155;padding:2px 6px;border-radius:4px;font-size:10px;">Wedge</span>' : ''
    ].filter(Boolean).join(' ');

    const weight = item.actualWeightLbs || item.finishedWeightPerUnit || 1;
    const unitPrice = item.unitPrice || 0;

    return `
      <tr style="border-bottom:1px solid #e2e8f0; font-family: monospace; font-size:12px;">
        <td style="padding:10px; font-weight:bold; color:#0f172a;">${item.partNumber || item.sku}</td>
        <td style="padding:10px;">${item.nps} ${item.pressureClass}#</td>
        <td style="padding:10px;">${item.materialCode || item.material}</td>
        <td style="padding:10px;">${item.thicknessLabel || item.dimensions?.thicknessFraction}</td>
        <td style="padding:10px; font-weight:bold; color:#0369a1;">${item.quantity}</td>
        <td style="padding:10px;">${(weight * item.quantity).toFixed(1)} lbs</td>
        <td style="padding:10px; color:#475569;">"${item.handleStamp || item.handleStamping || 'NONE'}"</td>
        <td style="padding:10px;">${(item.requireMTR || item.includeMTR) ? '<strong style="color:#15803d;">MTR REQ</strong>' : '<span style="color:#94a3b8;">NO MTR</span>'}</td>
        <td style="padding:10px;">${accessories || '<span style="color:#94a3b8;">-</span>'}</td>
        <td style="padding:10px; font-weight:bold; text-align:right;">$${(unitPrice * item.quantity).toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Notification - ${order.poNumber}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1e293b; background-color: #f8fafc; margin:0; padding:20px;">
      <div style="max-width: 760px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <!-- Header Banner -->
        <div style="background: #0f172a; padding: 24px; color: #ffffff;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="color: #fbbf24; font-size: 11px; font-family: monospace; font-weight:bold; letter-spacing: 1px; text-transform: uppercase;">
                IRON PRAIRIE FABRICATION GROUP LLC &bull; BAY CITY, TX
              </div>
              <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                New ASME B16.48 Paddle Blind Order Confirmed
              </h1>
            </div>
            ${isRush ? '<div style="background:#e11d48; color:#ffffff; font-weight:bold; font-size:12px; padding:6px 12px; border-radius:8px; text-transform:uppercase;">🔥 HOT SHOT 2-4 HR RUSH</div>' : ''}
          </div>
        </div>

        <!-- Order Metadata Strip -->
        <div style="background: #f1f5f9; padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between; flex-wrap:wrap; font-size:13px;">
          <div><strong>PO Number:</strong> <span style="font-family:monospace; color:#0369a1; font-weight:bold;">${order.poNumber}</span></div>
          <div><strong>Order ID:</strong> <span style="font-family:monospace;">${order.orderId}</span></div>
          <div><strong>Received:</strong> ${order.createdAt || new Date().toLocaleDateString()}</div>
          <div><strong>Target Ship:</strong> <strong style="color:#b45309;">${order.scheduledShipDate || 'Next-Day'}</strong></div>
        </div>

        <!-- Action Callout Box -->
        <div style="margin: 20px 24px; padding: 16px; border-radius: 8px; border-left: 4px solid ${isRush ? '#e11d48' : '#0284c7'}; background: ${isRush ? '#fff1f2' : '#f0f9ff'};">
          <strong style="color:${isRush ? '#9f1239' : '#0369a1'}; font-size:14px; text-transform:uppercase;">⚡ ACTION REQUIRED FOR SHOP:</strong>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #334155;">
            ${isRush
              ? '<strong>EMERGENCY DISPATCH:</strong> Pull plate immediately, assign plasma table top priority, burn & deburr, stamp heat number, and notify dedicated Hot Shot courier truck.'
              : isLarge
              ? '<strong>HIGH-VOLUME ORDER:</strong> Allocate mill master plates from primary supplier, verify table schedules, and prepare comprehensive MTR package.'
              : '<strong>STANDARD DISPATCH:</strong> Pull certified plate from stock, queue for CNC plasma cutting, stamp unit IDs & heat numbers, and package for carrier pickup.'}
          </p>
        </div>

        <!-- Client & Jobsite Info Grid -->
        <div style="padding: 0 24px; display:grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 13px;">
          <div style="background:#f8fafc; padding:16px; border-radius:8px; border:1px solid #e2e8f0;">
            <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:bold; margin-bottom:4px;">Customer / Buyer Info</div>
            <div style="font-size:15px; font-weight:bold; color:#0f172a;">${order.companyName}</div>
            <div>${order.contactName || order.buyerName}</div>
            <div><a href="mailto:${order.email}" style="color:#0284c7;">${order.email}</a></div>
            <div style="margin-top:8px; padding-top:8px; border-top:1px solid #cbd5e1; font-weight:bold; color:#15803d;">
              Terms: ${order.paymentMethod || 'Net 30 Commercial Account'} (${order.paymentStatus || 'Authorized'})
            </div>
          </div>

          <div style="background:#f8fafc; padding:16px; border-radius:8px; border:1px solid #e2e8f0;">
            <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:bold; margin-bottom:4px;">Delivery & Logistics</div>
            <div style="font-size:14px; font-weight:bold; color:#0f172a;">${order.jobsiteAddress || 'Direct Plant Receiving'}</div>
            <div style="margin-top:4px;"><strong>Carrier:</strong> ${order.carrierName || 'Standard Carrier'}</div>
            <div><strong>Shipping Method:</strong> ${order.shippingMethod || 'Standard Parcel'}</div>
            <div style="margin-top:8px; font-size:12px; color:#64748b;">${order.leadTimeEstimate}</div>
          </div>
        </div>

        <!-- Bill of Materials Table -->
        <div style="padding: 24px;">
          <div style="font-size:13px; font-weight:bold; text-transform:uppercase; color:#334155; margin-bottom:10px;">
            Plasma Cut Line Items &amp; BOM:
          </div>
          <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead>
              <tr style="background:#f1f5f9; color:#475569; font-size:11px; text-transform:uppercase;">
                <th style="padding:8px 10px;">Part Number</th>
                <th style="padding:8px 10px;">Size/Class</th>
                <th style="padding:8px 10px;">Metal</th>
                <th style="padding:8px 10px;">Thk</th>
                <th style="padding:8px 10px;">Qty</th>
                <th style="padding:8px 10px;">Weight</th>
                <th style="padding:8px 10px;">Stamp</th>
                <th style="padding:8px 10px;">MTR</th>
                <th style="padding:8px 10px;">Add-ons</th>
                <th style="padding:8px 10px; text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>

        <!-- Financial Summary -->
        <div style="background:#f8fafc; padding:20px 24px; border-top:1px solid #e2e8f0; font-family:monospace; font-size:13px;">
          <div style="max-width:300px; margin-left:auto;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Subtotal:</span>
              <span>$${order.subtotal?.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Shipping (${order.totalWeightLbs} lbs):</span>
              <span>$${order.shippingCost?.toFixed(2)}</span>
            </div>
            ${order.hotShotFee > 0 ? `
              <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#e11d48; font-weight:bold;">
                <span>Hot Shot Rush Fee:</span>
                <span>+$${order.hotShotFee?.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; padding-top:8px; border-top:1px solid #cbd5e1; font-size:16px; font-weight:bold; color:#0f172a;">
              <span>Grand Total:</span>
              <span style="color:#0369a1;">$${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#0f172a; padding:16px 24px; color:#94a3b8; font-size:11px; text-align:center;">
          Iron Prairie Fabrication Group LLC &bull; 200 County Rd 170, Bay City, TX 77414 &bull; 979-248-9266 &bull; ${IPG_SALES_EMAIL}
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generate Rich HTML Proposal Email sent to the Client from Sales@ironprairiefabrication.com
 */
export function generateClientProposalEmailHtml(proposal: ProposalPayload): string {
  const rows = proposal.items.map((item: any, idx: number) => {
    const weight = item.actualWeightLbs || item.finishedWeightPerUnit || 1;
    const unitPrice = item.unitPrice || 0;
    const lineTotal = unitPrice * item.quantity;
    const thk = item.thicknessLabel || item.dimensions?.thicknessFraction || '11 Ga';
    const metal = item.materialName || item.materialCode || item.material || 'A516-70';
    const stamp = item.handleStamp || item.handleStamping || 'STANDARD';

    return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
        <td style="padding: 10px 8px; font-family: monospace; font-weight: bold; color: #0f172a;">${idx + 1}. ${item.nps} Class ${item.pressureClass}#</td>
        <td style="padding: 10px 8px; color: #334155;">${metal}<br><span style="font-size: 11px; color: #64748b;">${thk} &bull; Stamp: "${stamp}"</span></td>
        <td style="padding: 10px 8px; text-align: center; font-weight: bold; color: #0369a1;">${item.quantity}</td>
        <td style="padding: 10px 8px; text-align: right; font-family: monospace;">$${unitPrice.toFixed(2)}</td>
        <td style="padding: 10px 8px; text-align: right; font-family: monospace; font-weight: bold; color: #0f172a;">$${lineTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Official Proposal - ${proposal.proposalId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1e293b; background-color: #f8fafc; margin:0; padding:20px;">
      <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background: #0f172a; padding: 24px; color: #ffffff;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="color: #fbbf24; font-size: 11px; font-family: monospace; font-weight:bold; letter-spacing: 1px; text-transform: uppercase;">
                IRON PRAIRIE FABRICATION GROUP LLC
              </div>
              <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                Official Turnaround &amp; Blinding Proposal
              </h1>
            </div>
            <div style="background: #1e293b; border: 1px solid #334155; padding: 8px 12px; border-radius: 8px; text-align: right;">
              <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">PROPOSAL REF #</div>
              <div style="font-size: 13px; font-weight: bold; color: #38bdf8; font-family: monospace;">${proposal.proposalId}</div>
            </div>
          </div>
        </div>

        <!-- Info Bar -->
        <div style="background: #f1f5f9; padding: 14px 24px; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between; font-size: 12px;">
          <div><strong>Prepared For:</strong> ${proposal.buyerName} (${proposal.companyName})</div>
          <div><strong>Valid Through:</strong> <span style="color: #0369a1; font-weight: bold;">${proposal.expiresAt}</span> (30 Days)</div>
        </div>

        <!-- Intro -->
        <div style="padding: 20px 24px 10px 24px; font-size: 13px; color: #334155;">
          Dear <strong>${proposal.buyerName || 'Procurement Lead'}</strong>,<br><br>
          Thank you for requesting an official fabrication proposal from Iron Prairie Fabrication Group. We have reserved the in-stock domestic plate and plasma table capacity for your turnaround bill of materials as specified below:
        </div>

        <!-- Item Table -->
        <div style="padding: 10px 24px 20px 24px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; color: #475569;">
                <th style="padding: 8px;">Line Item &amp; Spec</th>
                <th style="padding: 8px;">Metallurgy &amp; Thickness</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Unit Rate</th>
                <th style="padding: 8px; text-align: right;">Extended</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>

        <!-- Financial Breakdown -->
        <div style="background: #f8fafc; padding: 18px 24px; border-top: 1px solid #e2e8f0; font-size: 13px;">
          <div style="max-width: 320px; margin-left: auto; font-family: monospace;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Items Subtotal:</span>
              <span style="font-weight: bold; color: #0f172a;">$${proposal.subtotal?.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Estimated Freight (${proposal.totalWeightLbs} lbs):</span>
              <span style="color: #0f172a;">$${proposal.shippingCost?.toFixed(2)}</span>
            </div>
            ${proposal.hotShotFee > 0 ? `
              <div style="display:flex; justify-content:space-between; margin-bottom: 4px; color: #e11d48; font-weight: bold;">
                <span>Hot Shot Rush:</span>
                <span>+$${proposal.hotShotFee?.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; padding-top: 8px; border-top: 1px solid #cbd5e1; font-size: 15px; font-weight: bold; color: #0f172a;">
              <span style="font-family: sans-serif;">Standard Total (Card / PO):</span>
              <span style="color: #0f172a;">$${proposal.totalAmount?.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-top: 4px; font-size: 15px; font-weight: bold; color: #059669; background: #ecfdf5; padding: 6px 8px; border-radius: 6px; margin-top: 6px; border: 1px solid #a7f3d0;">
              <span style="font-family: sans-serif;">⚡ ACH / Wire Discount Rate:</span>
              <span>$${(proposal.totalAmount - (proposal.subtotal * 0.03))?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- ACH Cash Discount Callout Banner -->
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 20px; margin: 16px 24px; font-size: 12.5px; color: #065f46; border-radius: 0 8px 8px 0;">
          <strong style="font-size: 13.5px; color: #047857;">⚡ Instant 3% ACH / Bank Payment Discount:</strong><br>
          Pay or authorize via <strong>Direct ACH Bank Transfer</strong> and save <strong>$${(proposal.subtotal * 0.03)?.toFixed(2)}</strong> today (Discounted Total: <strong>$${(proposal.totalAmount - (proposal.subtotal * 0.03))?.toFixed(2)}</strong>). Reply to this email to receive an instant Stripe ACH checkout link or our Bluevine direct wire routing!
        </div>

        <!-- Compliance & Turnaround Guarantees -->
        <div style="padding: 20px 24px; background: #ffffff; border-top: 1px solid #e2e8f0; font-size: 12px; color: #475569; line-height: 1.6;">
          <strong style="color: #0f172a; text-transform: uppercase; font-size: 11px;">Included Turnaround Standards:</strong><br>
          &bull; 100% ASME B16.48 Standard Geometry &amp; Chemical Compliance<br>
          &bull; Traceable Mill Heat Numbers permanently stamped on handles<br>
          &bull; Certified Material Test Reports (MTR EN 10204 3.1) packet included<br>
          &bull; Payment Terms: Net 30 Commercial PO / Corporate P-Card / Direct ACH (3% Discount)
        </div>

        <!-- Call to Action -->
        <div style="background: #0f172a; padding: 20px 24px; text-align: center; color: #ffffff;">
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">Ready to lock in your production table slot?</div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">
            Simply reply to this email with your PO number or call our shop desk at (979) 248-9266.
          </div>
          <a href="mailto:${IPG_SALES_EMAIL}?subject=Confirm%20PO%20for%20Proposal%20${proposal.proposalId}%20(Request%20ACH%20Discount)" style="display:inline-block; background: #f59e0b; color: #0f172a; font-weight: bold; font-size: 13px; text-decoration: none; padding: 10px 20px; border-radius: 8px;">
            Confirm Purchase Order (Lock In 3% ACH Discount)
          </a>
        </div>

        <!-- Signoff -->
        <div style="background: #090d16; padding: 14px 24px; text-align: center; font-size: 11px; color: #64748b;">
          Iron Prairie Fabrication Group LLC &bull; 200 County Rd 170, Bay City, TX 77414 &bull; (979) 248-9266 &bull; ${IPG_SALES_EMAIL}
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generate Plain Text Proposal Email for Client
 */
export function generateClientProposalEmailText(proposal: ProposalPayload): string {
  const achDiscount = proposal.subtotal * 0.03;
  const achTotal = proposal.totalAmount - achDiscount;

  return `=======================================================
IRON PRAIRIE FABRICATION GROUP LLC
OFFICIAL TURNAROUND & BLINDING PROPOSAL
=======================================================
Proposal Reference: ${proposal.proposalId}
Date Generated:     ${proposal.createdAt}
Valid Through:      ${proposal.expiresAt} (30-Day Price Lock)
Prepared From:      ${IPG_SALES_EMAIL}

CLIENT DETAILS:
Company:            ${proposal.companyName}
Attention:          ${proposal.buyerName}
Work Email:         ${proposal.email}
Receiving Gate:     ${proposal.jobsiteAddress || 'Direct Plant Receiving'}

-------------------------------------------------------
BILL OF MATERIALS & SPECIFICATIONS:
-------------------------------------------------------
${proposal.items.map((item: any, idx: number) => {
  const weight = item.actualWeightLbs || item.finishedWeightPerUnit || 1;
  const unitPrice = item.unitPrice || 0;
  const thk = item.thicknessLabel || item.dimensions?.thicknessFraction || '11 Ga';
  const metal = item.materialName || item.materialCode || item.material || 'A516-70';
  const stamp = item.handleStamp || item.handleStamping || 'STANDARD';

  return `Item #${idx + 1}:
  Spec:         ${item.nps} Class ${item.pressureClass}# (${item.facing || 'Flat Face'})
  Metallurgy:   ${metal}
  Thickness:    ${thk} | OD: ${item.od || item.dimensions?.od}"
  Quantity:     ${item.quantity} units
  Unit Weight:  ${weight} lbs (Line Total: ${(weight * item.quantity).toFixed(1)} lbs)
  Handle Stamp: "${stamp}"
  Unit Rate:    $${unitPrice.toFixed(2)}
  Extended:     $${(unitPrice * item.quantity).toFixed(2)}`;
}).join('\n\n')}

-------------------------------------------------------
FINANCIAL TOTALS:
-------------------------------------------------------
Items Subtotal:        $${proposal.subtotal?.toFixed(2)}
Estimated Freight:     $${proposal.shippingCost?.toFixed(2)} (${proposal.totalWeightLbs} lbs)
${proposal.hotShotFee > 0 ? `Hot Shot Rush:         +$${proposal.hotShotFee.toFixed(2)}\n` : ''}STANDARD TOTAL:        $${proposal.totalAmount?.toFixed(2)}

⚡ PREFERRED ACH DISCOUNT RATE (SAVE 3%):
ACH / Wire Discount:   -$${achDiscount.toFixed(2)}
TOTAL VIA DIRECT ACH:  $${achTotal.toFixed(2)} (Instant 3% Cash Savings)

-------------------------------------------------------
TURNAROUND COMPLIANCE & QUALITY GUARANTEES:
-------------------------------------------------------
1. Standard: Manufactured to ASME B16.48 specifications
2. Traceability: Traceable Mill Heat Numbers stamped on all handles
3. Documentation: Full Certified Material Test Report (MTR) Packet included
4. Terms: Net 30 Commercial Account / Corporate P-Card / Direct ACH (3% Discount)

HOW TO CONFIRM & CLAIM ACH DISCOUNT:
Reply directly to this email (${IPG_SALES_EMAIL}) with your PO Number and state "Pay via ACH for 3% discount" or call our shop desk at (979) 248-9266.

Best regards,

Sales & Estimating Team
Iron Prairie Fabrication Group LLC
200 County Rd 170, Bay City, TX 77414 | (979) 248-9266
${IPG_SALES_EMAIL}
https://ironprairiefabrication.com`;
}

/**
 * Trigger Proposal Notification to Client & IPG Team
 */
export async function triggerProposalEmailNotification(proposal: ProposalPayload): Promise<EmailNotificationRecord> {
  const sentAt = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  const rawHtml = generateClientProposalEmailHtml(proposal);
  const rawText = generateClientProposalEmailText(proposal);
  const recipients = [proposal.email, ...OWNER_NOTIFICATION_RECIPIENTS.map(r => r.email)];

  const isRush = proposal.isHotShot;
  const subject = `Official Iron Prairie Proposal #${proposal.proposalId} - ${proposal.companyName} ($${proposal.totalAmount.toFixed(2)})`;

  const record: EmailNotificationRecord = {
    id: `PROP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId: proposal.proposalId,
    poNumber: proposal.proposalId,
    companyName: proposal.companyName,
    recipients,
    subject,
    sentAt,
    totalAmount: proposal.totalAmount,
    totalWeightLbs: proposal.totalWeightLbs,
    isHotShot: Boolean(proposal.isHotShot),
    status: 'Delivered',
    rawHtml,
    rawText,
    type: 'proposal',
    actionRequired: isRush
      ? '⚡ HOT SHOT LEAD: Client requested emergency proposal. Follow up within 15 mins.'
      : '📋 NEW QUOTE REQUEST: Proposal automatically emailed to client. Follow up within 2 hrs.'
  };

  // Persist to local log
  try {
    const existing = JSON.parse(localStorage.getItem('ipf_email_dispatch_log') || '[]');
    localStorage.setItem('ipf_email_dispatch_log', JSON.stringify([record, ...existing.slice(0, 49)]));
  } catch (err) {
    console.error('Failed to persist proposal email notification log:', err);
  }

  // AUTOMATED CLOUD EMAIL TRANSMISSION OVER HTTP
  try {
    const webhookUrl = (import.meta as any).env?.VITE_ORDER_WEBHOOK_URL;
    const endpoints = [
      webhookUrl,
      'https://formspree.io/f/mqaejvqd'
    ].filter(Boolean);

    for (const endpoint of endpoints) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _replyto: proposal.email || IPG_SALES_EMAIL,
            _subject: subject,
            from: IPG_SALES_EMAIL,
            to: recipients.join(', '),
            clientEmail: proposal.email,
            proposalId: proposal.proposalId,
            companyName: proposal.companyName,
            buyerName: proposal.buyerName,
            totalAmount: `$${proposal.totalAmount?.toFixed(2)}`,
            totalWeightLbs: `${proposal.totalWeightLbs} lbs`,
            leadType: 'Official Turnaround Proposal',
            fullProposalText: rawText,
            message: rawText
          })
        });
        break;
      } catch (postErr) {
        console.warn('Proposal cloud dispatch endpoint failed, trying fallback:', postErr);
      }
    }
  } catch (err) {
    console.warn('Automated cloud proposal email dispatch encountered network fallback:', err);
  }

  return record;
}

/**
 * Send / Log Order Notification to Russell and Alicia
 */
export async function triggerOrderEmailNotification(order: any): Promise<EmailNotificationRecord> {
  const sentAt = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  const rawHtml = generateOrderEmailHtml(order);
  const rawText = generateOrderEmailText(order);
  const recipients = OWNER_NOTIFICATION_RECIPIENTS.map(r => r.email);

  const isRush = order.isHotShot;
  const isLarge = order.isLargeOrder;

  const subject = `${isRush ? '🔥 [HOT SHOT RUSH] ' : ''}NEW ORDER #${order.poNumber} - ${order.companyName} ($${order.totalAmount.toFixed(2)})`;

  const record: EmailNotificationRecord = {
    id: `EMAIL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId: order.orderId,
    poNumber: order.poNumber,
    companyName: order.companyName,
    recipients,
    subject,
    sentAt,
    totalAmount: order.totalAmount,
    totalWeightLbs: order.totalWeightLbs,
    isHotShot: Boolean(order.isHotShot),
    status: 'Delivered',
    rawHtml,
    rawText,
    type: 'order',
    actionRequired: isRush
      ? '⚡ PRIORITY 1: Pull Plate & Call Dedicated Hot Shot Courier'
      : isLarge
      ? '🏭 ALLOCATE: Order Raw Mill Master Plates'
      : '⚡ STAGE: Queue Plasma Table & Pull Stock Plate'
  };

  // Persist to local log
  try {
    const existing = JSON.parse(localStorage.getItem('ipf_email_dispatch_log') || '[]');
    localStorage.setItem('ipf_email_dispatch_log', JSON.stringify([record, ...existing.slice(0, 49)]));
  } catch (err) {
    console.error('Failed to persist email notification log:', err);
  }

  // AUTOMATED CLOUD EMAIL TRANSMISSION OVER HTTP
  try {
    const webhookUrl = (import.meta as any).env?.VITE_ORDER_WEBHOOK_URL;
    const endpoints = [
      webhookUrl,
      'https://formspree.io/f/mqaejvqd'
    ].filter(Boolean);

    for (const endpoint of endpoints) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _replyto: order.email || IPG_SALES_EMAIL,
            _subject: subject,
            from: IPG_SALES_EMAIL,
            to: recipients.join(', '),
            poNumber: order.poNumber,
            orderId: order.orderId,
            companyName: order.companyName,
            contactName: order.contactName || order.buyerName,
            email: order.email,
            jobsiteAddress: order.jobsiteAddress,
            totalAmount: `$${order.totalAmount?.toFixed(2)}`,
            totalWeightLbs: `${order.totalWeightLbs} lbs`,
            priority: isRush ? 'HOT SHOT EMERGENCY (2-4 HR RUSH)' : isLarge ? 'HIGH-VOLUME MILL ALLOCATION (>10k)' : 'STANDARD IN-STOCK DISPATCH',
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            scheduledShipDate: order.scheduledShipDate,
            leadTimeEstimate: order.leadTimeEstimate,
            actionRequired: record.actionRequired,
            fullOrderManifest: rawText,
            message: rawText
          })
        });
        break;
      } catch (postErr) {
        console.warn('Endpoint delivery attempt failed, trying fallback:', postErr);
      }
    }
  } catch (err) {
    console.warn('Automated cloud email dispatch encountered network fallback:', err);
  }

  return record;
}

/**
 * Generate abandoned cart follow-up quote email
 */
export function generateAbandonedCartQuoteEmail(cartRecord: any): { subject: string; body: string; mailtoUrl: string } {
  const subject = `Formal Turnaround Proposal - Paddle Blind Order #${cartRecord.cartId || 'QUOTE'} (${cartRecord.companyName})`;
  
  const body = `Dear ${cartRecord.buyerName || 'Purchasing Team'},

Thank you for visiting the Iron Prairie Fabrication Group online ordering portal. We noticed you configured the following ASME B16.48 paddle blinds for ${cartRecord.companyName}:

${cartRecord.items.map((item: any) => `- ${item.quantity}x ${item.nps} Class ${item.pressureClass}# ${item.materialCode || item.material} (${item.thicknessLabel || '11 Ga'}) - Handle: "${item.handleStamp || 'STD'}"`).join('\n')}

Estimated Weight:   ${cartRecord.totalWeightLbs} lbs

Our CNC plasma cutting shop in Texas has the domestic plate in-stock (A516-70, 304L, 316L) ready for same-day cut and dispatch with certified MTR packets.

Would you like us to formalize this into an active Purchase Order and lock in your production table slot?

Please reply directly to this email (${IPG_SALES_EMAIL}) or call us at (979) 248-9266.

Best regards,

Sales &amp; Estimating Team
Iron Prairie Fabrication Group LLC
Texas | (979) 248-9266
${IPG_SALES_EMAIL}
https://ironprairiefabrication.com`;

  const mailtoUrl = `mailto:${encodeURIComponent(cartRecord.email || 'buyer@plant.com')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return { subject, body, mailtoUrl };
}

/**
 * Generate a direct mailto URL to launch default mail app addressed to Sales@ironprairiefabrication.com
 */
export function generateOrderMailtoUrl(orderOrRecord: any): string {
  const recipients = OWNER_NOTIFICATION_RECIPIENTS.map(r => r.email).join(',');
  const subject = orderOrRecord.subject || `${orderOrRecord.isHotShot ? '🔥 [HOT SHOT RUSH] ' : ''}NEW ORDER #${orderOrRecord.poNumber} - ${orderOrRecord.companyName}`;
  const body = orderOrRecord.rawText || generateOrderEmailText(orderOrRecord);
  return `mailto:${encodeURIComponent(recipients)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Get stored email notification history
 */
export function getEmailDispatchLogs(): EmailNotificationRecord[] {
  try {
    return JSON.parse(localStorage.getItem('ipf_email_dispatch_log') || '[]');
  } catch {
    return [];
  }
}
