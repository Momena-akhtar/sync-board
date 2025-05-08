// src/handlers/PenToolHandler.ts
import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject, PenStroke } from '../../Types/WhiteboardTypes';

interface PenToolState {
  objects: WhiteboardObject[];
  setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
  setIsDrawing?: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStroke?: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
  isDrawing?: boolean;
  currentStroke?: WhiteboardObject | null;
}

interface PenToolMoveState {
  isDrawing: boolean;
  currentStroke: WhiteboardObject | null;
  setCurrentStroke: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
}

export const PenToolHandler = {
  // Default pen settings
  defaultSettings: {
    color: '#ffffff',
    strokeWidth: 2,
  },

  // Method to change pen color
  setPenColor: (color: string) => {
    PenToolHandler.defaultSettings.color = color;
  },

  // Method to change stroke width
  setStrokeWidth: (width: number) => {
    PenToolHandler.defaultSettings.strokeWidth = width;
  },

  onMouseDown: (e: React.MouseEvent, state: PenToolState) => {
    const { setIsDrawing, setCurrentStroke } = state;
    
    if (!setIsDrawing || !setCurrentStroke) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    const newStroke: PenStroke = {
      id: uuidv4(),
      type: 'pen-stroke',
      points: [{ x, y }],
      color: PenToolHandler.defaultSettings.color,
      strokeWidth: PenToolHandler.defaultSettings.strokeWidth,
      isSelected: false
    };

    setCurrentStroke(newStroke);
  },

  onMouseMove: (e: React.MouseEvent, state: PenToolMoveState) => {
    const { isDrawing, currentStroke, setCurrentStroke } = state;

    if (!isDrawing || !currentStroke || currentStroke.type !== 'pen-stroke') return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedStroke: PenStroke = {
      ...currentStroke,
      points: [...currentStroke.points, { x, y }]
    };

    setCurrentStroke(updatedStroke);
  },

  onMouseUp: (e: React.MouseEvent, state: PenToolState) => {
    const { isDrawing, currentStroke, objects, setObjects, setIsDrawing, setCurrentStroke } = state;

    if (!isDrawing || !currentStroke || !setIsDrawing || !setCurrentStroke) return;

    if (currentStroke.type === 'pen-stroke' && currentStroke.points.length > 1) {
      setObjects([...objects, currentStroke]);
    }

    setIsDrawing(false);
    setCurrentStroke(null);
  }
};