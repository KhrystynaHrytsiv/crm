import { useRouter } from "next/navigation";

const InvalidLink = () => {
    const router = useRouter();

    return (
        <div className="container">
            <div className="form">
                <p>
                    The link is not valid, please contact the administrator to
                    solve the problem
                </p>

                <button
                    onClick={() => router.push("/login")}
                    className="greenButton"
                >
                    back to login
                </button>
            </div>
        </div>
    );
};

export default InvalidLink;
