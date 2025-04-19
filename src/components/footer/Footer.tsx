const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-800 pt-8">
        {/* Left Side */}
        <div className="mb-6 md:mb-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg">
              AnguliLekha
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            © 2024 AnguliLekha. All rights reserved
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col md:items-end gap-4">
          <div className="flex gap-4 text-sm">
            <a href="/landing" className="hover:text-white">
              Home
            </a>
            <a href="#" className="hover:text-white">
              Practice
            </a>
            <a href="#" className="hover:text-white">
              Quiz
            </a>
            <a href="/about-us" className="hover:text-white">
              About
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
