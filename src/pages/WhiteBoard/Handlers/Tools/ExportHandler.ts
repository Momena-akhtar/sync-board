// Fix for the ExportHandler.ts
// Only the necessary changes to resolve the blank export issue

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WhiteboardObject, isShape, PenStroke } from '../../Types/WhiteboardTypes';

interface ExportOptions {
  format: 'PNG' | 'JPG' | 'PDF';
  filename: string;
  scale: number;
}

export class ExportHandler {
  static async exportBoard(
    boardElement: HTMLElement, 
    options: ExportOptions,
    elements: WhiteboardObject[]
  ): Promise<void> {
    try {
      // Instead of creating a separate container, directly capture the boardElement
      // This ensures we capture what's actually visible to the user
      
      // Configure html2canvas options
      const canvasOptions = {
        scale: options.scale,
        backgroundColor: '#ffffff',
        logging: true, // Enable logging for debugging
        useCORS: true, // Enable CORS for images
        allowTaint: true,
        foreignObjectRendering: true,
        ignoreElements: (element: Element) => {
          // Ignore the bottom panel in the export
          return element.classList.contains('bottom-panel');
        }
      };

      // Convert the actual board to canvas
      const canvas = await html2canvas(boardElement, canvasOptions);

      // Handle different export formats
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