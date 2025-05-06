import React from 'react';
import { WhiteboardObject } from '../../Types/WhiteboardTypes';
import ShapeResizeHandles from './ShapeResizeHandler';

interface ShapeProps {
  shape: WhiteboardObject;
  onResize: (id: string, handlePos: string, e: React.MouseEvent) => void;
  onSelect: (id: string, e: React.MouseEvent) => void;
}

// Rectangle Component
export const Rectangle: React.FC<ShapeProps> = ({ shape, onResize, onSelect }) => {
  if (shape.type !== 'rectangle') return null;
  
  return (
    <div className="absolute" style={{ position: 'absolute', top: 0, left: 0 }}>
      <div
        className="absolute"
        style={{
          left: `${shape.x}px`,
          top: `${shape.y}px`,
          width: `${shape.width}px`,
          height: `${shape.height}px`,
          backgroundColor: shape.fill,
          border: `${shape.strokeWidth}px solid ${shape.stroke}`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(shape.id, e);
        }}
      />
      
      {shape.isSelected && (
        <ShapeResizeHandles
          id={shape.id}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          onResize={onResize}
        />
      )}
    </div>
  );
};

// Circle Component
export const Circle: React.FC<ShapeProps> = ({ shape, onResize, onSelect }) => {
  if (shape.type !== 'circle') return null;
  
  return (
    <div className="absolute" style={{ position: 'absolute', top: 0, left: 0 }}>
      <div
        className="absolute rounded-full"
        style={{
          left: `${shape.x}px`,
          top: `${shape.y}px`,
          width: `${shape.width}px`,
          height: `${shape.height}px`,
          backgroundColor: shape.fill,
          border: `${shape.strokeWidth}px solid ${shape.stroke}`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(shape.id, e);
        }}
      />
      
      {shape.isSelected && (
        <ShapeResizeHandles
          id={shape.id}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          onResize={onResize}
        />
      )}
    </div>
  );
};

// Triangle Component
export const Triangle: React.FC<ShapeProps> = ({ shape, onResize, onSelect }) => {
  if (shape.type !== 'triangle' || !shape.points) return null;
  
  const pointsString = shape.points.map(p => `${p.x},${p.y}`).join(' ');
  
  return (
    <div className="absolute" style={{ position: 'absolute', top: 0, left: 0 }}>
      <svg
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <polygon
          points={pointsString}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(shape.id, e);
          }}
        />
      </svg>
      
      {shape.isSelected && (
        <ShapeResizeHandles
          id={shape.id}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          onResize={onResize}
        />
      )}
    </div>
  );
};

// Diamond Component
export const Diamond: React.FC<ShapeProps> = ({ shape, onResize, onSelect }) => {
  if (shape.type !== 'diamond' || !shape.points) return null;
  
  const pointsString = shape.points.map(p => `${p.x},${p.y}`).join(' ');
  
  return (
    <div className="absolute" style={{ position: 'absolute', top: 0, left: 0 }}>
      <svg
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <polygon
          points={pointsString}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(shape.id, e);
          }}
        />
      </svg>
      
      {shape.isSelected && (
        <ShapeResizeHandles
          id={shape.id}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          onResize={onResize}
        />
      )}
    </div>
  );
};
// Arrow Component
export const Arrow: React.FC<ShapeProps> = ({ shape, onResize, onSelect }) => {
  if (shape.type !== 'arrow' || !shape.points) return null;
  
  const [startPoint, endPoint] = shape.points;

  return (
    <div className="absolute" style={{ position: 'absolute', top: 0, left: 0 }}>
      <svg
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          markerEnd="url(#arrowhead)"  // Attach arrowhead marker
        />
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            orient="auto"
            markerWidth="6"
            markerHeight="6"
            fill={shape.stroke}  // Arrow color matches the stroke
          >
            <polygon points="0,0 10,5 0,10" />
          </marker>
        </defs>
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(shape.id, e);
          }}
        />
      </svg>
      
      {shape.isSelected && (
        <ShapeResizeHandles
          id={shape.id}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          onResize={onResize}
        />
      )}
    </div>
  );
};

// Hexagon Component
export const Hexagon: React.FC<ShapeProps> = ({ shape, onResize, onSelect }) => {
  if (shape.type !== 'hexagon' || !shape.points) return null;
  
  const pointsString = shape.points.map(p => `${p.x},${p.y}`).join(' ');
  
  return (
    <div className="absolute" style={{ position: 'absolute', top: 0, left: 0 }}>
      <svg
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <polygon
          points={pointsString}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(shape.id, e);
          }}
        />
      </svg>
      
      {shape.isSelected && (
        <ShapeResizeHandles
          id={shape.id}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          onResize={onResize}
        />
      )}
    </div>
  );
};