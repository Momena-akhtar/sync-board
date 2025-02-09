import ProjOption from "./ProjOption";
import {
  ProjOptionsDummyData,
  image_paths,
} from "../../../../DummyData/ProjOptionsDummyData";
const ProjectsGrid = () => {
  return (
    <div className="sm:flex-8 flex flex-col overflow-hidden ">
      <div className="flex-1 flex bg-transparent">
        <span className="flex-1 flex items-center p-6">
          <span className="bg-red-500">placeholder1</span>
          <span className="bg-blue-500 ml-4">placeholder2</span>
        </span>
        <span className="flex-1"></span>
      </div>

      <div className="flex-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 overflow-y-auto">
        {ProjOptionsDummyData.map((proj, index) => (
          <ProjOption
            key={index}
            name={proj.name}
            last_edited={proj.last_edited}
            image={image_paths[index % image_paths.length]}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;
