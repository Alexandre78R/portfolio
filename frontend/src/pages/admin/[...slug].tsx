import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import AdminLayout from '@/components/AdminLayout/AdminLayout'

const pagesMap: Record<string, () => Promise<any>> = {
  'dashboard': () => import('../../components/AdminLayout/Pages/dashboard'),
//   'users': () => import('./users'),
//   'settings': () => import('./settings'),
//   'projects/create-project': () => import('./projects/create-project'),
//   'projects/view-projects': () => import('./projects/view-projects'),
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