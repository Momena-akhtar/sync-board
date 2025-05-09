import SidePanel from "./SidePanel";
import MainBoard from "./MainBoard/MainBoard";
import Features from "./Features";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Page, WhiteboardObject } from "./Types/WhiteboardTypes";
import { v4 as uuidv4 } from 'uuid';

const WhiteBoard = () => {
    const [title, setTitle] = useState("Untitled");
    const [sidePanelVisible, setSidePanelVisible] = useState(true);
    const [featuresPanelVisible, setFeaturesPanelVisible] = useState(true);
    const [pages, setPages] = useState<Page[]>([{
      id: uuidv4(),
      name: "Page 1",
      objects: [],
      backgroundColor: "#1E1E1E"
    }]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const addNewPage = () => {
      setPages(prevPages => [...prevPages, {
        id: uuidv4(),
        name: `Page ${prevPages.length + 1}`,
        objects: [],
        backgroundColor: "#1E1E1E"
      }]);
      setCurrentPageIndex(pages.length);
    };

    const updateBackgroundColor = (color: string) => {
      setPages(prevPages => {
        const newPages = [...prevPages];
        newPages[currentPageIndex] = {
          ...newPages[currentPageIndex],
          backgroundColor: color
        };
        return newPages;
      });
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
        <div className="flex-1 p-4 h-full overflow-auto" style={{ backgroundColor: pages[currentPageIndex].backgroundColor }}>
          <MainBoard 
            objects={pages[currentPageIndex].objects}
            setObjects={(newObjects: WhiteboardObject[]) => {
              setPages(prevPages => {
                const newPages = [...prevPages];
                newPages[currentPageIndex] = {
                  ...newPages[currentPageIndex],
                  objects: newObjects
                };
                return newPages;
              });
            }}
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
  
  

