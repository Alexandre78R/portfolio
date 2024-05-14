import { useEffect } from "react";
import { useRouter } from "next/router";


export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.push("/404")
  }, [])
  
  return <h1 className="text-primary m-20">404 - Page Not Found</h1>;
}