import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject } from '../../Types/WhiteboardTypes';

interface ShapeToolState {
    objects: WhiteboardObject[];
    setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
    setIsDrawing?: React.Dispatch<React.SetStateAction<boolean>>;
    setStartPos?: React.Dispatch<React.SetStateAction<{ x: number, y: number } | null>>;
    setCurrentShape?: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
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
    setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
    setStartPos: React.Dispatch<React.SetStateAction<{ x: number, y: number } | null>>;
    setCurrentShape: React.Dispatch<React.SetStateAction<WhiteboardObject | null>>;
}

interface ShapeSelectState {
    objects: WhiteboardObject[];
    setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
    setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Standard size for shapes when simply clicked (not dragged)
const STANDARD_SHAPE_SIZE = 120;

export class ShapesToolHandler {
    static onMouseDown(e: React.MouseEvent, shapeType: string, state: ShapeToolState) {
        const { objects, setObjects, setIsDrawing, setStartPos, setCurrentShape } = state;

        // Get the position relative to the canvas
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (setIsDrawing && setStartPos && setCurrentShape) {
            // Start drawing
            setIsDrawing(true);
            setStartPos({ x, y });

            // Default shape fill and stroke
            const fill = "rgba(255, 255, 255, 0.5)"; // Semi-transparent white
            const stroke = "#ffffff"; // White border

            // Create initial shape with standard size
            const newShape: WhiteboardObject = {
                id: uuidv4(),
                type: shapeType as any,
                x: x - STANDARD_SHAPE_SIZE / 2, // Center at click position
                y: y - STANDARD_SHAPE_SIZE / 2,
                width: STANDARD_SHAPE_SIZE,
                height: STANDARD_SHAPE_SIZE,
                fill,
                stroke,
                strokeWidth: 2,
                isSelected: true
            };

            // Add shape-specific properties
            if (shapeType === 'circle') {
                (newShape as any).radius = STANDARD_SHAPE_SIZE / 2;
            } else if (shapeType === 'triangle' || shapeType === 'diamond' || shapeType === 'hexagon' ||  shapeType === 'arrow') {
                (newShape as any).points = this.calculateShapePoints(
                    shapeType, 
                    x - STANDARD_SHAPE_SIZE / 2, 
                    y - STANDARD_SHAPE_SIZE / 2, 
                    STANDARD_SHAPE_SIZE, 
                    STANDARD_SHAPE_SIZE
                );
            }
            
            setCurrentShape(newShape);
        } else {
            // Direct placement without drag (for single click)
            const fill = "rgba(255, 255, 255, 0.5)"; // Semi-transparent white
            const stroke = "#ffffff"; // White border

            // Create shape with standard size
            const newShape: WhiteboardObject = {
                id: uuidv4(),
                type: shapeType as any,
                x: x - STANDARD_SHAPE_SIZE / 2, // Center at click position
                y: y - STANDARD_SHAPE_SIZE / 2,
                width: STANDARD_SHAPE_SIZE,
                height: STANDARD_SHAPE_SIZE,
                fill,
                stroke,
                strokeWidth: 2,
                isSelected: true
            };

            // Add shape-specific properties
            if (shapeType === 'circle') {
                (newShape as any).radius = STANDARD_SHAPE_SIZE / 2;
            } else if (shapeType === 'triangle' || shapeType === 'diamond' || shapeType === 'hexagon') {
                (newShape as any).points = this.calculateShapePoints(
                    shapeType, 
                    x - STANDARD_SHAPE_SIZE / 2, 
                    y - STANDARD_SHAPE_SIZE / 2, 
                    STANDARD_SHAPE_SIZE, 
                    STANDARD_SHAPE_SIZE
                );
            }

            // Deselect all other shapes first
            const updatedObjects = objects.map(obj => ({
                ...obj,
                isSelected: false
            }));

            // Add the new shape
            setObjects([...updatedObjects, newShape]);
        }
    }

    static onMouseMove(e: React.MouseEvent, shapeType: string, state: ShapeToolMoveState) {
        const { isDrawing, startPos, currentShape, setCurrentShape } = state;

        if (!isDrawing || !startPos || !currentShape) return;

        // Get the current position
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Calculate dimensions
        const width = Math.abs(currentX - startPos.x);
        const height = Math.abs(currentY - startPos.y);
        
        // Determine top-left corner (important for negative dimensions)
        const x = Math.min(startPos.x, currentX);
        const y = Math.min(startPos.y, currentY);

        // Update shape based on type
        if (shapeType === 'circle') {
            // For circle, we'll ensure it remains circular
            const size = Math.max(width, height);
            setCurrentShape({
                ...currentShape,
                x: startPos.x - size/2,
                y: startPos.y - size/2,
                width: size,
                height: size,
                radius: size/2
            } as WhiteboardObject & { type: 'circle'; radius: number });
        } else if (shapeType === 'diamond' || shapeType === 'triangle' || shapeType === 'hexagon' ||  shapeType === 'arrow') {
            // For polygon shapes, we'll store points array
            setCurrentShape({
                ...currentShape,
                x,
                y,
                width,
                height,
                points: this.calculateShapePoints(shapeType, x, y, width, height)
            } as WhiteboardObject & { type: 'triangle' | 'diamond' | 'hexagon' | 'arrow'; points: Array<{ x: number; y: number }> });
        } else if (
            currentShape.type === 'rectangle' ||
            currentShape.type === 'circle' ||
            currentShape.type === 'triangle' ||
            currentShape.type === 'diamond' ||
            currentShape.type === 'hexagon'
          ){ 
            // Rectangle and other shapes
            setCurrentShape({
                ...currentShape,
                x,
                y,
                width,
                height
            });
        }
    }

    static onMouseUp(e: React.MouseEvent, shapeType: string, state: ShapeToolUpState) {
        const { isDrawing, currentShape, objects, setObjects, setIsDrawing, setStartPos, setCurrentShape } = state;

        if (!isDrawing || !currentShape) return;

        // Minimum size check - if too small, use standard size
        if (
            (currentShape.type === 'rectangle' ||
             currentShape.type === 'circle' ||
             currentShape.type === 'triangle' ||
             currentShape.type === 'diamond' ||
             currentShape.type === 'hexagon') &&
            (currentShape.width < 20 || currentShape.height < 20)
          ) {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const updatedShape = {
                ...currentShape,
                x: x - STANDARD_SHAPE_SIZE / 2,
                y: y - STANDARD_SHAPE_SIZE / 2,
                width: STANDARD_SHAPE_SIZE,
                height: STANDARD_SHAPE_SIZE
            };
            
            if (shapeType === 'circle') {
                (updatedShape as any).radius = STANDARD_SHAPE_SIZE / 2;
            } else if (shapeType === 'triangle' || shapeType === 'diamond' || shapeType === 'hexagon') {
                (updatedShape as any).points = this.calculateShapePoints(
                    shapeType,
                    x - STANDARD_SHAPE_SIZE / 2,
                    y - STANDARD_SHAPE_SIZE / 2,
                    STANDARD_SHAPE_SIZE,
                    STANDARD_SHAPE_SIZE
                );
            }
            
            // Deselect all other shapes first
            const updatedObjects = objects.map(obj => ({
                ...obj,
                isSelected: false
            }));
            
            // Add the shape to objects array
            setObjects([...updatedObjects, updatedShape]);
        } else {
            // Deselect all other shapes first
            const updatedObjects = objects.map(obj => ({
                ...obj,
                isSelected: false
            }));
            
            // Add the shape to objects array with isSelected true
            setObjects([...updatedObjects, {...currentShape, isSelected: true}]);
        }

        // Reset drawing state
        setIsDrawing(false);
        setStartPos(null);
        setCurrentShape(null);
    }

    static selectShape(shapeId: string, state: ShapeSelectState) {
        const { objects, setObjects, setSelectedShapeId } = state;
        
        // Update selection state
        const updatedObjects = objects.map(obj => ({
            ...obj,
            isSelected: obj.id === shapeId
        }));
        
        setObjects(updatedObjects);
        setSelectedShapeId(shapeId);
    }

    static deselectAllShapes(state: ShapeSelectState) {
        const { objects, setObjects, setSelectedShapeId } = state;
        
        // Deselect all shapes
        const updatedObjects = objects.map(obj => ({
            ...obj,
            isSelected: false
        }));
        
        setObjects(updatedObjects);
        setSelectedShapeId(null);
    }

    static resizeShape(shapeId: string, newWidth: number, newHeight: number, state: ShapeSelectState) {
        const { objects, setObjects } = state;
        
        const updatedObjects = objects.map(obj => {
            if (obj.id !== shapeId) return obj;
            
            const updatedObj = { ...obj, width: newWidth, height: newHeight };
            
            // Update shape-specific properties
            if (obj.type === 'circle') {
                (updatedObj as any).radius = newWidth / 2;
            } else if (obj.type === 'triangle' || obj.type === 'diamond' || obj.type === 'hexagon' || obj.type === 'arrow') {
                (updatedObj as any).points = this.calculateShapePoints(
                    obj.type,
                    obj.x,
                    obj.y,
                    newWidth,
                    newHeight
                );
            }
            
            return updatedObj;
        });
        
        setObjects(updatedObjects);
    }

    static calculateShapePoints(shapeType: string, x: number, y: number, width: number, height: number): Array<{x: number, y: number}> {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        if (shapeType === 'triangle') {
            return [
                { x: centerX, y },
                { x: x + width, y: y + height },
                { x, y: y + height }
            ];
        }
        
        if (shapeType === 'diamond') {
            return [
                { x: centerX, y },
                { x: x + width, y: centerY },
                { x: centerX, y: y + height },
                { x, y: centerY }
            ];
        }
        
        if (shapeType === 'hexagon') {
            const sixth = width / 4;
            return [
                { x: x + sixth, y },
                { x: x + width - sixth, y },
                { x: x + width, y: centerY },
                { x: x + width - sixth, y: y + height },
                { x: x + sixth, y: y + height },
                { x, y: centerY }
            ];
        }
        if (shapeType === 'arrow') {
            // Arrow is represented as a line with start and end points
            return [
                { x: x, y: y },               // Start point (top-left)
                { x: x + width, y: y + height } // End point (bottom-right)
            ];
        }
        
        
        return [];
    }
}