const Trash = () => {
  return (
    <div className="sm:flex-5 bg-zinc-900 flex flex-col overflow-hidden">
  <div className="sm:flex-1 flex bg-transparent text-white font-['Kumbh_Sans'] border-b border-zinc-600 justify-start items-center pl-4">
    Trash 
  </div>
    <div className="sm:flex-12 flex-col bg-transparent flex items-center justify-center h-full">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6h18M9 6v12m6-12v12M4 6l1.5 12.5a2 2 0 002 1.5h9a2 2 0 002-1.5L20 6M10 11h4"
          />
        </svg>
        <p className="text-white">Nothing to show in trash</p>
      </div>
    </div>
    </div>
  );
};

export default Trash;
