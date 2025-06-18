type MainContentProps = {
  activeTab: string
}

export default function MainContent({ activeTab }: MainContentProps) {
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <p className="text-primary">Bienvenue sur le dashboard 👋</p>
      case 'users':
        return <p className="text-primary">Ici tu gères tes utilisateurs.</p>
      case 'settings':
        return <p className="text-primary">Réglages de l’application.</p>
      case 'create-project':
        return <p className="text-primary">Création d’un nouveau projet.</p>
      case 'view-projects':
        return <p className="text-primary">Liste des projets existants.</p>
      default:
        return <p>Dashboard</p>
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {renderPage()}
    </div>
  )
}
