import * as PDFDocument from 'pdfkit';
import { generateQrCode } from './qrcode.util';

function addImagesToDoc(doc, images) {
  const itemPerPage = 20;
  const sizes = [135, 135];
  const positions = [
    [11, 29], [157, 29], [303, 29], [449, 29],
    [11, 191], [157, 191], [303, 191], [449, 191],
    [11, 353], [157, 353], [303, 353], [449, 353],
    [11, 515], [157, 515], [303, 515], [449, 515],
    [11, 677], [157, 677], [303, 677], [449, 677]
  ];

  for (let i = 0; i < images.length; i++) {
    if (i > 0 && i % itemPerPage === 0) {
      doc.addPage();
    }

    doc
      .image(images[i], ...positions[i % itemPerPage], {
        fit: sizes,
        align: 'center',
        valign: 'center'
      })
      .rect(...positions[i % itemPerPage], ...sizes)
      .stroke();
  }
}

export function generatePdf(links: string[]): Promise<Buffer> {
  console.log(links);
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true
    });

    const images = await Promise.all(
      links.map((text) => {
        return generateQrCode(text);
      })
    );

    addImagesToDoc(doc, images);

    doc.end();

    const buffer = [];
    doc.on('data', buffer.push.bind(buffer));
    doc.on('end', () => {
      const data = Buffer.concat(buffer);
      resolve(data);
    });
  });
}