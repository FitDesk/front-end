import { Link } from "react-router";

export default function About() {
    return (
        <div className="p-4">
            <h1>About Page</h1>
            <p>Esta es la página About.</p>
            <Link to="/" viewTransition className="text-blue-500 underline">
                Volver a Home
            </Link>
            <Link to="/" >
                Volver a Home
            </Link>
        </div>
    );
}