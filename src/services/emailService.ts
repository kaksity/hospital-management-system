// src/services/emailService.ts
import { toast } from 'sonner';

export interface EmailAttachment {
  name: string;
  content: string; // Base64 encoded
}

export interface ReportEmailData {
  to: string[];
  patientName: string;
  reportNumber: string;
  reportDate: string;
  physicianName: string;
  reportContent: string;
  attachments?: EmailAttachment[];
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = import.meta.env.VITE_APP_BREVO_API_KEY;
const USE_MOCK_EMAIL = import.meta.env.VITE_APP_USE_MOCk_EMAIL === 'true';

class EmailService {
  async sendReport(emailData: ReportEmailData) {
    if (USE_MOCK_EMAIL || !BREVO_API_KEY) {
      console.log('--- MOCK EMAIL SENDING ---');
      console.log('To:', emailData.to);
      console.log('Subject:', `Diagnostic Report Ready: ${emailData.reportNumber}`);
      console.log('Attachments:', emailData.attachments?.map(a => a.name));

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        success: true,
        message: 'Report sent successfully (Mock Mode)',
      };
    }

    try {
      // Clean HTML content for summary
      const cleanSummary = emailData.reportContent.replace(/<[^>]*>/g, '').substring(0, 500);

      const payload = {
        sender: {
          name: 'Radiology Diagnostic Center',
          email: 'reports@radiologycenter.com',
        },
        to: emailData.to.map(email => ({
          email,
          name: emailData.patientName,
        })),
        subject: `Diagnostic Report Available: ${emailData.reportNumber} - ${emailData.patientName}`,
        htmlContent: this.generateHtmlContent(emailData, cleanSummary),
        attachment: emailData.attachments?.map(att => ({
          name: att.name,
          content: att.content,
        })),
        replyTo: {
          email: 'support@radiologycenter.com',
          name: 'Support Team'
        }
      };

      const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email');
      }

      const data = await response.json();

      return {
        success: true,
        messageId: data.messageId,
        message: 'Report sent successfully',
      };
    } catch (error: any) {
      console.error('Brevo Email Error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  public generateHtmlContent(emailData: ReportEmailData, summaryText: string) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #f9fafb; }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 40px 20px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; letter-spacing: 1px; color: white; text-decoration: none; }
          .content { padding: 30px; background: white; border-radius: 8px; margin: -20px 20px 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .report-info { background: #f3f4f6; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #4f46e5; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .label { font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-bottom: 2px; }
          .value { font-size: 14px; font-weight: 500; color: #111827; }
          .summary { color: #4b5563; font-size: 14px; background: #fdfdfd; border: 1px solid #e5e7eb; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .cta { text-align: center; margin: 30px 0; }
          .button { background: #4f46e5; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; }
          .footer { text-align: center; padding: 30px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CAREPAK DIAGNOSTICS</div>
            <p style="margin-top: 10px; opacity: 0.9;">Radiology & Lab Report Notification</p>
          </div>
          
          <div class="content">
            <h2 style="margin: 0 0 10px; color: #1f2937;">Report Ready for Review</h2>
            <p style="margin: 0; color: #6b7280;">Dear ${emailData.patientName}, your diagnostic report has been finalized.</p>
            
            <div class="report-info">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-bottom: 15px;">
                    <div class="label">Report Number</div>
                    <div class="value">${emailData.reportNumber}</div>
                  </td>
                  <td width="50%" style="padding-bottom: 15px;">
                    <div class="label">Report Date</div>
                    <div class="value">${emailData.reportDate}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="label">Physician</div>
                    <div class="value">${emailData.physicianName}</div>
                  </td>
                </tr>
              </table>
            </div>
            
            <div class="summary">
              <strong>Report Preview:</strong><br>
              <div style="margin-top: 8px; color: #666;">${summaryText}...</div>
            </div>
            
            <div class="cta">
              <a href="https://carepak-portal.com/reports/${emailData.reportNumber}" class="button">Access Full Report</a>
            </div>
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              For your protection, this link will expire in 14 days.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Radiology Diagnostic Center</strong></p>
            <p>123 Medical Plaza, Victoria Island, Lagos</p>
            <p>Confidential Medical Information - Restricted Access</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();