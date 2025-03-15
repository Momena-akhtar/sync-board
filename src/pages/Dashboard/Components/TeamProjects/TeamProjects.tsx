import { FaUsers }from "react-icons/fa";
const TeamProjects = () => {
  return (
<div className="sm:flex-5 bg-[#1E1E1E] text-[18px] font-['Kumbh_Sans'] flex flex-col overflow-hidden">
<div className="text-white flex items-center gap-2 mt-20  ml-10 mb-8">
  <FaUsers className="text-blue text-xl" />
  <span>User Projects</span>
</div>

  <div className="grid grid-cols-2  p-4">
    {/* Team Project Card */}
    <div className="bg-inherit p-6 border border-[#383838] w-100 rounded-lg flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black h-20 rounded-md"></div>
        <div className="bg-white h-20 rounded-md"></div>
        <div className="bg-gray-700 h-20 rounded-md"></div>
        <div className="bg-gray-700 h-20 rounded-md"></div>
      </div>
      <div className="mt-4"></div>
        <p className="text-sm text-white">Team project</p>
        <p className="text-xs text-gray-400">2 files • Updated 26 minutes ago</p>
      </div>
    {/* Create with Team Card */}
    <div className="bg-inherit p-6 border border-[#383838] rounded-lg w-100 flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-4">
      <div className="bg-black h-20 rounded-md"></div>
      <div className="bg-white h-20 rounded-md"></div>
      <div className="bg-gray-700 h-20 rounded-md"></div>
      <div className="bg-gray-700 h-20 rounded-md"></div>
      </div>
      <div className="mt-4 flex justify-center">
      <button className="bg-blue-500 hover:bg-blue-600 text-sm cursor-pointer text-white px-4 py-2 rounded-full">
        Create with Team
      </button>
      </div>
    </div>
      </div>
    </div>
    );
};

export default TeamProjects;
