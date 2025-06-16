import { useEffect } from "react";
import { useRouter } from "next/router";
const Custom404 = (): React.ReactElement => {
  const router = useRouter();

  useEffect(() => {
    // router.push("/");
  }, []);

  return (
    <main className="bg-body">
      toto
    </main>
  );
};

export default Custom404;
