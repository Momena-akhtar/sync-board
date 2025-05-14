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
export { handleBoardJoin, emitDraw };