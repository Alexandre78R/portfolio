import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { useEffect, useMemo, useState } from 'react';
import navigation from '@/components/AdminLayout/Navigation';
import { useUser } from '@/context/UserContext/UserContext';
import LoadingCustom from '@/components/Loading/LoadingCustom';

const pagesMap: Record<string, () => Promise<any>> = {
  'dashboard': () => import('@/components/AdminLayout/Pages/Dashboard/Dashboard'),
  'projects/list': () => import('@/components/AdminLayout/Pages/Projects/ProjectsList'),
  'projects/create': () => import('@/components/AdminLayout/Pages/Projects/ProjectCreate'),
  'users/list': () => import('@/components/AdminLayout/Pages/Users/UsersList'),
  'users/create': () => import('@/components/AdminLayout/Pages/Users/UserCreate'),
  'experiences/list': () => import('@/components/AdminLayout/Pages/Experiences/ExperiencesList'),
  'experiences/create': () => import('@/components/AdminLayout/Pages/Experiences/ExperienceCreate'),
  'educations/list': () => import('@/components/AdminLayout/Pages/Educations/EducationsList'),
  'educations/create': () => import('@/components/AdminLayout/Pages/Educations/EducationCreate'),
  'skills/list': () => import('@/components/AdminLayout/Pages/Skills/SkillsList'),
  'skills/create': () => import('@/components/AdminLayout/Pages/Skills/SkillCreate'),
  'theme-colors/list': () => import('@/components/AdminLayout/Pages/Themes/ThemesList'),
  'theme-colors/create': () => import('@/components/AdminLayout/Pages/Themes/ThemeCreate'),
  'backup/list': () => import('@/components/AdminLayout/Pages/BackUp/BackUpList'),
  'backup/create': () => import('@/components/AdminLayout/Pages/BackUp/BackUpCreate'),
  'cv/view': () => import('@/components/AdminLayout/Pages/CV/CVView'),
  'cv/update': () => import('@/components/AdminLayout/Pages/CV/CVUpdate'),
}

const AdminPage = (): React.ReactElement | null => {
  const { query, replace } = useRouter()
  const slug = query.slug
  const { user, loading: userLoading } = useUser()
  const [ready, setReady] = useState(false)

  const role = user?.role || 'view';

  const slugPath = useMemo(() => {
    if (Array.isArray(slug)) return slug.join('/')
    return slug ?? 'dashboard'
  }, [slug])

  const hasAccess = (key: string, role: string): boolean => {
    const findInItems = (items: typeof navigation): boolean => {
      for (const item of items) {
        if (item.key === key) {
          return !item.roles || item.roles.includes(role as any)
        }
        if (item.children && findInItems(item.children)) {
          const child = item.children.find(c => c.key === key)
          if (child) {
            return !child.roles || child.roles.includes(role as any)
          }
        }
      }
      return false
    }
    return findInItems(navigation)
  }

  useEffect(() => {
    if (!userLoading && user !== undefined) {
      setReady(true)
    }
  }, [userLoading, user])

  useEffect(() => {
    if (!ready) return
    if (!slugPath) return

    if (!pagesMap[slugPath] || !hasAccess(slugPath, role)) {
      replace('/admin/dashboard')
    }
  }, [slugPath, role, replace, ready])

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-body">
        <LoadingCustom />
      </div>
    )
  }

  const DynamicComponent = dynamic(pagesMap[slugPath] || pagesMap['dashboard'])

  return (
    <AdminLayout>
      <DynamicComponent />
    </AdminLayout>
  )
}

export default AdminPage