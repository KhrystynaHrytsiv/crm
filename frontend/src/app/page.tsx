import {redirect} from "next/navigation";

export default async function Home() {
    redirect("/auth/login");

  return (
      <div>
        Main Page
    </div>
  );
}
