import { useNavigate } from "react-router-dom"

export default function NavbarIcon({icon, text='tooltip', path='/', callback}) {
    const navigate = useNavigate()

    //calls callback function passed in as destructured prop and then navigates to path passed in as destructured prop
    const navigateToPage = () => {
        callback()
        navigate(path)
    }
    return (
        <div onClick={navigateToPage} className="navbar-icon group">
            {icon}
            <span className="navbar-tooltip group-hover:scale-100">
                {text}
            </span>
        </div>
    )
}