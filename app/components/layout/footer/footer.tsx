import { NavLink } from "react-router";
import { ImHome,ImNewspaper } from "react-icons/im";
import { MdPeopleOutline } from "react-icons/md";
import "./footer.css"

import { FaRegQuestionCircle } from "react-icons/fa";


export default function Footer() {

    return(
        <nav className="sticky bottom-0 z-10 flex justify-between items-center h-24 shadow-md w-full bg-white border-t border-gray-300">
            <NavLink 
                to="/" 
                className="page-button" // アイコン用のクラス名
                aria-label="ホーム"
            >
                <ImHome size={40}/>
            </NavLink>
            
            <NavLink 
                to="/news" 
                className="page-button" 
                aria-label="ニュース"
            >
                <ImNewspaper size={40}/>
            </NavLink>
            
            <NavLink 
                to="/faq" 
                className="page-button" 
                aria-label="質問"
            >
                <FaRegQuestionCircle size={40}/>
            </NavLink>

            <NavLink 
                to="/circle" 
                className="page-button" 
                aria-label="サークル"
            >
                <MdPeopleOutline size={40}/>
            </NavLink>
        </nav>
    );
}