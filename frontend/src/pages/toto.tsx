import { useEffect } from "react";

const TotoPage = () => {
   useEffect(() => {
    console.log("je suis sur la page toto")
  }, []);

  return (
    <div className="mt-[64px] px-4">
      <h1 className="text-primary">Page de toto</h1>
      <h1 className="text-primary">Page de toto</h1>
      <h1 className="text-primary">Page de toto</h1>
      <h1 className="text-primary">Page de toto</h1>
      <h1 className="text-primary">Page de toto</h1>
      <h1 className="text-primary">Page de toto</h1>
      <h1 className="text-primary">Page de toto</h1>
      <h1 className="text-primary">Page de toto</h1>
    </div>
  );
};

export default TotoPage;