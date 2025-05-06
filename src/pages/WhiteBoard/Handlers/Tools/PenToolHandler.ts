// src/handlers/PenToolHandler.ts
import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject } from '../../Types/WhiteboardTypes';

interface PenToolState {
  currentStroke: WhiteboardObject | null;
}

interface PenToolHandlerProps {
  objects: WhiteboardObject[];
  setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  currentStroke: WhiteboardObject | null;
  setCurrentStroke: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
}

export const PenToolHandler = {
  // Default pen settings
  defaultSettings: {
    color: '#FF0000', // Red color
    strokeWidth: 3,
  },

  onMouseDown: (e: React.MouseEvent, { 
    objects, 
    setObjects, 
    setIsDrawing, 
    setCurrentStroke 
  }: Omit<PenToolHandlerProps, 'isDrawing' | 'currentStroke'>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a new pen stroke
    const newStroke: WhiteboardObject = {
      id: uuidv4(),
      type: 'pen-stroke',
      points: [{ x, y }],
      color: PenToolHandler.defaultSettings.color,
      strokeWidth: PenToolHandler.defaultSettings.strokeWidth,
    };

    setCurrentStroke(newStroke);
    setIsDrawing(true);
  },

  onMouseMove: (e: React.MouseEvent, {
    isDrawing,
    currentStroke,
    setCurrentStroke
  }: Pick<PenToolHandlerProps, 'isDrawing' | 'currentStroke' | 'setCurrentStroke'>) => {
    if (!isDrawing || !currentStroke || currentStroke.type !== 'pen-stroke') return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add the new point to the current stroke
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, { x, y }]
    };

    setCurrentStroke(updatedStroke);
  },

  onMouseUp: (e: React.MouseEvent, {
    isDrawing,
    currentStroke,
    objects,
    setObjects,
    setIsDrawing,
    setCurrentStroke
  }: PenToolHandlerProps) => {
    if (!isDrawing || !currentStroke || currentStroke.type !== 'pen-stroke') return;

    // Add the final stroke to the objects array
    setObjects([...objects, currentStroke]);
    
    // Reset the drawing state
    setIsDrawing(false);
    setCurrentStroke(null);
  },

  // Method to change pen color (for future use)
  setPenColor: (color: string) => {
    PenToolHandler.defaultSettings.color = color;
  },

  // Method to change stroke width (for future use)
  setStrokeWidth: (width: number) => {
    PenToolHandler.defaultSettings.strokeWidth = width;
  }
};