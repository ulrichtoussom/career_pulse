import html2pdf from 'html2pdf.js';

export const exportToPDF = (elementId, filename = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error('Element not found for PDF export');
    return;
  }

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(element).save();
};

export const downloadPDFPreview = (elementId, filename = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error('Element not found for PDF download');
    return;
  }

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(element).save();
};
