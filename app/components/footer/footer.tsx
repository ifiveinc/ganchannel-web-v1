import { NavLink } from "react-router";
import { ImHome,ImNewspaper } from "react-icons/im";
import { MdOutlineWorkHistory,MdPeopleOutline } from "react-icons/md";
import "./pageNavFooter.css"


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
                to="/part-time-job" 
                className="page-button" 
                aria-label="アルバイト"
            >
                <MdOutlineWorkHistory size={40}/>
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