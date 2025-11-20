


// google form Name and session id

const formBaseURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdmRMKGBvWiymaxuxL55Q_51kuOidon3vyKzjD8AeqN6GDIqg/viewform?usp=pp_url';
const sessionEntryID = 'entry.383686829';


// generate session id

function generateSessionID() {
  // UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


// Main logic after DOM loaded

document.addEventListener('DOMContentLoaded', () => {
  const sessionID = generateSessionID();
  const preFilledFormURL = `${formBaseURL}&${sessionEntryID}=${sessionID}`;

  // Generate QR Code as image inside div#qrcode
  QRCode.toDataURL(preFilledFormURL, { width: 250 }, function(error, url) {
    if (error) {
      console.error(error);
      return;
    }
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = `<img src="${url}" alt="QR Code" />`;
    console.log('QR code generated!');
  });
});
