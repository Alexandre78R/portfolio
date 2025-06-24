import {
  LayoutDashboard,
  User,
  Settings,
  FolderPlus,
  Eye,
  DatabaseBackup,
  PanelsTopLeft,
  FileUser,
} from 'lucide-react'

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
  },
  {
    name: 'Projets',
    key: 'projects',
    icon: PanelsTopLeft,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les projets', key: 'projects/list', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'projects' },
      { name: 'Créer un projet', key: 'projects/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'projects' },
    ],
  },
  {
    name: 'Utilisateurs',
    key: 'users',
    icon: User,
    roles: ['admin'],
    children: [
      { name: 'Voir les utilisateurs', key: 'users/list', icon: Eye, roles: ['admin'], parentKey: 'users' },
      { name: 'Créer un utilisateur', key: 'users/create', icon: FolderPlus, roles: ['admin'], parentKey: 'users' },
    ],
  },
  {
    name: 'Expériences',
    key: 'experiences',
    icon: PanelsTopLeft,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les expériences', key: 'experiences/list', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'experiences' },
      { name: 'Créer une expérience', key: 'experiences/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'experiences' },
    ],
  },
  {
    name: 'Éducation',
    key: 'educations',
    icon: PanelsTopLeft,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les éducations', key: 'educations/list', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'educations' },
      { name: 'Créer une éducation', key: 'educations/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'educations' },
    ],
  },
  {
    name: 'Skills',
    key: 'skills',
    icon: PanelsTopLeft,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les skills', key: 'skills/list', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'skills' },
      { name: 'Créer un skill', key: 'skills/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'skills' },
    ],
  },
  {
    name: 'Thème',
    key: 'theme-colors',
    icon: Settings,
    roles: ['admin'],
    children: [
      { name: 'Voir les couleurs', key: 'theme-colors/list', icon: Eye, roles: ['admin'], parentKey: 'theme-colors' },
      { name: 'Créer une nouvelle couleur', key: 'theme-colors/create', icon: FolderPlus, roles: ['admin'], parentKey: 'theme-colors' },
    ],
  },
  {
    name: 'Sauvegarde',
    key: 'backup',
    icon: DatabaseBackup,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir les backup', key: 'backup/list', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'backup' },
      { name: 'Nouvelle backup', key: 'backup/create', icon: FolderPlus, roles: ['admin'], parentKey: 'backup' },
    ],
  },
  {
    name: 'CV',
    key: 'cv',
    icon: FileUser,
    roles: ['admin', 'editor', 'view'],
    children: [
      { name: 'Voir le CV', key: 'cv/view', icon: Eye, roles: ['admin', 'editor', 'view'], parentKey: 'cv' },
      { name: 'Modifier le CV', key: 'cv/update', icon: FolderPlus, roles: ['admin'], parentKey: 'cv' },
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