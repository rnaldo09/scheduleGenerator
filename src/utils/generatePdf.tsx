import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function downloadHtmlAsPdf(ref: React.RefObject<HTMLElement>) {
  if (!ref.current) return;

  const canvas = await html2canvas(ref.current, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('l', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('jadwal.pdf');
}
