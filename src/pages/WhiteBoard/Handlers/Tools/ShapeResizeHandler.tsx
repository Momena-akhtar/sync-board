import React from 'react';

interface ResizeHandlesProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onResize: (id: string, handlePos: string, e: React.MouseEvent) => void;
}

const ShapeResizeHandles: React.FC<ResizeHandlesProps> = ({ id, x, y, width, height, onResize }) => {
  const HANDLE_SIZE = 10;
  
  // Define the positions of the resize handles
  const handles = [
    { position: 'top-left', x: x, y: y },
    { position: 'top-right', x: x + width, y: y },
    { position: 'bottom-right', x: x + width, y: y + height },
    { position: 'bottom-left', x: x, y: y + height },
  ];

  return (
    <>
      {/* Bounding box */}
      <div 
        className="absolute border-2 border-blue-500 border-dashed pointer-events-none"
        style={{
          left: `${x - 2}px`, // Offset for border
          top: `${y - 2}px`,
          width: `${width + 4}px`, // Account for border width
          height: `${height + 4}px`,
        }}
      />
      
      {/* Resize handles */}
      {handles.map(handle => (
        <div
          key={handle.position}
          className="absolute bg-white border-2 border-blue-500 rounded-full cursor-pointer z-10"
          style={{
            left: `${handle.x - HANDLE_SIZE / 2}px`,
            top: `${handle.y - HANDLE_SIZE / 2}px`,
            width: `${HANDLE_SIZE}px`,
            height: `${HANDLE_SIZE}px`,
            cursor: 
              handle.position === 'top-left' || handle.position === 'bottom-right' 
                ? 'nwse-resize' 
                : handle.position === 'top-right' || handle.position === 'bottom-left'
                ? 'nesw-resize'
                : 'default',  // Ensure cursor is set appropriately for all positions
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResize(id, handle.position, e);
          }}
        />
      ))}
    </>
  );
};

export default ShapeResizeHandles;
