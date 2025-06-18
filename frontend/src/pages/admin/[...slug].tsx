import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import AdminLayout from '@/components/AdminLayout/AdminLayout'

const pagesMap: Record<string, () => Promise<any>> = {
  'dashboard': () => import('@/components/AdminLayout/Pages/Dashboard/Dashboard'),
  'dashboard/view': () => import('@/components/AdminLayout/Pages/Dashboard/BackUpList'),
  'dashboard/create': () => import('@/components/AdminLayout/Pages/Dashboard/BackUpCreate'),
  'projects/view': () => import('@/components/AdminLayout/Pages/Projects/ProjectsList'),
  'projects/create': () => import('@/components/AdminLayout/Pages/Projects/ProjectCreate'),
  'users/view': () => import('@/components/AdminLayout/Pages/Users/UsersList'),
  'users/create': () => import('@/components/AdminLayout/Pages/Users/UserCreate'),
  'experiences/view': () => import('@/components/AdminLayout/Pages/Experiences/ExperiencesList'),
  'experiences/create': () => import('@/components/AdminLayout/Pages/Experiences/ExperienceCreate'),
  'educations/view': () => import('@/components/AdminLayout/Pages/Educations/EducationsList'),
  'educations/create': () => import('@/components/AdminLayout/Pages/Educations/EducationCreate'),
  'skills/view': () => import('@/components/AdminLayout/Pages/Skills/SkillsList'),
  'skills/create': () => import('@/components/AdminLayout/Pages/Skills/SkillCreate'),
  'theme-colors/view': () => import('@/components/AdminLayout/Pages/Themes/ThemesList'),
  'theme-colors/create': () => import('@/components/AdminLayout/Pages/Themes/ThemeCreate'),
  // 'settings': () => import('@/components/AdminLayout/Pages/Dashboard/Dashboard'),
}

const AdminPage = (): React.ReactElement => {
  const { query } = useRouter()
  const slug = query.slug

  const slugPath = Array.isArray(slug) ? slug.join('/') : slug ?? 'dashboard'
  const DynamicComponent = dynamic(pagesMap[slugPath] || pagesMap['dashboard'])
  
  return (
    <AdminLayout>
      <DynamicComponent />
    </AdminLayout>
  )
}

export default AdminPage;