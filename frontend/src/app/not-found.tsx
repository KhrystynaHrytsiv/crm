import Image from "next/image";

const NotFound = () => {
    return (
        <div className="container">
            <Image
                src={"/404.svg"}
                alt="404 error - page not found"
                width={680}
                height={680}
                priority
            />
        </div>
    );
};

export default NotFound;
