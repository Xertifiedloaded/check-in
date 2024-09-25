

export default function MobileHamburger({ toggleMenu, isOpen }) {
  return (
    <button
      onClick={toggleMenu}
      className="flex lg:hidden flex-col items-center justify-center w-10 h-10 rounded-lg bg-white shadow-md focus:outline-none"
    >
      <span
        className={`block h-1 w-6 bg-black   font-medium rounded transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-0' : 'my-[2px]'
        }`}
      />
      <span
        className={`block h-1 w-6 bg-black  rounded transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100 my-[2px]'
        }`}
      />
      <span
        className={`block h-1 w-6 bg-black  rounded transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-2' : ' my-[2px]'
        }`}
      />
    </button>
  );
}
