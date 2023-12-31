import { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import { UpperHeaderLink } from "./LayoutLinks";
import LogoSvg from "assets/logo_horizontal.svg";

import { MenuContext } from "pages/layout/AdminLayout";
import { cn } from "utils/tailwind-merge";
import { useAppSelector } from "store/store";

export const AdminHeader = () => {
  const { menuClicked, menuClickHandler } = useContext(MenuContext);

  const state = useAppSelector((state) => state.authReducer);

  return (
    <div className="w-full h-20 py-2 pl-4 pr-6 flex items-center justify-center border-b border-teal-500 shadow-sm shadow-teal-800 fixed z-20 bg-gray-50">
      <div className="w-1/3 flex items-center gap-4">
        <div
          className={cn(
            "w-fit p-2 cursor-pointer transition duration-300 hover:bg-zinc-200 rounded-full",
            menuClicked && "rotate-180"
          )}
          onClick={menuClickHandler}
        >
          <Menu size={30} color="rgb(39 39 42)" />
        </div>
        <p className="text-lg font-semibold">현대백화점 문화콘텐츠팀</p>
        <p className="text-lg font-semibold">{state.name} 대리</p>
      </div>
      <div className="w-1/3 h-full flex justify-center items-center">
        <Link to="/admin" className="flex items-end h-12 gap-2 select-none">
          <img src={LogoSvg} alt="The Hyundai Logo" className="h-full" />
          <p className="text-base font-medium leading-5">관리자 페이지</p>
        </Link>
      </div>
      <div className="w-1/3 flex justify-end items-center gap-4 text-zinc-800">
        {true && <UpperHeaderLink link="/" text="고객페이지" />}
        {true && <UpperHeaderLink link="/" text="로그아웃" />}
      </div>
    </div>
  );
};
