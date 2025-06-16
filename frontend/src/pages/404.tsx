import Link from "next/link";

const Custom404 = (): React.ReactElement => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] mt-[64px] px-4 bg-body">
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="100" fill="#f3f4f6" />
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fontSize="72"
            fill="#a3a3a3"
            fontWeight="bold"
            fontFamily="monospace"
          >
            404
          </text>
        </svg>
        <h1 className="text-4xl font-bold text-primary mt-6 text-center">
          Oups, page introuvable !
        </h1>
        <p className="text-lg text-text mt-2 text-center">
          La page que tu cherches n’existe pas ou a été déplacée.
        </p>
        <Link href="/" passHref>
          <button className="mt-6 px-6 py-3 rounded bg-primary text-white font-semibold shadow hover:bg-secondary transition">
            Retour à l’accueil
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
