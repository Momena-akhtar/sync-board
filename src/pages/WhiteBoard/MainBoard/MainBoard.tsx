import React, { useState, useRef, useEffect } from "react";
import BottomPanel from "./BottomPanel";
import {
  WhiteboardObject,
  isShape,
  ImageObject,
} from "../Types/WhiteboardTypes";
import { TextToolHandler } from "../Handlers/Tools/TextToolHandler";
import { FrameToolHandler } from "../Handlers/Tools/FrameToolHandler";
import { PenToolHandler } from "../Handlers/Tools/PenToolHandler";
import { ShapesToolHandler, isDrawableShape } from "../Handlers/Tools/ShapesToolHandler";
import { EraserToolHandler } from "../Handlers/Tools/EraserToolHandler";
import { ImageToolHandler } from "../Handlers/Tools/ImageToolHandler";
import ShapeResizeHandles from "../Handlers/Tools/ShapeResizeHandler";

interface MainBoardProps {
  objects: WhiteboardObject[];
  setObjects: (objects: WhiteboardObject[]) => void;
  currentPageIndex: number;
}

const MainBoard: React.FC<MainBoardProps> = ({ objects, setObjects, currentPageIndex }) => {
  // Wrap setObjects to make it compatible with React state setters
  const wrappedSetObjects: React.Dispatch<
    React.SetStateAction<WhiteboardObject[]>
  > = (value) => {
    if (typeof value === "function") {
      setObjects(value(objects));
    } else {
      setObjects(value);
    }
  };

  const [activeTool, setActiveTool] = useState<string>("move");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>("#ffffff");
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentFrame, setCurrentFrame] = useState<WhiteboardObject | null>(
    null
  );
  const [currentStroke, setCurrentStroke] = useState<WhiteboardObject | null>(
    null
  );
  const [currentShape, setCurrentShape] = useState<WhiteboardObject | null>(
    null
  );
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [resizeData, setResizeData] = useState<{
    id: string;
    handlePos: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  // Reference to any active text input
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );

  // Clear selection when switching pages
  useEffect(() => {
    console.log('Page changed to:', currentPageIndex);
    console.log('Objects in new page:', objects);
    setSelectedShapeId(null);
    setCurrentShape(null);
    setCurrentFrame(null);
    setCurrentStroke(null);
    setIsDrawing(false);
    setIsErasing(false);
    setIsResizing(false);
  }, [currentPageIndex, objects]);

  // Focus the text input when a new text object is created
  useEffect(() => {
    objects.forEach((obj) => {
      if (obj.type === "text" && (obj as any).isEditing) {
        const textarea = textareaRefs.current[obj.id];
        if (textarea) {
          // Reset height to get the correct scrollHeight
          textarea.style.height = "auto";
          // Set height to scrollHeight to fit content
          textarea.style.height = `${textarea.scrollHeight}px`;

          // Update width based on content
          textarea.style.width = "auto";
          // Add some padding to avoid scrollbars
          textarea.style.width = `${textarea.scrollWidth}px`;
        }
      }
    });
  }, [objects]);

  useEffect(() => {
    const editingTextObject = objects.find(
      (obj) => obj.type === "text" && (obj as any).isEditing
    );
    if (editingTextObject && textareaRefs.current[editingTextObject.id]) {
      textareaRefs.current[editingTextObject.id]?.focus();
    }
  }, [objects]);

  // Add cleanup effect when changing tools
  useEffect(() => {
    // Clean up any active shape drawing state when changing tools
    if (
      ![
        "rectangle",
        "circle",
        "triangle",
        "diamond",
        "hexagon",
        "arrow",
      ].includes(activeTool)
    ) {
      setCurrentShape(null);
      setIsDrawing(false);
      setStartPos(null);
    }
  }, [activeTool]);

  // Add effect to handle shape drawing completion
  useEffect(() => {
    if (
      isDrawing === false &&
      currentShape === null &&
      [
        "rectangle",
        "circle",
        "triangle",
        "diamond",
        "hexagon",
        "arrow",
      ].includes(activeTool)
    ) {
      console.log("Being called on line 140 MainBoard");
      // Switch back to move tool after shape is drawn
    }
  }, [isDrawing, currentShape, activeTool]);

  // Update PenToolHandler color when currentColor changes
  useEffect(() => {
    PenToolHandler.setPenColor(currentColor);
  }, [currentColor]);

  const handleShapeClick = (shapeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === "move") {
      ShapesToolHandler.selectShape(shapeId, objects, wrappedSetObjects);
      setSelectedShapeId(shapeId);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === "move" && selectedShapeId) {
      ShapesToolHandler.deselectAllShapes(objects, wrappedSetObjects);
      setSelectedShapeId(null);
    }
  };

  const handleResizeStart = (
    id: string,
    handlePos: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const objectToResize = objects.find((obj) => obj.id === id);
    if (objectToResize) {
      setIsResizing(true);
      setResizeData({
        id,
        handlePos,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: "width" in objectToResize ? objectToResize.width : 0,
        startHeight: "height" in objectToResize ? objectToResize.height : 0,
      });
    }
  };
  const handleResizeMove = (e: React.MouseEvent) => {
    if (!isResizing || !resizeData) return;

    const dx = e.clientX - resizeData.startX;
    const dy = e.clientY - resizeData.startY;

    let newWidth = resizeData.startWidth;
    let newHeight = resizeData.startHeight;

    // Adjust dimensions based on which handle is being dragged
    switch (resizeData.handlePos) {
      case "top-left":
        newWidth = resizeData.startWidth - dx;
        newHeight = resizeData.startHeight - dy;
        break;
      case "top-right":
        newWidth = resizeData.startWidth + dx;
        newHeight = resizeData.startHeight - dy;
        break;
      case "bottom-right":
        newWidth = resizeData.startWidth + dx;
        newHeight = resizeData.startHeight + dy;
        break;
      case "bottom-left":
        newWidth = resizeData.startWidth - dx;
        newHeight = resizeData.startHeight - dy;
        break;
    }

    // Apply minimum size constraints
    newWidth = Math.max(20, newWidth);
    newHeight = Math.max(20, newHeight);

    const objectToResize = objects.find((obj) => obj.id === resizeData.id);

    if (objectToResize) {
      if (objectToResize.type === "image") {
        // Use ImageToolHandler for image resizing
        ImageToolHandler.resizeImage(resizeData.id, newWidth, newHeight, {
          objects,
          setObjects: wrappedSetObjects,
          setSelectedShapeId,
        });
      } else {
        // Use ShapesToolHandler for other shapes
        ShapesToolHandler.resizeShape(resizeData.id, newWidth, newHeight, {
          objects,
          setObjects: wrappedSetObjects,
          setSelectedShapeId,
        });
      }
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeData(null);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('Mouse down on page', currentPageIndex);
    // Check if we clicked on an existing text object first
    const clickedElement = e.target as HTMLElement;
    const textBoxElement = clickedElement.closest('[data-type="text-object"]');
    handleCanvasClick(e);
    if (textBoxElement) {
      // If we clicked on a text object, don't create a new one
      return;
    }

    if (activeTool === "frame") {
      FrameToolHandler.onMouseDown(e, {
        objects,
        setObjects: wrappedSetObjects,
        setIsDrawing,
        setStartPos,
        setCurrentFrame,
      });
    } else if (activeTool === "text") {
      TextToolHandler.onMouseDown(e, {
        objects,
        setObjects: wrappedSetObjects,
      });
    } else if (activeTool === "pen") {
      PenToolHandler.onMouseDown(e, {
        objects,
        setObjects: wrappedSetObjects,
        setIsDrawing,
        setCurrentStroke,
      });
    } else if (activeTool === "eraser") {
      EraserToolHandler.onMouseDown(e, {
        setIsErasing,
      });
    } else if (activeTool === "Image") {
      ImageToolHandler.onActivate(e, {
        objects,
        setObjects: wrappedSetObjects,
        setSelectedShapeId,
      });
      // Switch to move tool after initiating image upload
      setActiveTool("move");
    } else if (activeTool === "move") {
      // Handle image dragging start
      const imageElement = clickedElement.closest('[data-type="image-object"]');
      if (imageElement) {
        const imageId = imageElement.getAttribute("data-id");
        if (imageId) {
          ImageToolHandler.startDragging(imageId, e, {
            objects,
            setObjects: wrappedSetObjects,
            setSelectedShapeId,
          });
        }
      }
      // Handle shape dragging start
      const shapeElement = clickedElement.closest('[data-type="shape-object"]');
      if (shapeElement) {
        const shapeId = shapeElement.getAttribute("data-id");
        if (shapeId) {
          ShapesToolHandler.startDragging(shapeId, e, {
            objects,
            setObjects: wrappedSetObjects,
            setSelectedShapeId,
          });
        }
      }
    } else if (
      [
        "rectangle",
        "circle",
        "triangle",
        "diamond",
        "hexagon",
        "arrow",
      ].includes(activeTool)
    ) {
      ShapesToolHandler.onMouseDown(e, activeTool, {
        objects,
        setObjects: wrappedSetObjects,
        setIsDrawing,
        setStartPos,
        setCurrentShape,
        currentColor,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    console.log('Mouse move on page', currentPageIndex);
    if (activeTool === "frame") {
      FrameToolHandler.onMouseMove(e, {
        isDrawing,
        startPos,
        currentFrame,
        setCurrentFrame,
      });
    } else if (activeTool === "pen") {
      PenToolHandler.onMouseMove(e, {
        isDrawing,
        currentStroke,
        setCurrentStroke,
      });
    } else if (activeTool === "eraser") {
      EraserToolHandler.onMouseMove(e, {
        isErasing,
        objects,
        setObjects: wrappedSetObjects,
      });
    } else if (activeTool === "move") {
      // Handle image dragging
      const draggingImage = objects.find(
        (obj) => obj.type === "image" && obj.isDragging
      );
      if (draggingImage) {
        ImageToolHandler.handleDrag(draggingImage.id, e, {
          objects,
          setObjects: wrappedSetObjects,
          setSelectedShapeId,
        });
      }
      // Handle shape dragging
      const draggingShape = objects.find(
        (obj) => isDrawableShape(obj) && obj.isDragging
      );
      if (draggingShape) {
        ShapesToolHandler.handleDrag(draggingShape.id, e, {
          objects,
          setObjects: wrappedSetObjects,
          setSelectedShapeId,
        });
      }
    } else if (
      [
        "rectangle",
        "circle",
        "triangle",
        "diamond",
        "hexagon",
        "arrow",
      ].includes(activeTool)
    ) {
      ShapesToolHandler.onMouseMove(e, activeTool, {
        isDrawing,
        startPos,
        currentShape,
        setCurrentShape,
        currentColor,
      });
    }
    if (isResizing) {
      handleResizeMove(e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    console.log('Mouse up on page', currentPageIndex);
    if (activeTool === "frame") {
      FrameToolHandler.onMouseUp(e, {
        isDrawing,
        currentFrame,
        objects,
        setObjects: wrappedSetObjects,
        setIsDrawing,
        setStartPos,
        setCurrentFrame,
      });
    } else if (activeTool === "pen") {
      PenToolHandler.onMouseUp(e, {
        isDrawing,
        currentStroke,
        objects,
        setObjects: wrappedSetObjects,
        setIsDrawing,
        setCurrentStroke,
      });
    } else if (activeTool === "eraser") {
      EraserToolHandler.onMouseUp(e, {
        setIsErasing,
      });
    } else if (activeTool === "move") {
      // Handle image drag end
      const draggingImage = objects.find(
        (obj) => obj.type === "image" && obj.isDragging
      );
      if (draggingImage) {
        ImageToolHandler.stopDragging(draggingImage.id, {
          objects,
          setObjects: wrappedSetObjects,
          setSelectedShapeId,
        });
      }
      // Handle shape drag end
      const draggingShape = objects.find(
        (obj) => isDrawableShape(obj) && obj.isDragging
      );
      if (draggingShape) {
        ShapesToolHandler.stopDragging(draggingShape.id, {
          objects,
          setObjects: wrappedSetObjects,
          setSelectedShapeId,
        });
      }
    }
    // Handle shape drawing completion
    else if (
      [
        "rectangle",
        "circle",
        "triangle",
        "diamond",
        "hexagon",
        "arrow",
      ].includes(activeTool)
    ) {
      ShapesToolHandler.onMouseUp(e, activeTool, {
        isDrawing,
        currentShape,
        objects,
        setObjects: wrappedSetObjects,
        setIsDrawing,
        setStartPos,
        setCurrentShape,
        setActiveTool,
        currentColor,
      });
    }
    // Handle shape resize completion
    else if (isResizing) {
      setIsResizing(false);
      setResizeData(null);
    }
    if (isResizing) {
      handleResizeEnd();
    }
  };

  const handleTextChange = (
    id: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    TextToolHandler.onChangeText(id, e.target.value, {
      objects,
      setObjects: wrappedSetObjects,
    });
  };

  const handleTextBlur = (id: string) => {
    TextToolHandler.onFinishEditing(id, {
      objects,
      setObjects: wrappedSetObjects,
    });
    setActiveTool("move");
  };

  const handleTextDoubleClick = (id: string, e: React.MouseEvent) => {
    // Prevent the event from bubbling up to the canvas
    e.stopPropagation();
    // Start editing the text object
    TextToolHandler.onStartEditing(id, {
      objects,
      setObjects: wrappedSetObjects,
    });
  };
  const handleImageClick = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === "move") {
      ImageToolHandler.selectImage(imageId, {
        objects,
        setObjects: wrappedSetObjects,
        setSelectedShapeId,
      });
    }
  };

  // Filter objects for rendering
  const frameObjects = objects.filter((obj) => obj.type === "frame");
  const textObjects = objects.filter((obj) => obj.type === "text");
  const penStrokeObjects = objects.filter((obj) => obj.type === "pen-stroke");

  // Helper function to draw SVG path from pen stroke points
  const createSVGPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };
  const renderShape = (shape: WhiteboardObject) => {
    switch (shape.type) {
      case "rectangle":
        return (
          <div
            key={shape.id}
            data-type="shape-object"
            data-id={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              backgroundColor: shape.fill,
              border: `${shape.strokeWidth}px solid ${shape.stroke}`,
              cursor: activeTool === "move" ? "move" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          />
        );
      case "circle":
        return (
          <div
            key={shape.id}
            data-type="shape-object"
            data-id={shape.id}
            className="absolute rounded-full"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              backgroundColor: shape.fill,
              border: `${shape.strokeWidth}px solid ${shape.stroke}`,
              cursor: activeTool === "move" ? "move" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          />
        );
      case "triangle":
        // Calculate points for triangle
        // Using an equilateral triangle centered in the shape's bounding box
        const trianglePoints = [
          `${shape.width / 2},0`, // top point
          `${shape.width},${shape.height}`, // bottom right
          `0,${shape.height}`, // bottom left
        ].join(" ");

        return (
          <div
            key={shape.id}
            data-type="shape-object"
            data-id={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              cursor: activeTool === "move" ? "move" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <polygon
                points={trianglePoints}
                fill={shape.fill}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
              />
            </svg>
          </div>
        );
      case "diamond":
        return (
          <div
            key={shape.id}
            data-type="shape-object"
            data-id={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              backgroundColor: shape.fill,
              border: `${shape.strokeWidth}px solid ${shape.stroke}`,
              transform: "rotate(45deg)",
              transformOrigin: "center center",
              cursor: activeTool === "move" ? "move" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          />
        );
      case "hexagon":
        // Calculate points for hexagon
        const halfWidth = shape.width / 2;
        const halfHeight = shape.height / 2;

        // Create points for hexagon
        const points = [
          `${halfWidth * 0.5},0`, // top-left
          `${halfWidth * 1.5},0`, // top-right
          `${shape.width},${halfHeight}`, // right
          `${halfWidth * 1.5},${shape.height}`, // bottom-right
          `${halfWidth * 0.5},${shape.height}`, // bottom-left
          `0,${halfHeight}`, // left
        ].join(" ");

        return (
          <div
            key={shape.id}
            data-type="shape-object"
            data-id={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              cursor: activeTool === "move" ? "move" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <polygon
                points={points}
                fill={shape.fill}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
              />
            </svg>
          </div>
        );
      case "arrow":
        // Calculate dimensions for the arrow
        const arrowWidth = shape.width;
        const arrowHeight = shape.height;
        const headWidth = Math.min(arrowHeight, arrowWidth * 0.3); // Arrow head width is 30% of total width
        const shaftHeight = arrowHeight * 0.4; // Shaft height is 40% of total height

        // Define arrow points for a right-pointing arrow
        const arrowPoints = [
          `0,${(arrowHeight - shaftHeight) / 2}`, // Left of shaft, top
          `${arrowWidth - headWidth},${(arrowHeight - shaftHeight) / 2}`, // Right of shaft, top
          `${arrowWidth - headWidth},0`, // Bottom of arrow head
          `${arrowWidth},${arrowHeight / 2}`, // Arrow tip
          `${arrowWidth - headWidth},${arrowHeight}`, // Top of arrow head
          `${arrowWidth - headWidth},${(arrowHeight + shaftHeight) / 2}`, // Right of shaft, bottom
          `0,${(arrowHeight + shaftHeight) / 2}`, // Left of shaft, bottom
        ].join(" ");

        return (
          <div
            key={shape.id}
            data-type="shape-object"
            data-id={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              cursor: activeTool === "move" ? "move" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <polygon
                points={arrowPoints}
                fill={shape.fill}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log("--------------------");
    console.log("This is the objects:\n", JSON.stringify(objects, null, 2));
    console.log(`This is the currentShape : ${currentShape}`);
  }, [objects, currentShape]);

  useEffect(() => {
    console.log("***************");
    console.log(`This is the active tool : ${activeTool}`);
  }, [activeTool]);
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      className="whiteboard-content relative w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-rounded p-0 m-0"
    >
      {/* Checkerboard background */}
      <div className="absolute inset-0" />
      {/* Render all shape objects */}
      {objects
        .filter((obj) =>
          [
            "rectangle",
            "circle",
            "triangle",
            "diamond",
            "hexagon",
            "arrow",
          ].includes(obj.type)
        )
        .map((shape) => renderShape(shape))}

      {/* Current shape being drawn */}
      {currentShape && isShape(currentShape) && renderShape(currentShape)}

      {/* Resize handles for selected shape */}
      {selectedShapeId &&
        activeTool === "move" &&
        (() => {
          const selectedShape = objects.find(
            (obj) => obj.id === selectedShapeId
          );
          if (!selectedShape) return null;

          return (
            <ShapeResizeHandles
              id={selectedShape.id}
              x={"x" in selectedShape ? selectedShape.x : 0}
              y={"y" in selectedShape ? selectedShape.y : 0}
              width={"width" in selectedShape ? selectedShape.width : 0}
              height={"height" in selectedShape ? selectedShape.height : 0}
              onResize={handleResizeStart}
            />
          );
        })()}
      {/* Render images */}
      {objects
        .filter((obj): obj is ImageObject => obj.type === "image")
        .map((imageObj) => (
          <div
            key={imageObj.id}
            data-type="image-object"
            data-id={imageObj.id}
            className={`absolute ${
              imageObj.isSelected && !imageObj.isDragging
                ? "ring-2 ring-blue-500"
                : ""
            }`}
            style={{
              left: `${imageObj.x}px`,
              top: `${imageObj.y}px`,
              width: `${imageObj.width}px`,
              height: `${imageObj.height}px`,
              cursor: activeTool === "move" ? "move" : "default",
              zIndex: imageObj.isSelected ? 10 : 1,
              transform: imageObj.isDragging ? "none" : undefined,
            }}
            onClick={(e) => handleImageClick(imageObj.id, e)}
          >
            <img
              src={imageObj.src}
              alt={imageObj.alt || "Whiteboard image"}
              className="w-full h-full object-contain select-none"
              draggable={false}
              style={{
                pointerEvents: activeTool === "move" ? "auto" : "none",
              }}
            />

            {/* Resize handles for selected images - hide during drag */}
            {imageObj.isSelected &&
              !imageObj.isDragging &&
              activeTool === "move" && (
                <ShapeResizeHandles
                  id={imageObj.id}
                  x={imageObj.x}
                  y={imageObj.y}
                  width={imageObj.width}
                  height={imageObj.height}
                  onResize={handleResizeStart}
                />
              )}
          </div>
        ))}
      {/* Existing frames */}
      {frameObjects.map((frame) => (
        <div
          key={frame.id}
          className="absolute border-2 border-blue-500 bg-blue-100 opacity-50"
          style={{
            left: `${frame.x}px`,
            top: `${frame.y}px`,
            width: `${frame.width}px`,
            height: `${frame.height}px`,
          }}
        />
      ))}

      {/* Current drawing frame */}
      {currentFrame && currentFrame.type === "frame" && (
        <div
          className="absolute border-2 border-blue-400 bg-blue-200 opacity-30"
          style={{
            left: `${currentFrame.x}px`,
            top: `${currentFrame.y}px`,
            width: `${currentFrame.width}px`,
            height: `${currentFrame.height}px`,
          }}
        />
      )}

      {/* SVG for pen strokes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Existing pen strokes */}
        {penStrokeObjects.map((stroke) => {
          if (stroke.type !== "pen-stroke") return null;
          return (
            <path
              key={stroke.id}
              d={createSVGPath(stroke.points)}
              stroke={stroke.color}
              strokeWidth={stroke.strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Current drawing stroke */}
        {currentStroke && currentStroke.type === "pen-stroke" && (
          <path
            d={createSVGPath(currentStroke.points)}
            stroke={currentStroke.color}
            strokeWidth={currentStroke.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Text objects */}
      {textObjects.map((textObj) => {
        const isEditing = "isEditing" in textObj && textObj.isEditing;
        const content = "content" in textObj ? textObj.content : "";

        return (
          <div
            key={textObj.id}
            data-type="text-object"
            data-id={textObj.id}
            className="absolute"
            style={{
              left: `${textObj.x}px`,
              top: `${textObj.y}px`,
              minWidth: `${textObj.width}px`,
              minHeight: `${textObj.height}px`,
            }}
            onDoubleClick={(e) => handleTextDoubleClick(textObj.id, e)}
          >
            {isEditing ? (
              <textarea
                ref={textInputRef}
                value={content}
                onChange={(e) => handleTextChange(textObj.id, e)}
                onBlur={() => handleTextBlur(textObj.id)}
                className="p-2 rounded-lg border border-blue-300 bg-[#1e1e1e] text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{
                  width: `${textObj.width}px`,
                  height: `${textObj.height}px`,
                }}
                placeholder="Type here..."
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="p-2 rounded-lg bg-[#1e1e1e] shadow-sm border border-white text-white font-inherit"
                onClick={(e) => e.stopPropagation()}
              >
                {content || "Double-click to edit"}
              </div>
            )}
          </div>
        );
      })}
      {isLoading && (
        <div className="fixed top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading image...
        </div>
      )}
      <div className="fixed bottom-8 left-0 w-full flex justify-center">
        <BottomPanel
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />
      </div>
    </div>
  );
};

export default MainBoard;