// src/handlers/EraserToolHandler.ts
import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject } from '../../Types/WhiteboardTypes';

interface EraserToolHandlerProps {
  objects: WhiteboardObject[];
  setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
  isErasing: boolean;
  setIsErasing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EraserToolHandler = {
  // Default eraser settings
  defaultSettings: {
    eraserSize: 20,
  },

  onMouseDown: (e: React.MouseEvent, { 
    setIsErasing 
  }: Pick<EraserToolHandlerProps, 'setIsErasing'>) => {
    setIsErasing(true);
  },

  onMouseMove: (e: React.MouseEvent, {
    isErasing,
    objects,
    setObjects
  }: Pick<EraserToolHandlerProps, 'isErasing' | 'objects' | 'setObjects'>) => {
    if (!isErasing) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const eraserSize = EraserToolHandler.defaultSettings.eraserSize;

    // Process objects to handle partial erasure
    const updatedObjects: WhiteboardObject[] = [];
    
    objects.forEach(obj => {
      // For pen strokes, we need to split strokes when erased
      if (obj.type === 'pen-stroke') {
        const remainingSubStrokes: Array<Array<{x: number, y: number}>> = [];
        let currentSubStroke: Array<{x: number, y: number}> = [];
        
        // Go through each point in the stroke
        obj.points.forEach((point, index) => {
          const distance = Math.sqrt(
            Math.pow(point.x - mouseX, 2) + Math.pow(point.y - mouseY, 2)
          );
          
          // If point is outside eraser radius, keep it
          if (distance >= eraserSize) {
            currentSubStroke.push(point);
          } else {
            // Point is erased - finish current substroke if it has points
            if (currentSubStroke.length > 0) {
              remainingSubStrokes.push([...currentSubStroke]);
              currentSubStroke = [];
            }
          }
        });
        
        // Add the last substroke if it has points
        if (currentSubStroke.length > 0) {
          remainingSubStrokes.push(currentSubStroke);
        }
        
        // Create new stroke objects for each substroke that has enough points
        remainingSubStrokes.forEach(subStroke => {
          if (subStroke.length >= 2) { // Only create strokes with at least 2 points
            updatedObjects.push({
              id: uuidv4(), // Generate new ID for each substroke
              type: 'pen-stroke',
              points: subStroke,
              color: obj.color,
              strokeWidth: obj.strokeWidth
            });
          }
        });
      } 
      // For other object types like frame or text, keep them untouched for now
      // You could implement partial erasure for them later if needed
      else {
        const objRight = 'x' in obj && 'width' in obj ? obj.x + obj.width : 0;
        const objBottom = 'y' in obj && 'height' in obj ? obj.y + obj.height : 0;
        
        // Simple collision detection for rectangular objects
        if (
          'x' in obj && 'y' in obj && 'width' in obj && 'height' in obj &&
          (mouseX - eraserSize >= objRight ||
          mouseX + eraserSize <= obj.x ||
          mouseY - eraserSize >= objBottom ||
          mouseY + eraserSize <= obj.y)
        ) {
          updatedObjects.push(obj);
        }
      }
    });

    setObjects(updatedObjects);
  },

  onMouseUp: (e: React.MouseEvent, {
    setIsErasing
  }: Pick<EraserToolHandlerProps, 'setIsErasing'>) => {
    setIsErasing(false);
  },

  // Method to change eraser size (for future use)
  setEraserSize: (size: number) => {
    EraserToolHandler.defaultSettings.eraserSize = size;
  }
};