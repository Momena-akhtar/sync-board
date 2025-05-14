export interface socketJoinedBoardPayload {
    boardId: string;
    userEmail: any;
    userId: any;
  }
  interface UpdatedBoardPageInput {
    pageNumber: number;
    whiteBoardObjects: any; // You can be more specific here if you know the exact structure
  
    [key: string]: any; // allows other optional fields
  }
  
  export interface onDrawDataInput {
    boardId: string;
    updatedBoardPage: UpdatedBoardPageInput;
  
    [key: string]: any; // allows additional optional properties of any type
  }