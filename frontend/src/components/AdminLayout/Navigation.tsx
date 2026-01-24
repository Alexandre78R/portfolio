import { ReactNode, ComponentType } from 'react'
import {
  LayoutDashboard,
  User,
  Settings,
  FolderPlus,
  Eye,
  DatabaseBackup,
  PanelsTopLeft,
  FileUser,
  Mail,
  Text,
  Signature
} from 'lucide-react'

export type Role = 'admin' | 'editor' | 'view'

export interface NavItem {
  name: string
  key: string
  icon: ComponentType<{ className?: string }>
  children?: NavItem[]
  roles?: Role[]
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
    name: 'Catégories de Skills',
    key: 'skills/categories',
    icon: PanelsTopLeft,
    roles: ['admin', 'editor'],
    children: [
      { name: 'Voir les catégories', key: 'skills/categories/list', icon: Eye, roles: ['admin', 'editor'], parentKey: 'skills/categories' },
      { name: 'Créer une catégorie', key: 'skills/categories/create', icon: FolderPlus, roles: ['admin', 'editor'], parentKey: 'skills/categories' },
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
    key: 'backup/list',
    icon: DatabaseBackup,
    roles: ['admin', 'editor', 'view'],
  },
  {
    name: 'Socials',
    key: 'socials',
    icon: PanelsTopLeft,
    roles: ['admin', 'editor'],
    children: [
      { name: 'Voir les socials', key: 'socials/list', icon: Eye, roles: ['admin'], parentKey: 'socials' },
      { name: 'Créer un social', key: 'socials/create', icon: FolderPlus, roles: ['admin'], parentKey: 'socials' },
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
  {
    name: 'Messages',
    key: 'messages',
    icon: Mail,
    roles: ['admin'],
    children: [
      { name: 'Envoyer un message', key: 'messages/create', icon: FolderPlus, roles: ['admin'], parentKey: 'messages' },
    ],
  },
  {
    name: 'About Me',
    key: 'aboutme/update',
    icon: Text,
    roles: ['admin', 'editor', 'view'],
  },
  {
    name: "Signatures",
    key: 'signatures',
    icon: Signature,
    roles: ['admin'],
    children: [
      { name: 'Envoyer un message', key: 'signatures/list', icon: Eye, roles: ['admin'], parentKey: 'signatures' },
      { name: 'Envoyer un message', key: 'signatures/create', icon: FolderPlus, roles: ['admin'], parentKey: 'signatures' },
    ],
  },
]

export default navigation;