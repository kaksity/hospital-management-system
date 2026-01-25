// src/services/pdfService.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
    filename: string;
    margin?: number;
}

class PDFService {
    async generateFromElement(elementId: string, options: PDFOptions): Promise<string> {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with id ${elementId} not found`);
        }

        try {
            // Temporarily add a class for PDF styling if needed
            element.classList.add('pdf-rendering');

            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            element.classList.remove('pdf-rendering');

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Return as base64 string
            return pdf.output('datauristring').split(',')[1];
        } catch (error) {
            console.error('PDF Generation Error:', error);
            throw new Error('Failed to generate PDF report');
        }
    }

    async generateSimplePDF(content: string, reportData: any): Promise<string> {
        // A fallback simple PDF generation if html2canvas fails or is too slow
        const pdf = new jsPDF();

        pdf.setFontSize(22);
        pdf.text('DIAGNOSTIC REPORT', 105, 20, { align: 'center' });

        pdf.setFontSize(12);
        pdf.text(`Report No: ${reportData.reportNo}`, 20, 40);
        pdf.text(`Patient: ${reportData.patientName}`, 20, 50);
        pdf.text(`Date: ${reportData.reportDate}`, 20, 60);
        pdf.text(`Physician: ${reportData.physicianName || reportData.physician}`, 20, 70);

        pdf.line(20, 75, 190, 75);

        // Convert HTML to plain text for simple PDF
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const text = tempDiv.innerText || tempDiv.textContent || "";

        const splitText = pdf.splitTextToSize(text, 170);
        pdf.text(splitText, 20, 90);

        return pdf.output('datauristring').split(',')[1];
    }
}

export const pdfService = new PDFService();
