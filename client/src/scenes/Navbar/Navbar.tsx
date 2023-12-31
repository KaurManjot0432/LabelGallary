import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../state';
import './Navbar.css';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function Navbar() {
    const dispatch = useDispatch()
    interface User {
        email: string;
        role: string;
    }
    interface AppState {
        user: User;
    }
    const user = useSelector((state: AppState) => state.user)
    const navigate = useNavigate();

    const HandleAdminClick = () => {
        navigate('/admin')
    }

    return (
        <div className='navbar'>
            <h4>LabelGallary</h4>
            {user.role == 'Admin' && <Button onClick={HandleAdminClick}>
                Access Admin panel
            </Button>}
            {/* {user.role == 'Staff' &&
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item"><Link className="nav-link" to="/business">Business</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/entertainment">Entertainment</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/general">General</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/health">Health</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/science">Science</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/sports">Sports</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/technology">Technology</Link></li>
                </ul>
            } */}
            <Dropdown style={{ marginRight: '5px' }}>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {user.email}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => dispatch(setLogout())} >Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>
    )
}

export default Navbar;