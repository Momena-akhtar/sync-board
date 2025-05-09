import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject, RectangleShape, CircleShape, PolygonShape } from '../../Types/WhiteboardTypes';

type Shape = RectangleShape | CircleShape | PolygonShape;

function isDrawableShape(obj: WhiteboardObject): obj is Shape {
    return ['rectangle', 'circle', 'triangle', 'diamond', 'hexagon', 'arrow'].includes(obj.type);
}

interface ShapeToolState {
    objects: WhiteboardObject[];
    setObjects: (objects: WhiteboardObject[]) => void;
    setIsDrawing?: React.Dispatch<React.SetStateAction<boolean>>;
    setStartPos?: React.Dispatch<React.SetStateAction<{ x: number, y: number } | null>>;
    setCurrentShape?: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
    currentColor?: string;
}

interface ShapeToolMoveState {
    isDrawing: boolean;
    startPos: { x: number, y: number } | null;
    currentShape: WhiteboardObject | null;
    setCurrentShape: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
}

interface ShapeToolUpState {
    isDrawing: boolean;
    currentShape: WhiteboardObject | null;
    objects: WhiteboardObject[];
    setObjects: (objects: WhiteboardObject[]) => void;
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
    setStartPos: React.Dispatch<React.SetStateAction<{ x: number, y: number } | null>>;
    setCurrentShape: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
    setActiveTool: React.Dispatch<React.SetStateAction<string>>;
}

interface ShapeSelectState {
    objects: WhiteboardObject[];
    setObjects: (objects: WhiteboardObject[]) => void;
    setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ShapeDimensions {
    width: number;
    height: number;
}

function hasShapeDimensions(shape: WhiteboardObject): shape is WhiteboardObject & ShapeDimensions {
    return 'width' in shape && 'height' in shape;
}

// Standard size for shapes when simply clicked (not dragged)
const STANDARD_SHAPE_SIZE = 120;

export class ShapesToolHandler {
    static calculateShapePoints(
        shapeType: string,
        x: number,
        y: number,
        width: number,
        height: number
    ): Array<{ x: number; y: number }> {
        switch (shapeType) {
            case 'triangle':
                return [
                    { x: x + width / 2, y },
                    { x: x + width, y: y + height },
                    { x, y: y + height }
                ];
            case 'diamond':
                return [
                    { x: x + width / 2, y },
                    { x: x + width, y: y + height / 2 },
                    { x: x + width / 2, y: y + height },
                    { x, y: y + height / 2 }
                ];
            case 'hexagon':
                const quarterWidth = width / 4;
                return [
                    { x: x + quarterWidth, y },
                    { x: x + width - quarterWidth, y },
                    { x: x + width, y: y + height / 2 },
                    { x: x + width - quarterWidth, y: y + height },
                    { x: x + quarterWidth, y: y + height },
                    { x, y: y + height / 2 }
                ];
            case 'arrow':
                const arrowHeadSize = Math.min(width, height) * 0.2;
                return [
                    { x, y },
                    { x: x + width, y: y + height },
                    { x: x + width - arrowHeadSize, y: y + height - arrowHeadSize },
                    { x: x + width, y: y + height },
                    { x: x + width - arrowHeadSize, y: y + height + arrowHeadSize }
                ];
            default:
                return [];
        }
    }

    static createShape(
        shapeType: string,
        x: number,
        y: number,
        width: number,
        height: number,
        color: string = "#ffffff"
    ): RectangleShape | CircleShape | PolygonShape {
        const baseShape = {
            id: uuidv4(),
            x,
            y,
            width: Math.max(width, 0),
            height: Math.max(height, 0),
            fill: color.replace(/^#/, "rgba(") + ", 0.5)",
            stroke: color,
            strokeWidth: 2,
            isSelected: false
        };

        switch (shapeType) {
            case 'rectangle':
                return {
                    ...baseShape,
                    type: 'rectangle'
                };
            case 'circle':
                return {
                    ...baseShape,
                    type: 'circle'
                };
            default:
                return {
                    ...baseShape,
                    type: shapeType as 'triangle' | 'diamond' | 'hexagon' | 'arrow',
                    points: this.calculateShapePoints(shapeType, x, y, Math.max(width, 0), Math.max(height, 0))
                };
        }
    }

    static onMouseDown(e: React.MouseEvent, shapeType: string, state: ShapeToolState) {
        const { setIsDrawing, setStartPos, setCurrentShape, currentColor } = state;

        if (!setIsDrawing || !setStartPos || !setCurrentShape) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPos({ x, y });

        // Create initial shape with minimal size
        const initialShape = this.createShape(shapeType, x, y, 0, 0, currentColor);
        setCurrentShape(initialShape);
    }

    static onMouseMove(e: React.MouseEvent, shapeType: string, state: ShapeToolMoveState & { currentColor?: string }) {
        const { isDrawing, startPos, currentShape, setCurrentShape, currentColor } = state;

        if (!isDrawing || !startPos || !currentShape) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = Math.abs(currentX - startPos.x);
        const height = Math.abs(currentY - startPos.y);
        const x = Math.min(startPos.x, currentX);
        const y = Math.min(startPos.y, currentY);

        let updatedShape: Shape;

        if (shapeType === 'circle') {
            const size = Math.max(width, height);
            updatedShape = this.createShape(shapeType, startPos.x - size/2, startPos.y - size/2, size, size, currentColor);
        } else {
            updatedShape = this.createShape(shapeType, x, y, width, height, currentColor);
        }

        setCurrentShape(updatedShape);
    }

    static onMouseUp(e: React.MouseEvent, shapeType: string, state: ShapeToolUpState) {
        const { 
            isDrawing, 
            currentShape, 
            objects, 
            setObjects, 
            setIsDrawing,
            setStartPos,
            setCurrentShape,
            setActiveTool 
        } = state;

        if (!isDrawing || !currentShape || !isDrawableShape(currentShape)) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        let finalShape: Shape;

        // If the shape has no size, it means it was just a click (no drag)
        if (currentShape.width === 0 && currentShape.height === 0) {
            // Create a standard-sized shape centered on the click point
            finalShape = this.createShape(
                shapeType,
                currentShape.x - STANDARD_SHAPE_SIZE / 2,
                currentShape.y - STANDARD_SHAPE_SIZE / 2,
                STANDARD_SHAPE_SIZE,
                STANDARD_SHAPE_SIZE
            );
        } else {
            // Use the current shape as is (it was created by dragging)
            finalShape = currentShape;
        }

        setObjects([...objects, finalShape]);
        setIsDrawing(false);
        setStartPos(null);
        setCurrentShape(null);
        setActiveTool("move");
    }

    static selectShape(id: string, objects: WhiteboardObject[], setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>) {
        const updatedObjects = objects.map(obj => ({
            ...obj,
            isSelected: obj.id === id
        }));
        setObjects(updatedObjects);
    }

    static deselectAllShapes(objects: WhiteboardObject[], setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>) {
        const updatedObjects = objects.map(obj => ({
            ...obj,
            isSelected: false
        }));
        setObjects(updatedObjects);
    }

    static resizeShape(shapeId: string, newWidth: number, newHeight: number, state: ShapeSelectState) {
        const { objects, setObjects } = state;
        
        const updatedObjects = objects.map(obj => {
            if (obj.id !== shapeId || !isDrawableShape(obj)) return obj;
            
            const updatedObj = { ...obj, width: newWidth, height: newHeight };
            
            if (obj.type === 'circle') {
                return {
                    ...updatedObj,
                    type: 'circle'
                } as CircleShape;
            } else if (['triangle', 'diamond', 'hexagon', 'arrow'].includes(obj.type)) {
                return {
                    ...updatedObj,
                    type: obj.type as 'triangle' | 'diamond' | 'hexagon' | 'arrow',
                    points: this.calculateShapePoints(obj.type, obj.x, obj.y, newWidth, newHeight)
                } as PolygonShape;
            }
            
            return updatedObj;
        });
        
        setObjects(updatedObjects);
    }
}