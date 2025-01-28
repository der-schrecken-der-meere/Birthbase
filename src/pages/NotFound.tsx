// React Router
import { PageLinks } from "@/globals/constants/links";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

const NotFound = () => {

    const error = useRouteError();

    return (
        isRouteErrorResponse(error) ? (
            <div className="h-screen py-2 px-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-medium">{error.status}</h2>
                <p className="text-lg py-1">{error.statusText}</p>
                {error.data?.message && <p>{error.data.message}</p>}
                <p className="text-center pt-2"><u className="font-medium"><Link to={PageLinks.HOME}>Hier</Link></u> drücken, um zum Hauptmenü zurück zu gelangen.</p>
            </div>
        ) : (
            <div>Not Found 404</div>
        )
    )
}

export default NotFound