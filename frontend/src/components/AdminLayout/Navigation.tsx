import { LayoutDashboard, User, Settings, FolderPlus, Eye } from 'lucide-react'

export type NavItem = {
  name: string
  key: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    key: 'dashboard',
    icon: LayoutDashboard,
    children: [
      { name: 'Voir les stats', key: 'dashboard', icon: LayoutDashboard },
      { name: 'Voir les backup', key: 'dashboard/view', icon: Eye },
      { name: 'Nouvelle backup', key: 'dashboard/create', icon: FolderPlus },
    ],
  },
  {
    name: 'Projets',
    key: 'projects',
    icon: FolderPlus,
    children: [
      { name: 'Voir les projets', key: 'projects/view', icon: Eye },
      { name: 'Créer un projet', key: 'projects/create', icon: FolderPlus },
    ],
  },
  {
    name: 'Utilisateurs',
    key: 'users',
    icon: User,
    children: [
      { name: 'Voir les utilisateurs', key: 'users/view', icon: Eye },
      { name: 'Créer un utilisateur', key: 'users/create', icon: FolderPlus },
    ],
  },
  {
    name: 'Expériences',
    key: 'experiences',
    icon: FolderPlus,
    children: [
      { name: 'Voir les expériences', key: 'experiences/view', icon: Eye },
      { name: 'Créer une expérience', key: 'experiences/create', icon: FolderPlus },
    ],
  },
  {
    name: 'Éducation',
    key: 'educations',
    icon: FolderPlus,
    children: [
      { name: 'Voir les éducations', key: 'educations/view', icon: Eye },
      { name: 'Créer une éducation', key: 'educations/create', icon: FolderPlus },
    ],
  },
  {
    name: 'Compétences',
    key: 'skills',
    icon: FolderPlus,
    children: [
      { name: 'Voir les compétences', key: 'skills/view', icon: Eye },
      { name: 'Créer une compétences', key: 'skills/create', icon: FolderPlus },
    ],
  },
  {
    name: 'Couleurs de thème',
    key: 'theme-colors',
    icon: FolderPlus,
    children: [
      { name: 'Voir les couleurs', key: 'theme-colors/view', icon: Eye },
      { name: 'Créer une nouvelle couleur', key: 'theme-colors/create', icon: FolderPlus },
    ],
  },
  // {
  //   name: 'Paramètres',
  //   key: 'settings',
  //   icon: Settings,
  // },
];

export default navigation;