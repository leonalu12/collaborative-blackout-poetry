import LogoutButton from './LogoutButton';
import logo from '../assets/logo_poem.png';
import '../styles/Header.css'; 

export default function Header() {

    return (
    <header className="blackout-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="header-logo" />
          <h1 className="header-title">Blackout Poem</h1>
        </div>
        <div className="header-right">
          <LogoutButton />
        </div>
    </header>
    );

}