// React Router
import { PageLinks } from "@/globals/constants/links";
import { Trans, useTranslation } from "react-i18next";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

const NotFound = () => {

    const error = useRouteError();
    const { t } = useTranslation(["pages"]); 

    return (
        isRouteErrorResponse(error) ? (
            <div className="h-screen py-2 px-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-medium">{error.status}</h2>
                <p className="text-lg py-1">{error.statusText}</p>
                {error.data?.message && <p>{error.data.message}</p>}
                <p className="text-center pt-2">
                    <Trans
                        t={t}
                        i18nKey={"not_found.return"}
                        components={{
                            BackToHome: <BackToHome/>
                        }}
                    />
                </p>
            </div>
        ) : (
            <div>Not Found 404</div>
        )
    )
};

const BackToHome = () => {
    return (
        <u className="font-medium">
            <Link to={PageLinks.HOME}>Hier</Link>
        </u>
    );
};

export default NotFound