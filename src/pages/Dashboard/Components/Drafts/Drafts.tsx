import DraftsGrid from "./DraftsGrid";

const Drafts = () => {
  return (
    <div className="sm:flex-5 bg-[#1E1E1E] flex flex-col overflow-hidden">
  <div className="sm:flex-1 flex bg-transparent text-sm text-white font-['Kumbh_Sans'] border-b border-[#383838] justify-between items-center pl-4 pr-4">
    Drafts
    <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded-full cursor-pointer hover:from-blue-700 hover:to-blue-900">
      + Create New
    </button>
  </div>
     <div className="sm:flex-12 flex-col bg-transparent flex overflow-hidden ">
      <DraftsGrid />
      </div>
    </div>
  );
};
export default Drafts;
