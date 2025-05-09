// Fix for the ExportHandler.ts
// Only the necessary changes to resolve the blank export issue

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WhiteboardObject, isShape, PenStroke, Page } from '../../Types/WhiteboardTypes';

interface ExportOptions {
  format: 'PNG' | 'JPG' | 'PDF';
  filename: string;
  scale: number;
  pages: Page[];
}

export class ExportHandler {
  static async exportBoard(
    boardElement: HTMLElement, 
    options: ExportOptions
  ): Promise<void> {
    try {
      // Configure html2canvas options
      const canvasOptions = {
        scale: options.scale,
        backgroundColor: '#ffffff',
        logging: true,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        ignoreElements: (element: Element) => {
          return element.classList.contains('bottom-panel');
        }
      };

      if (options.format === 'PDF' && options.pages.length > 1) {
        // For PDF with multiple pages
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: 'a4'
        });

        for (let i = 0; i < options.pages.length; i++) {
          const page = options.pages[i];
          // Set the background color for the current page
          boardElement.style.backgroundColor = page.backgroundColor;
          
          // Convert the board to canvas
          const canvas = await html2canvas(boardElement, canvasOptions);
          
          // Add page to PDF
          if (i > 0) pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, canvas.width, canvas.height);
        }

        pdf.save(`${options.filename}.pdf`);
      } else {
        // For single page or image formats
        const canvas = await html2canvas(boardElement, canvasOptions);

        switch (options.format) {
          case 'PNG':
            this.downloadImage(canvas, `${options.filename}.png`, 'image/png');
            break;
          case 'JPG':
            this.downloadImage(canvas, `${options.filename}.jpg`, 'image/jpeg');
            break;
          case 'PDF':
            this.downloadPDF(canvas, options.filename);
            break;
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export whiteboard');
    }
  }

  private static downloadImage(canvas: HTMLCanvasElement, filename: string, type: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL(type, 1.0);
    link.click();
  }

  private static downloadPDF(canvas: HTMLCanvasElement, filename: string): void {
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  }
}