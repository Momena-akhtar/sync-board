
const SidePanel = () => {
    return (
        <div>
            <div className="text-sm font-semibold mb-4 flex items-center  p-2">
                {/* <FaProjectDiagram className="mr-2 text-white" /> */}
                <input 
                    type="text" 
                    defaultValue="Untitled" 
                    className="bg-transparent rounded-lg outline-none border border-[#383838] p-2 text-white"
                />
                <svg 
                    className="w-4 h-4 ml-2 cursor-pointer" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
            <div className="p-3 flex items-center justify-between">
                <div className="flex space-x-4">
                    <button className="text-left text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 ease-in-out">File</button>
                    <button className="text-left text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 ease-in-out">Assets</button>
                </div>
                <button className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 ease-in-out">
                    <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </button>
            </div>
            <hr className="border-none h-[2px] mt-2 mb-2 bg-[#383838]" />

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white">Pages</h3>
                <svg 
                    className="w-4 h-4 cursor-pointer hover:text-gray-400 transition-colors duration-200 ease-in-out" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center text-sm justify-between p-2 bg-[#1E1E1E] rounded-lg cursor-pointer hover:transition-colors duration-200 ease-in-out">
                    <span className="text-white text-xs">Page 1</span>
                </div>
                 <div className="flex items-center text-sm justify-between p-2 bg-[#1E1E1E] rounded-lg cursor-pointer hover:transition-colors duration-200 ease-in-out">
                    <span className="text-white text-xs">Page 2</span>
                </div>
                <hr className="border-none h-[2px] mt-2 bg-[#383838]" />
                </div>
                <div>
                    <div className="flex justify-between items-center mt-4">
                        <h3 className="text-sm font-bold text-white">Layers</h3>
                        <svg 
                            className="w-4 h-4 cursor-pointer hover:text-gray-400 transition-colors duration-200 ease-in-out" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9 6 9-6-9-6-9 6zm0 6l9 6 9-6-9-6-9 6z"></path>
                        </svg>
                    </div>
                </div>
        </div>
    );
}

export default SidePanel;
