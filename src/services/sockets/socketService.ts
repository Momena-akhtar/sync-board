import { getSocket } from "./socket";
import type { socketJoinedBoardPayload, onDrawDataInput } from "./socketTypes";
const handleBoardJoin = (boardId: string): Promise<void> => {
  console.log("handlejoin called");
  const socket = getSocket();

  if (!socket) {
    return Promise.reject(new Error("Socket connection not available"));
  }

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.off("joinedBoard", handleJoin);
      reject(new Error("Timed out waiting for joinedBoard event"));
    }, 5000);

    const handleJoin = (payload: socketJoinedBoardPayload) => {
      if (payload.boardId === boardId) {
        clearTimeout(timeout);
        socket.off("joinedBoard", handleJoin);
        console.log("Successfully joined Board");
        resolve();
      }
    };

    socket.on("joinedBoard", handleJoin);
    socket.emit("joinBoard", boardId);
  });
};

const emitDraw = (drawingData: onDrawDataInput) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket not available to emit draw event");
    return;
  }

  socket.emit("draw", drawingData);
};

export const handleDrawReceive = (onDraw: (data: any) => void) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket connection not available for draw event.");
    return;
  }

  const drawListener = (data: any) => {
    console.log("[Draw Event Received]:", data);
    onDraw(data); // Pass the data to your component
  };

  socket.on("newDrawing", drawListener);

  // Cleanup listener
  return () => {
    socket.off("newDrawing", drawListener);
  };
};

/**
 * 
 * Place the following useEffect where u will be drawing data and listening for newData
 * the data coming in will have the data sent by user along with his id and email
 * Only update if data coming in is new comoared to urs 
 * only send the page data 
 * compare ur page with it 
 * 
 * 
 * useEffect(() => {
    const cleanup = handleDrawReceive((drawingData) => {
      // This runs whenever "newDrawing" event is received
      console.log("Drawing data:", drawingData);

      // Handle the drawing (e.g., update canvas or state)
      drawToCanvas(drawingData);
    });

    // Return cleanup function to remove listener when component unmounts
    return cleanup;
  }, []); // [] means this effect runs only once (on mount)
 */

const emitErase = (eraseData: onDrawDataInput) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket not available to emit erase event");
    return;
  }

  socket.emit("erase", eraseData);
};

const handleEraseReceive = (onErase: (data: any) => void) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket connection not available for erase event.");
    return;
  }

  const eraseListener = (data: any) => {
    console.log("[Erase Event Received]:", data);
    onErase(data); // Pass the data to your component
  };

  socket.on("erased", eraseListener);

  // Cleanup listener
  return () => {
    socket.off("erased", eraseListener);
  };
};

const emitEditShape = (editData: onDrawDataInput) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket not available to emit editShape event");
    return;
  }

  socket.emit("editShape", editData);
};

const handleEditShapeReceive = (onEdit: (data: any) => void) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket connection not available for editShape event.");
    return;
  }

  const editListener = (data: any) => {
    console.log("[Edit Shape Event Received]:", data);
    onEdit(data); // Pass the data to your component
  };

  socket.on("editedShape", editListener);

  // Cleanup listener
  return () => {
    socket.off("editedShape", editListener);
  };
};

const emitAddText = (textData: onDrawDataInput) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket not available to emit addText event");
    return;
  }

  socket.emit("addText", textData);
};

const handleAddTextReceive = (onTextAdd: (data: any) => void) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket connection not available for addText event.");
    return;
  }

  const textListener = (data: any) => {
    console.log("[Add Text Event Received]:", data);
    onTextAdd(data); // Pass the data to your component
  };

  socket.on("addedText", textListener);

  // Cleanup listener
  return () => {
    socket.off("addedText", textListener);
  };
};

const emitBackspaceText = (textData: onDrawDataInput) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket not available to emit backspaceText event");
    return;
  }

  socket.emit("backspaceText", textData);
};
const handleBackspaceTextReceive = (onTextBackspace: (data: any) => void) => {
  const socket = getSocket();

  if (!socket) {
    console.error("Socket connection not available for backspaceText event.");
    return;
  }

  const backspaceListener = (data: any) => {
    console.log("[Backspace Text Event Received]:", data);
    onTextBackspace(data); // Send data to your component handler
  };

  socket.on("backspacedText", backspaceListener);

  // Cleanup listener
  return () => {
    socket.off("backspacedText", backspaceListener);
  };
};

export {
  handleBoardJoin,
  emitDraw,
  emitEditShape,
  emitErase,
  handleEditShapeReceive,
  handleEraseReceive,
  emitAddText,
  emitBackspaceText,
  handleAddTextReceive,
  handleBackspaceTextReceive,
};
