import SidePanel from "./SidePanel";
import MainBoard from "./MainBoard/MainBoard";
import Features from "./Features";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Page, WhiteboardObject } from "./Types/WhiteboardTypes";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import boardService from "../../services/boardService";
import { Board , Collaborator, User} from "../../services/boardService";

const WhiteBoard = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState<Board | null>(null);
    const [title, setTitle] = useState("Untitled");
    const [createdBy, setCreatedBy] = useState<User | null>(null);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [sidePanelVisible, setSidePanelVisible] = useState(true);
    const [featuresPanelVisible, setFeaturesPanelVisible] = useState(true);
    const [pages, setPages] = useState<Page[]>([{
      id: uuidv4(),
      name: "Page 1",
      pageNumber: 1,
      objects: [],
      backgroundColor: "#1E1E1E"
    }]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    
    useEffect(() => {
      const fetchBoard = async () => {
        try {
          if (!id) return;
          setLoading(true);
          const response = await boardService.getBoard(id);
          console.log('Fetched board:', response);
          setBoard(response);
          setTitle(response.name);
          
          // Handle createdBy user
          if (response.createdBy && typeof response.createdBy === 'object') {
            setCreatedBy(response.createdBy as User);
          } else {
            setCreatedBy(null);
          }

          // Handle collaborators
          const formattedCollaborators = response.collaborators?.map(collab => ({
            _id: collab.user,
            permission: collab.permission,
            user: {
              _id: collab.user,
              email: '',
              username: '',
              authProvider: ''
            }
          })) || [];
          setCollaborators(formattedCollaborators);

          // Transform the pages from the database into our Page type
          const transformedPages = response.pages.map((page: any, index: number) => ({
            id: page.id,
            name: page.name,
            pageNumber: index + 1,
            objects: page.objects.map((obj: any) => ({
              ...obj,
              // Ensure all required properties are present
              isDragging: false,
              isSelected: false,
              // Add any missing properties with default values
              strokeWidth: obj.strokeWidth || 2,
              stroke: obj.stroke || obj.fill || '#000000',
              fill: obj.fill || 'transparent'
            })),
            backgroundColor: page.backgroundColor || "#1E1E1E"
          }));

          setPages(transformedPages);
          setCurrentPageIndex(0);
        } catch (error) {
          console.error('Error fetching board:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBoard();
    }, [id]);

    // Add effect to log whiteboard state changes
    useEffect(() => {
      console.log('Whiteboard State Update:');
      console.log('Title:', title);
      console.log('Current Page Index:', currentPageIndex);
      console.log('Total Pages:', pages.length);
      console.log('All Pages:', pages);
      console.log('Current Page:', pages[currentPageIndex]);
    }, [title, currentPageIndex, pages]);

    const addNewPage = () => {
      console.log('Adding new page to whiteboard. Current state:', {
        title,
        totalPages: pages.length,
        pages
      });
      setPages(prevPages => {
        const newPages = [...prevPages, {
          id: uuidv4(),
          name: `Page ${prevPages.length + 1}`,
          pageNumber: prevPages.length + 1,
          objects: [],
          backgroundColor: "#1E1E1E"
        }];
        console.log('Whiteboard after adding new page:', {
          title,
          totalPages: newPages.length,
          pages: newPages
        });
        return newPages;
      });
      setCurrentPageIndex(pages.length);
    };

    const updateBackgroundColor = (color: string) => {
      console.log('Updating whiteboard page background:', {
        pageIndex: currentPageIndex,
        newColor: color,
        currentState: {
          title,
          totalPages: pages.length,
          currentPage: pages[currentPageIndex]
        }
      });
      setPages(prevPages => {
        const newPages = [...prevPages];
        newPages[currentPageIndex] = {
          ...newPages[currentPageIndex],
          backgroundColor: color
        };
        console.log('Whiteboard after background update:', {
          title,
          totalPages: newPages.length,
          pages: newPages
        });
        return newPages;
      });
    };

    const updateBoard = async () => {
      if (!id) return;
      try {
        await boardService.updateBoard(id, title, pages);
      } catch (err) {
        console.error('Failed to update board:', err);
      }
    };

    return (
      <div className="flex h-screen w-screen bg-[#1E1E1E]">
        {/* Left Panel (SidePanel) */}
        <div className={`relative transition-all duration-300 ease-in-out ${
          sidePanelVisible ? 'w-1/5' : 'w-0'
        } bg-[#181818]`}>
          {sidePanelVisible && (
            <div className="text-white text-sm font-['Kumbh_Sans'] p-4">
              <SidePanel 
                title={title}
                setTitle={setTitle}
                pages={pages}
                currentPageIndex={currentPageIndex}
                setCurrentPageIndex={setCurrentPageIndex}
                onAddPage={addNewPage}
              />
            </div>
          )}
          <button
            onClick={() => setSidePanelVisible(!sidePanelVisible)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-[#181818] text-white p-2 rounded-full z-50 hover:bg-[#383838] transition-colors duration-300"
          >
            {sidePanelVisible ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
  
        {/* Middle Section (MainBoard) - scrollable area */}
        <div className="flex-1 p-4 h-full overflow-auto" style={{ backgroundColor: pages[currentPageIndex]?.backgroundColor || "#1E1E1E" }}>
          <MainBoard 
            objects={pages[currentPageIndex]?.objects || []}
            setObjects={(newObjects: WhiteboardObject[]) => {
              console.log('Updating objects for page', currentPageIndex);
              console.log('New objects:', newObjects);
              setPages(prevPages => {
                const newPages = [...prevPages];
                newPages[currentPageIndex] = {
                  ...newPages[currentPageIndex],
                  objects: newObjects
                };
                console.log('Updated pages after objects change:', newPages);
                return newPages;
              });
            }}
            currentPageIndex={currentPageIndex}
          />
        </div>
  
        {/* Right Panel (Features) */}
        <div className={`relative transition-all duration-300 ease-in-out ${
          featuresPanelVisible ? 'w-1/5' : 'w-0'
        } bg-[#181818]`}>
          {featuresPanelVisible && (
            <div className="p-4">
              <Features 
                title={title}
                whiteboardElements={pages}
                onBackgroundColorChange={updateBackgroundColor}
                currentPageIndex={currentPageIndex}
                createdBy={createdBy}
                collaborators={collaborators}
              />
            </div>
          )}
          <button
            onClick={() => setFeaturesPanelVisible(!featuresPanelVisible)}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-[#181818] text-white p-2 rounded-full z-50 hover:bg-[#383838] transition-colors duration-300"
          >
            {featuresPanelVisible ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    );
  };
  
  export default WhiteBoard;
  
  

