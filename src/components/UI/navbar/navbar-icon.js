import { useNavigate } from "react-router-dom"
//Taken from fireship's tutorial on how to make discord sidebar with tailwind css https://www.youtube.com/watch?v=pfaSUYaSgRo
export default function NavbarIcon({icon, text='tooltip', path='/'}) {
    const navigate = useNavigate()

    const navigateToPage = () => {
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