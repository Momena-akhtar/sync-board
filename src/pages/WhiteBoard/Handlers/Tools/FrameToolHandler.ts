import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject } from '../../Types/WhiteboardTypes';
import React from 'react';

export const FrameToolHandler = {
  onMouseDown: (
    e: React.MouseEvent,
    { setIsDrawing, setStartPos, setCurrentFrame }: {
      objects: WhiteboardObject[];
      setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
      setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
      setStartPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
      setCurrentFrame: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
    }
  ) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setIsDrawing(true);
    setCurrentFrame({
      id: uuidv4(),
      type: 'frame',
      x,
      y,
      width: 0,
      height: 0
    });
  },

  onMouseMove: (
    e: React.MouseEvent,
    { isDrawing, startPos, currentFrame, setCurrentFrame }: {
      isDrawing: boolean;
      startPos: { x: number; y: number } | null;
      currentFrame: WhiteboardObject | null;
      setCurrentFrame: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
    }
  ) => {
    if (isDrawing && startPos && currentFrame && currentFrame.type === 'frame') {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newWidth = x - startPos.x;
      const newHeight = y - startPos.y;

      setCurrentFrame({
        ...currentFrame,
        width: newWidth,
        height: newHeight,
      });
    }
  },

  onMouseUp: (
    e: React.MouseEvent,
    { isDrawing, currentFrame, objects, setObjects, setIsDrawing, setStartPos, setCurrentFrame }: {
      isDrawing: boolean;
      currentFrame: WhiteboardObject | null;
      objects: WhiteboardObject[];
      setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
      setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
      setStartPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
      setCurrentFrame: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
    }
  ) => {
    if (isDrawing && currentFrame && currentFrame.type === 'frame') {
      setObjects([...objects, currentFrame]);
      setIsDrawing(false);
      setStartPos(null);
      setCurrentFrame(null);
    }
  }
};