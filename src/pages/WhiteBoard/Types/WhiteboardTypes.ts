// Base type for all whiteboard objects
interface BaseWhiteboardObject {
  id: string;
  isSelected?: boolean;
}

// Shape-specific types
export interface ShapeBase extends BaseWhiteboardObject {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  isDragging?: boolean;
}

export interface RectangleShape extends ShapeBase {
  type: 'rectangle';
}

export interface CircleShape extends ShapeBase {
  type: 'circle';
}

export interface PolygonShape extends ShapeBase {
  type: 'triangle' | 'diamond' | 'hexagon' | 'arrow';
  points: Array<{ x: number; y: number }>;
}

// Other whiteboard object types
export interface PenStroke extends BaseWhiteboardObject {
  type: 'pen-stroke';
  points: Array<{ x: number; y: number }>;
  color: string;
  strokeWidth: number;
}

export interface TextObject extends BaseWhiteboardObject {
  type: 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  isEditing: boolean;
}

export interface Frame extends BaseWhiteboardObject {
  type: 'frame';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageObject extends BaseWhiteboardObject {
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  alt?: string;
  isDragging?: boolean;
  dragOffset?: { x: number; y: number };
}

// Union type for all possible whiteboard objects
export type WhiteboardObject =
  | RectangleShape
  | CircleShape
  | PolygonShape
  | PenStroke
  | TextObject
  | Frame
  | ImageObject;

// Type guard functions
export const isShape = (obj: WhiteboardObject): obj is RectangleShape | CircleShape | PolygonShape => {
  return ['rectangle', 'circle', 'triangle', 'diamond', 'hexagon', 'arrow'].includes(obj.type);
};

export const isPolygonShape = (obj: WhiteboardObject): obj is PolygonShape => {
  return ['triangle', 'diamond', 'hexagon', 'arrow'].includes(obj.type);
};

export const hasShapeDimensions = (obj: WhiteboardObject): obj is WhiteboardObject & { width: number; height: number } => {
  return 'width' in obj && 'height' in obj;
};

export type ObjectsSetter = ((objects: WhiteboardObject[]) => void) | React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;

export interface ToolHandlerState {
  objects: WhiteboardObject[];
  setObjects: ObjectsSetter;
  setIsDrawing?: React.Dispatch<React.SetStateAction<boolean>>;
  setStartPos?: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  setCurrentShape?: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
  setCurrentStroke?: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
  setCurrentFrame?: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
  setSelectedShapeId?: React.Dispatch<React.SetStateAction<string | null>>;
  currentColor?: string;
}

export interface Page {
  id: string;
  name: string;
  pageNumber: number;
  objects: WhiteboardObject[];
  backgroundColor: string;
}

