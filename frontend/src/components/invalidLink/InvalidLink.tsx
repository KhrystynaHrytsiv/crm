import { useRouter } from "next/navigation";

const InvalidLink = () => {
    const router = useRouter();

    return (
        <div className="form">
            <div className="field">
                <p>
                    The link is not valid, please contact the administrator to
                    solve the problem
                </p>

                <button
                    onClick={() => router.push("/login")}
                    className="greenButton"
                >
                    BACK TO LOGIN
                </button>
            </div>
        </div>
    );
};

export default InvalidLink;
