import html2pdf from 'html2pdf.js';

/**
 * Export the element to PDF.
 * Margin is 0 because our CV components manage their own padding.
 * pagebreak.avoid ensures sections are not split across pages.
 */
export const exportToPDF = async (elementId, filename = 'resume.pdf') => {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error('Element not found for PDF export:', elementId);
        return;
    }

    const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: {
            // 'css'       → respect break-inside / break-before / break-after CSS props
            // 'avoid-all' → try to avoid breaking inside any block element
            mode: ['css', 'avoid-all'],
        },
    };

    await html2pdf().set(opt).from(element).save();
};

// Alias kept for backward-compatibility
export const downloadPDFPreview = exportToPDF;
