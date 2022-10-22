import * as QRCode from 'qrcode';

export function generateQrCode(text) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(
      text,
      {
        type: 'image/png',
        quality: 1
      },
      (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(data);
      }
    );
  });
}
