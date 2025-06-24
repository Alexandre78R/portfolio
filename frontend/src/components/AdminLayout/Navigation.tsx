import { LayoutDashboard, User, Settings, FolderPlus, Eye } from 'lucide-react'

export type NavItem = {
  name: string
  key: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
  roles?: ('admin' | 'editor' | 'view')[]
  access?: boolean
  parentKey?: string
  disabled?: boolean
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    key: 'dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les stats', key: 'dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'view'], parentKey: 'dashboard' },
      { name: 'Voir les backup', key: 'dashboard/view', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'dashboard' },
      { name: 'Nouvelle backup', key: 'dashboard/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'dashboard' },
    ],
  },
  {
    name: 'Projets',
    key: 'projects',
    icon: FolderPlus,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les projets', key: 'projects/view', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'projects' },
      { name: 'Créer un projet', key: 'projects/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'projects' },
    ],
  },
  {
    name: 'Utilisateurs',
    key: 'users',
    icon: User,
    roles: ['admin'],
    children: [
      { name: 'Voir les utilisateurs', key: 'users/view', icon: Eye, roles: ['admin'], parentKey: 'users' },
      { name: 'Créer un utilisateur', key: 'users/create', icon: FolderPlus, roles: ['admin'], parentKey: 'users' },
    ],
  },
  {
    name: 'Expériences',
    key: 'experiences',
    icon: FolderPlus,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les expériences', key: 'experiences/view', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'experiences' },
      { name: 'Créer une expérience', key: 'experiences/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'experiences' },
    ],
  },
  {
    name: 'Éducation',
    key: 'education',
    icon: FolderPlus,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les éducations', key: 'education/view', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'education' },
      { name: 'Créer une éducation', key: 'education/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'education' },
    ],
  },
  {
    name: 'Skills',
    key: 'skills',
    icon: FolderPlus,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les skills', key: 'skills/view', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'skills' },
      { name: 'Créer un skill', key: 'skills/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'skills' },
    ],
  },
  {
    name: 'Thème',
    key: 'theme',
    icon: Settings,
    roles: ['admin'],
    children: [
      { name: 'Couleurs de thème', key: 'theme-colors', icon: FolderPlus, roles: ['admin'], parentKey: 'theme' },
      { name: 'Voir les couleurs', key: 'theme-colors/view', icon: Eye, roles: ['admin'], parentKey: 'theme-colors' },
      { name: 'Créer une nouvelle couleur', key: 'theme-colors/create', icon: FolderPlus, roles: ['admin'], parentKey: 'theme-colors' },
    ],
  },
  // {
  //   name: 'Paramètres',
  //   key: 'settings',
  //   icon: Settings,
  //   roles: ['admin'],
  //   children: [
  //     { name: 'Changer mot de passe', key: 'settings/change-password', icon: Lock, roles: ['admin'], parentKey: 'settings' },
  //   ],
  // },
]

export default navigation;