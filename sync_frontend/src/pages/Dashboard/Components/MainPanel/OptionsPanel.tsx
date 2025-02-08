import Option from "./Option";

const OptionsPanel = () => {
  const options = [
    {
      icon_img: "",
      hover_color: "red",
      icon_color: "red",
      option_name: "New Design File",
      option_url: "",
    },
    {
      icon_img: "",
      hover_color: "blue",
      icon_color: "blue",
      option_name: "My Collaborators",
      option_url: "",
    },
    {
      icon_img: "",
      hover_color: "green",
      icon_color: "green",
      option_name: "Settings",
      option_url: "",
    },
    {
      icon_img: "",
      hover_color: "pink",
      icon_color: "pink",
      option_name: "Import",
      option_url: "",
    },
  ];

  return (
    <div className="sm:flex-2 bg-transparent flex justify-between items-center p-5">
      {options.map((opt, index) => (
        <Option
          key={index} // Using index as the key
          icon_color={opt.icon_color}
          hover_color={opt.hover_color}
          icon_img={opt.icon_img}
          option_name={opt.option_name}
          option_url={opt.option_url}
        />
      ))}
    </div>
  );
};

export default OptionsPanel;
