export function formatCoverLetterToHTML(letterText, data, letterHeader = {}) {
  if (!letterText) return '';

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Extract address from data
  const address = data?.basics?.location;
  const senderAddress = address 
    ? `${address.address || ''}, ${address.postalCode || ''} ${address.city || ''}`
    : 'Adresse';

  // Letter header editable fields
  const recipientName = letterHeader?.recipientName || '[Nom du recruteur]';
  const recipientTitle = letterHeader?.recipientTitle || '[Titre du poste]';
  const companyName = letterHeader?.companyName || '[Nom de l\'entreprise]';
  const companyAddress = letterHeader?.companyAddress || '[Adresse de l\'entreprise]';
  const companyZipCity = letterHeader?.companyZipCity || '[Code postal] [Ville]';
  const senderLocation = letterHeader?.senderLocation || 'Lieu';

  const letterHTML = `
    <div style="font-family: 'Calibri', sans-serif; line-height: 1.5; color: #333; max-width: 900px; margin: 0 auto;">
      <!-- EN-TÊTE EXPÉDITEUR -->
      <div style="margin-bottom: 30px;">
        <p style="font-weight: bold; margin: 0;">${data?.basics?.name || 'Votre Nom'}</p>
        <p style="margin: 0; font-size: 0.95em;">${senderAddress}</p>
        <p style="margin: 0; font-size: 0.95em;">${data?.basics?.email || 'email@example.com'}</p>
        <p style="margin: 0; font-size: 0.95em;">${data?.basics?.phone || 'Téléphone'}</p>
      </div>

      <!-- DATE -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 0;">À ${senderLocation}, le ${formattedDate}</p>
      </div>

      <!-- DESTINATAIRE -->
      <div style="margin-bottom: 30px; font-size: 0.95em;">
        <p style="margin: 0; font-weight: bold;">${recipientName}</p>
        <p style="margin: 0;">${recipientTitle}</p>
        <p style="margin: 0;">${companyName}</p>
        <p style="margin: 0;">${companyAddress}</p>
        <p style="margin: 0;">${companyZipCity}</p>
      </div>

      <!-- OBJET -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 0;"><strong>Objet : Candidature au poste de ${recipientTitle}</strong></p>
      </div>

      <!-- SALUTATION -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 0;">Madame, Monsieur,</p>
      </div>

      <!-- CORPS DE LA LETTRE -->
      <div style="margin-bottom: 20px; text-align: justify;">
        ${letterText.split('\n\n').map(paragraph => 
          `<p style="margin: 10px 0; text-align: justify;">${paragraph.replace(/\n/g, '<br>')}</p>`
        ).join('')}
      </div>

      <!-- FERMETURE -->
      <div style="margin-top: 30px;">
        <p style="margin: 10px 0;">Restant à votre disposition pour un entretien,</p>
        <p style="margin: 10px 0;">Je vous prie de recevoir, Madame, Monsieur, l'expression de mes salutations distinguées.</p>
      </div>

      <!-- SIGNATURE -->
      <div style="margin-top: 50px; padding-top: 20px;">
        <p style="margin: 0;">${data?.basics?.name || 'Votre Nom'}</p>
      </div>
    </div>
  `;

  return letterHTML;
}
