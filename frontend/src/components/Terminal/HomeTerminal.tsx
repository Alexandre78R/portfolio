const HomeTerminal: React.FC = (): React.ReactElement => {

  const textResponsive: (text: string) => string | undefined  = (text: string) : string | undefined => {
    if (text == "visitor") {
      if (window.innerWidth >= 350) return "visitor";  
      return "vis."
    }
    if (text == "domaine") {
      if (window.innerWidth >= 350) return "alexandre-renard.dev";  
      return "a-renard.dev"
    }
  }

  return (
    <div className="inline-block mr-2">
      <span className="text-secondary">{textResponsive("visitor")}</span>@<span className="text-primary">{textResponsive("domaine")}</span> :~$
    </div>
  );
};
    
export default HomeTerminal;
    