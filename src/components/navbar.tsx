export default function Navbar() {
    return (
        <div className="h-[60px] w-full bg-blue-pnm flex justify-between items-center px-6 !z-[900]">
            <img
                alt="Profile Pict"
                src='/PNM_logo.png'
                className="h-10 px-4 py-2 rounded object-contain shadow-xl bg-white"
            />
            <div className="relative">
                <button
                    className="flex items-center gap-1 md:gap-3 cursor-pointer"
                    onClick={() => { }}
                >
                    <img
                        alt="Profile Pict"
                        src='/vite.svg'
                        // onError={(e) => {
                        //     e.target.onerror = null
                        //     e.target.src = '/placeholder.jpg'
                        // }}
                        className="h-8 w-8 p-[1px] rounded-full object-cover shadow-xl bg-white border-gray-200"
                    />
                    <div className="flex flex-col justify-start items-start text-white">
                        <span className="hidden md:block text-sm font-semibold">Joko Widodo</span>
                        <span className="hidden md:block text-[10px]">joko@gmail.com</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
