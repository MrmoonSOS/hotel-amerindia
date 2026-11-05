import { Link, NavLink } from 'react-router';
import { homeAnchors, pages } from '@/data/navigation';

const logo = 'https://horizons-cdn.hostinger.com/ba6f6edc-ea48-4b8b-b639-0a9fb675ea1d/3692afd38e5e9b057044a507a29a88d2.png';
const [home, ...docPages] = pages;

export function HotelShell({ children }: { children: React.ReactNode }) {
 return <><header className="header"><Link className="brand" to="/#inicio"><img src={logo} alt="Logo Hotel Amerindia"/><span>AMERINDIA<small>COMODIDAD A TU ALCANCE</small></span></Link><nav aria-label="Navegación principal"><NavLink to={home.to} end>{home.label}</NavLink>{homeAnchors.map(anchor=><Link key={anchor.to} className="header-anchor" to={anchor.to}>{anchor.label}</Link>)}{docPages.map(page=><NavLink key={page.to} to={page.to}>{page.label}</NavLink>)}</nav><Link className="header-cta" to="/#contacto">Hablemos de tu estancia ↗</Link></header><nav className="page-tabs" aria-label="Páginas">{pages.map(page=><NavLink key={page.to} to={page.to} end>{page.label}</NavLink>)}</nav>{children}<footer><Link className="brand" to="/#inicio"><img alt="" src={logo}/><span>AMERINDIA<small>COMODIDAD A TU ALCANCE</small></span></Link><Link to="/#contacto">Contacto y consultas ↗</Link><small>© 2026 Hotel Amerindia</small></footer></>;
}
