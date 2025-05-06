export type WhiteboardObject = 
  | { id: string; type: 'frame'; x: number; y: number; width: number; height: number }
  | { id: string; type: 'text'; x: number; y: number; width: number; height: number; content: string; isEditing: boolean }
  | { id: string; type: 'sticky-note'; x: number; y: number; content: string; }
  | 
  { 
    id: string; 
    type: 'image'; 
    x: number; 
    y: number; 
    src: string; 
    width: number; 
    height: number; 
    alt?: string;
    isSelected?: boolean;
  }
  |
  { 
    id: string; 
    type: 'pen-stroke'; 
    points: Array<{x: number; y: number}>; 
    color: string; 
    strokeWidth: number; 
  }
  | {
    id: string;
    type: 'rectangle' | 'circle' | 'triangle' | 'diamond' | 'hexagon' | 'arrow';
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    isSelected?: boolean;
    points?: Array<{x: number; y: number}>;
    radius?: number;
  };