import { Link } from "react-router";

export default function Home() {
    return (
        <div className="p-4">
            <h1>Home Page</h1>
            <p>Bienvenido a la página principal.</p>
            <Link to="/about" viewTransition className="text-blue-500 underline">
                Ir a About
            </Link>
            <Link to="/about" >
                Ir a About
            </Link>
        </div>
    );
}