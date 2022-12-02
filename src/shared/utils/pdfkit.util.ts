import * as PDFDocument from 'pdfkit';
import { generateQrCode } from './qrcode.util';
import { AppConfig } from '../config';

function drawCutLine(doc) {
  doc.moveTo(297, 0).lineTo(297, 840).dash(3, { space: 0 }).stroke();

  doc.moveTo(0, 287).lineTo(840, 287).dash(3, { space: 0 }).stroke();

  doc.moveTo(0, 547).lineTo(840, 547).dash(3, { space: 0 }).stroke();
}

function addImagesToDoc(doc, images) {
  const itemPerPage = 6;
  const sizes = [160, 160];
  const positions = [
    [69, 60],
    [367, 60],
    [69, 340],
    [367, 340],
    [69, 620],
    [367, 620]
  ];

  for (let i = 0; i < images.length; i++) {
    if (i > 0 && i % itemPerPage === 0) {
      drawCutLine(doc);
      doc.addPage();
    }

    const [x, y] = positions[i % itemPerPage];
    doc
      .image(images[i]?.link, ...positions[i % itemPerPage], {
        fit: sizes,
        align: 'center',
        valign: 'center'
      })
      .rect(x, y, ...sizes)
      .text(images[i]?.text, x + 65, y - 15)
      .stroke();
  }

  drawCutLine(doc);
}

export function generatePdf(electionId: string, codes: any): Promise<Buffer> {
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true
    });

    const images = [];
    for (const code of codes) {
      const link = await generateQrCode(
        `${AppConfig.APP.WEBSITE_URL}/voting/?election=${electionId}&code=${code.id}`
      );

      images.push({
        text: code.text,
        link
      });
    }

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
