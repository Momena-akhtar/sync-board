import React, { useState, useRef, useEffect } from "react";
import BottomPanel from "./BottomPanel";
import { WhiteboardObject, isShape, ImageObject } from "../Types/WhiteboardTypes";
import { TextToolHandler } from "../Handlers/Tools/TextToolHandler";
import { FrameToolHandler } from "../Handlers/Tools/FrameToolHandler";
import { PenToolHandler } from "../Handlers/Tools/PenToolHandler";
import { ShapesToolHandler } from "../Handlers/Tools/ShapesToolHandler";
import { EraserToolHandler } from "../Handlers/Tools/EraserToolHandler";
import { ImageToolHandler } from "../Handlers/Tools/ImageToolHandler";
import ShapeResizeHandles from "../Handlers/Tools/ShapeResizeHandler";

const MainBoard = () => {
  const [objects, setObjects] = useState<WhiteboardObject[]>([]);
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
    if (!['rectangle', 'circle', 'triangle', 'diamond', 'hexagon', 'arrow'].includes(activeTool)) {
      setCurrentShape(null);
      setIsDrawing(false);
      setStartPos(null);
    }
  }, [activeTool]);

  // Add effect to handle shape drawing completion
  useEffect(() => {
    if (isDrawing === false && currentShape === null && ['rectangle', 'circle', 'triangle', 'diamond', 'hexagon', 'arrow'].includes(activeTool)) {
      // Switch back to move tool after shape is drawn
      setActiveTool('move');
    }
  }, [isDrawing, currentShape, activeTool]);

  // Update PenToolHandler color when currentColor changes
  useEffect(() => {
    PenToolHandler.setPenColor(currentColor);
  }, [currentColor]);

  const handleShapeClick = (shapeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === "move") {
      ShapesToolHandler.selectShape(shapeId, objects, setObjects);
      setSelectedShapeId(shapeId);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === "move" && selectedShapeId) {
      ShapesToolHandler.deselectAllShapes(objects, setObjects);
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
          setObjects,
          setSelectedShapeId,
        });
      } else {
        // Use ShapesToolHandler for other shapes
        ShapesToolHandler.resizeShape(resizeData.id, newWidth, newHeight, {
          objects,
          setObjects,
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
        setObjects,
        setIsDrawing,
        setStartPos,
        setCurrentFrame,
      });
    } else if (activeTool === "text") {
      TextToolHandler.onMouseDown(e, { objects, setObjects });
    } else if (activeTool === "pen") {
      PenToolHandler.onMouseDown(e, {
        objects,
        setObjects,
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
        setObjects,
        setSelectedShapeId,
      });
      // Switch to move tool after initiating image upload
      setActiveTool("move");
    } else if (activeTool === "move") {
      // Handle image dragging start
      const imageElement = clickedElement.closest('[data-type="image-object"]');
      if (imageElement) {
        const imageId = imageElement.getAttribute('data-id');
        if (imageId) {
          ImageToolHandler.startDragging(imageId, e, {
            objects,
            setObjects,
            setSelectedShapeId,
          });
        }
      }
    } else if (
      ["rectangle", "circle", "triangle", "diamond", "hexagon", "arrow"].includes(
        activeTool
      )
    ) {
      ShapesToolHandler.onMouseDown(e, activeTool, {
        objects,
        setObjects,
        setIsDrawing,
        setStartPos,
        setCurrentShape,
        currentColor,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
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
        setObjects,
      });
    } else if (activeTool === "move") {
      // Handle image dragging
      const draggingImage = objects.find(obj => obj.type === 'image' && obj.isDragging);
      if (draggingImage) {
        ImageToolHandler.handleDrag(draggingImage.id, e, {
          objects,
          setObjects,
          setSelectedShapeId,
        });
      }
    } else if (
      ["rectangle", "circle", "triangle", "diamond", "hexagon", "arrow"].includes(
        activeTool
      )
    ) {
      ShapesToolHandler.onMouseMove(e, activeTool, {
        isDrawing,
        startPos,
        currentShape,
        setCurrentShape,
      });
    }
    if (isResizing) {
      handleResizeMove(e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (activeTool === "frame") {
      FrameToolHandler.onMouseUp(e, {
        isDrawing,
        currentFrame,
        objects,
        setObjects,
        setIsDrawing,
        setStartPos,
        setCurrentFrame,
      });
    } else if (activeTool === "pen") {
      PenToolHandler.onMouseUp(e, {
        isDrawing,
        currentStroke,
        objects,
        setObjects,
        setIsDrawing,
        setCurrentStroke,
      });
    } else if (activeTool === "eraser") {
      EraserToolHandler.onMouseUp(e, {
        setIsErasing,
      });
    } else if (activeTool === "move") {
      // Handle image drag end
      const draggingImage = objects.find(obj => obj.type === 'image' && obj.isDragging);
      if (draggingImage) {
        ImageToolHandler.stopDragging(draggingImage.id, {
          objects,
          setObjects,
          setSelectedShapeId,
        });
      }
    }
    // Handle shape drawing completion
    else if (
      ["rectangle", "circle", "triangle", "diamond", "hexagon", "arrow"].includes(
        activeTool
      )
    ) {
      ShapesToolHandler.onMouseUp(e, activeTool, {
        isDrawing,
        currentShape,
        objects,
        setObjects,
        setIsDrawing,
        setStartPos,
        setCurrentShape,
        setActiveTool,
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
    TextToolHandler.onChangeText(id, e.target.value, { objects, setObjects });
  };

  const handleTextBlur = (id: string) => {
    TextToolHandler.onFinishEditing(id, { objects, setObjects });
    setActiveTool("move");
  };

  const handleTextDoubleClick = (id: string, e: React.MouseEvent) => {
    // Prevent the event from bubbling up to the canvas
    e.stopPropagation();
    // Start editing the text object
    TextToolHandler.onStartEditing(id, { objects, setObjects });
  };
  const handleImageClick = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === "move") {
      ImageToolHandler.selectImage(imageId, {
        objects,
        setObjects,
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
            className="absolute"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              backgroundColor: shape.fill,
              border: `${shape.strokeWidth}px solid ${shape.stroke}`,
              cursor: activeTool === "move" ? "pointer" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          />
        );
      case "circle":
        return (
          <div
            key={shape.id}
            className="absolute rounded-full"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              backgroundColor: shape.fill,
              border: `${shape.strokeWidth}px solid ${shape.stroke}`,
              cursor: activeTool === "move" ? "pointer" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          />
        );
      case "triangle":
      case "diamond":
      case "hexagon":
      case "arrow":
        const pointsArray = shape.points || [];
        let svgPath = "";

        if (shape.type === "arrow" && pointsArray.length >= 2) {
          // Arrow needs special handling with arrowhead

          const [start, end] = pointsArray;
          // Calculate arrow direction
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const angle = Math.atan2(dy, dx);

          // Arrow line
          svgPath = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

          // Add arrowhead
          const arrowLength = 15;
          const arrowAngle = Math.PI / 6; // 30 degrees

          const x1 = end.x - arrowLength * Math.cos(angle - arrowAngle);
          const y1 = end.y - arrowLength * Math.sin(angle - arrowAngle);
          const x2 = end.x - arrowLength * Math.cos(angle + arrowAngle);
          const y2 = end.y - arrowLength * Math.sin(angle + arrowAngle);

          svgPath += ` M ${end.x} ${end.y} L ${x1} ${y1} M ${end.x} ${end.y} L ${x2} ${y2}`;
        } else if (pointsArray.length > 0) {
          // For other polygon shapes
          svgPath = `M ${pointsArray[0].x} ${pointsArray[0].y}`;
          for (let i = 1; i < pointsArray.length; i++) {
            svgPath += ` L ${pointsArray[i].x} ${pointsArray[i].y}`;
          }
          svgPath += " Z"; // Close the path
        }
        return (
          <div
            key={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              cursor: activeTool === "move" ? "pointer" : "default",
              zIndex: shape.isSelected ? 10 : 1,
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
          >
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", pointerEvents: "none" }}
            >
              <path
                d={svgPath}
                fill={shape.type === "arrow" ? "none" : shape.fill}
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
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      className="relative w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-rounded p-0 m-0"
    >
      {/* Checkerboard background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #000000 25%,rgb(27, 27, 27) 25%), linear-gradient(-45deg, #000000 25%, #808080 25%)",
          backgroundSize: "10px 10px",
        }}
      />
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
        .map(imageObj => (
          <div
            key={imageObj.id}
            data-type="image-object"
            data-id={imageObj.id}
            className={`absolute ${imageObj.isSelected && !imageObj.isDragging ? 'ring-2 ring-blue-500' : ''}`}
            style={{
              left: `${imageObj.x}px`,
              top: `${imageObj.y}px`,
              width: `${imageObj.width}px`,
              height: `${imageObj.height}px`,
              cursor: activeTool === "move" ? "move" : "default",
              zIndex: imageObj.isSelected ? 10 : 1,
              transform: imageObj.isDragging ? 'none' : undefined,
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
            {imageObj.isSelected && !imageObj.isDragging && activeTool === "move" && (
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
