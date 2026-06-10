import { redirect } from "next/navigation";

const HomePage = () => {
  return redirect("/catalogue");
};

export default HomePage;
