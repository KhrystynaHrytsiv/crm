"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ActionTokenType } from "../../../../../shared/enums/tokenEnum";
import PasswordForm from "../../../components/forms/PasswordForm";
import InvalidLink from "../../../components/invalidLink/InvalidLink";
import { managerService } from "../../../services/managerService";
import Loading from "../../loading";

const ActionPage = () => {
    const { token, action } = useParams<{
        token: string;
        action: ActionTokenType;
    }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isInvalidLink, setIsInvalidLink] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                const { isValid } = await managerService.verifyActionToken(
                    action,
                    token,
                );
                setIsInvalidLink(!isValid);
            } catch {
                setIsInvalidLink(true);
            } finally {
                setIsLoading(false);
            }
        };
        verify();
    }, [action, token]);

    if (isLoading) return <Loading />;
    if (isInvalidLink) return <InvalidLink />;
    return (
        <div className="container">
            <PasswordForm token={token} action={action} />
        </div>
    );
};

export default ActionPage;
