import Image from "next/image";
const NotFound = () => {
    return (
        <div className="container">
            <Image src={"/404.svg"} alt="Robot illustrating a 404 error" width={700} height={700} priority/>
        </div>
    );
};

export default NotFound;