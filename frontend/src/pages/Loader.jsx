
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen backdrop-blur-sm">
      <div className="relative w-16 h-16">
        <div className="absolute w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loader;
