import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header banner line
        self.setStrokeColor(colors.HexColor('#d97706')) # Amber
        self.setLineWidth(2.5)
        self.line(40, 755, 572, 755)

        # Header text
        self.setFont("Helvetica-Bold", 8.5)
        self.setFillColor(colors.HexColor('#1e293b'))
        self.drawString(40, 762, "IRON PRAIRIE FABRICATION GROUP LLC")
        self.setFont("Helvetica-Bold", 8.5)
        self.setFillColor(colors.HexColor('#d97706'))
        self.drawRightString(572, 762, "PAYMENT INTEGRATION SOP")

        # Footer line
        self.setStrokeColor(colors.HexColor('#cbd5e1'))
        self.setLineWidth(0.75)
        self.line(40, 42, 572, 42)

        # Footer text
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor('#64748b'))
        self.drawString(40, 30, "Universal Dynamic Consulting Services (UDCS) • Confidential Client Architecture")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 30, page_str)
        self.restoreState()

def create_guide_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a')
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#b45309')
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=10,
        spaceAfter=5
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#1e293b')
    )

    body_style = ParagraphStyle(
        'BodyDark',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4
    )

    callout_title = ParagraphStyle(
        'CalloutTitle',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#065f46')
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#065f46')
    )

    story = []

    # ================= PAGE 1 =================
    story.append(Paragraph("Stripe & Bluevine Integration Guide", title_style))
    story.append(Paragraph("Standard Operating Procedure for Connecting Payment Keys & Payouts", subtitle_style))
    story.append(Spacer(1, 10))

    # Executive Overview Box
    overview_html = """
    <b>System Purpose:</b> Iron Prairie's website utilizes a dual-track payment engine: <b>100% Stripe Checkout</b> for immediate e-commerce paddle blind sales (Cards, Apple Pay, Google Pay, and instant ACH bank transfers), and <b>Net 30 Commercial PO / ACH</b> for industrial plants. Cleared funds from Stripe automatically deposit into your <b>Bluevine Business Checking</b> account every 1–2 business days.
    """
    overview_table = Table(
        [[Paragraph(overview_html, ParagraphStyle('Ov', fontName='Helvetica', fontSize=8.5, leading=12.5, textColor=colors.HexColor('#1e293b')))]],
        colWidths=[532]
    )
    overview_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(overview_table)
    story.append(Spacer(1, 12))

    # SECTION 1: How to Get Stripe API Keys
    story.append(Paragraph("PHASE 1: Retrieving Your Stripe API Keys", h1_style))
    story.append(Paragraph("Follow these 4 quick steps inside your Stripe dashboard to locate your integration keys:", body_style))
    story.append(Spacer(1, 4))

    steps_data = [
        [
            Paragraph("<b>Step 1</b>", h2_style),
            Paragraph("Log in to your Stripe dashboard at <b>https://dashboard.stripe.com/login</b> using your Iron Prairie credentials.", body_style)
        ],
        [
            Paragraph("<b>Step 2</b>", h2_style),
            Paragraph("<b>Confirm Live Mode:</b> In the top-right header of the Stripe dashboard, verify that the <b>'Test mode'</b> toggle is switched <b>OFF</b> so you retrieve production live keys.", body_style)
        ],
        [
            Paragraph("<b>Step 3</b>", h2_style),
            Paragraph("Click on <b>Developers</b> in the top right menu, then click <b>API Keys</b> in the left sidebar (direct link: <b>https://dashboard.stripe.com/apikeys</b>).", body_style)
        ],
        [
            Paragraph("<b>Step 4</b>", h2_style),
            Paragraph("Under the <b>Standard Keys</b> table, copy both credentials:<br/>"
                      "• <b>Publishable Key:</b> Starts with <font face='Courier-Bold' color='#0f172a'>pk_live_...</font> (Click the key to copy).<br/>"
                      "• <b>Secret Key:</b> Starts with <font face='Courier-Bold' color='#0f172a'>sk_live_...</font> (Click <i>'Reveal live key'</i> and copy).<br/>"
                      "<i>*Note: Stripe may send an SMS verification code to your mobile phone before revealing the secret key.</i>", body_style)
        ]
    ]

    steps_table = Table(steps_data, colWidths=[60, 472])
    steps_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, colors.HexColor('#f1f5f9')),
    ]))
    story.append(steps_table)
    story.append(Spacer(1, 14))

    # SECTION 2: Linking Stripe Payouts to Bluevine
    story.append(Paragraph("PHASE 2: Connecting Payouts to Bluevine Checking", h1_style))
    story.append(Paragraph("Ensure all website sales deposit directly into your Bluevine business bank account:", body_style))
    story.append(Spacer(1, 4))

    payout_data = [
        [
            Paragraph("<b>Step A</b>", h2_style),
            Paragraph("In Stripe, click the <b>Settings icon (Gear)</b> in the top right ➔ click <b>Bank accounts and scheduling</b> under <i>Business Settings</i>.", body_style)
        ],
        [
            Paragraph("<b>Step B</b>", h2_style),
            Paragraph("Click <b>Add bank account</b> and enter your Bluevine <b>Routing Number</b> and <b>Account Number</b> (found in your Bluevine app under Account Details).", body_style)
        ],
        [
            Paragraph("<b>Step C</b>", h2_style),
            Paragraph("Set your payout schedule to <b>Automatic (Rolling daily)</b>. Stripe will sweep cleared revenue directly into Bluevine.", body_style)
        ]
    ]
    payout_table = Table(payout_data, colWidths=[60, 472])
    payout_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, colors.HexColor('#f1f5f9')),
    ]))
    story.append(payout_table)

    # Clean Page Break
    story.append(PageBreak())

    # ================= PAGE 2 =================
    story.append(Paragraph("PHASE 3: Processing Fee Intelligence & Margin Protection", h1_style))
    story.append(Paragraph("Industrial steel fabrication deals with large order values. Standard 3% credit card processing fees can eat heavily into your gross profit on custom burns. Below is how the website's payment structure protects your bottom line:", body_style))
    story.append(Spacer(1, 6))

    # Detailed Fee Comparison Table
    fee_table_data = [
        [
            Paragraph("<b>Payment Method</b>", ParagraphStyle('TH1', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
            Paragraph("<b>Stripe Fee Rate</b>", ParagraphStyle('TH2', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
            Paragraph("<b>Fee on $1,000</b>", ParagraphStyle('TH3', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
            Paragraph("<b>Fee on $10,000</b>", ParagraphStyle('TH4', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
            Paragraph("<b>Russell Keeps ($10k)</b>", ParagraphStyle('TH5', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
        ],
        [
            Paragraph("<b>Credit Card / Apple Pay</b><br/><font size=7.5 color='#64748b'>Fast turnaround web buyers</font>", body_style),
            Paragraph("2.9% + $0.30", body_style),
            Paragraph("$29.30", body_style),
            Paragraph("<font color='#dc2626'><b>$290.30</b></font>", body_style),
            Paragraph("$9,709.70", body_style),
        ],
        [
            Paragraph("<b>Stripe ACH Direct Debit</b><br/><font size=7.5 color='#059669'>Instant online bank transfer</font>", body_style),
            Paragraph("0.8% (<b>$5.00 Max Cap</b>)", body_style),
            Paragraph("$5.00", body_style),
            Paragraph("<font color='#059669'><b>$5.00 FLAT</b></font>", body_style),
            Paragraph("<b>$9,995.00</b>", body_style),
        ],
        [
            Paragraph("<b>Direct Bluevine Wire / ACH</b><br/><font size=7.5 color='#64748b'>Net 30 Invoiced Accounts</font>", body_style),
            Paragraph("Direct Bank Transfer", body_style),
            Paragraph("$0.00", body_style),
            Paragraph("<font color='#059669'><b>$0.00</b></font>", body_style),
            Paragraph("<b>$10,000.00</b>", body_style),
        ]
    ]

    fee_table = Table(fee_table_data, colWidths=[155, 95, 80, 95, 107])
    fee_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(fee_table)
    story.append(Spacer(1, 10))

    # Key Takeaways Box
    takeaway_html = """
    <b>⚡ The 3% ACH Cash Discount Strategy (Web &amp; Email Proposals):</b><br/>
    • <b>Incentivize ACH Payments:</b> The website and email proposals now feature an instant <b>3% ACH Discount</b> (e.g. Save $30 on $1,000, Save $300 on $10,000) when buyers pay via direct bank debit or wire transfer.<br/>
    • <b>$5.00 Maximum Fee Cap:</b> Stripe charges a flat <b>$5.00 max</b> for ACH. Giving a 3% discount and paying $5 saves you from eating 2.9% + $0.30 credit card processor fees while getting cash in your account faster!<br/>
    • <b>Email Proposal Close Engine:</b> Clients receiving PDF quotes from <i>Sales@ironprairiefabrication.com</i> are prompted to confirm their PO via ACH to lock in the 3% discount rate.
    """
    takeaway_box = Table([[Paragraph(takeaway_html, callout_style)]], colWidths=[532])
    takeaway_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ecfdf5')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#a7f3d0')),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(takeaway_box)
    story.append(Spacer(1, 14))

    # SECTION 4: Handoff Checklist
    story.append(Paragraph("PHASE 4: Ready to Connect? Here is the Handoff Checklist", h1_style))
    story.append(Paragraph("Once you have accessed your Stripe Dashboard, send the following details to Michael (UDCS):", body_style))
    story.append(Spacer(1, 4))

    checklist_text = """
    <b>Connection Checklist:</b><br/>
    [ &nbsp; ] <b>1. Stripe Publishable Key:</b> <font face='Courier-Bold' color='#0f172a'>pk_live_...</font> (Safe for website configuration)<br/>
    [ &nbsp; ] <b>2. Stripe Secret Key:</b> <font face='Courier-Bold' color='#0f172a'>sk_live_...</font> (Sent securely via encrypted channel / text)<br/>
    [ &nbsp; ] <b>3. Bluevine Payouts:</b> Confirmation that Bluevine Business Checking is linked in Stripe.<br/><br/>
    <b>What Happens Next:</b><br/>
    UDCS will immediately connect the API keys to the live environment, run a test transaction, and verify that paid orders automatically route straight to the <b>Iron Prairie CNC Plasma Shop Floor Board</b> with certified ASME MTR travelers.
    """
    checklist_box = Table([[Paragraph(checklist_text, ParagraphStyle('Chk', fontName='Helvetica', fontSize=8.5, leading=13.5, textColor=colors.HexColor('#1e293b')))]], colWidths=[532])
    checklist_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fffbeb')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fde68a')),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(checklist_box)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated clean 2-page PDF: {filename}")

if __name__ == '__main__':
    output_pdf_path = r"c:\Users\micha\Desktop\Iron-Prairie-Website\Iron_Prairie_Stripe_Bluevine_Guide.pdf"
    create_guide_pdf(output_pdf_path)
