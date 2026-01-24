import React, { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useRouter, type NextRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import navigation, { type NavItem } from '@/components/AdminLayout/Navigation';
import { useUser, type UserContextType } from '@/context/UserContext/UserContext';
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
  'skills/categories/list': () => import('@/components/AdminLayout/Pages/Skills/Categories/SkillCategoriesList'),
  'skills/categories/create': () => import('@/components/AdminLayout/Pages/Skills/Categories/SkillCategoryCreate'),
  'socials/list': () => import('@/components/AdminLayout/Pages/Socials/SocialsList'),
  'socials/create': () => import('@/components/AdminLayout/Pages/Socials/SocialCreate'),
  'theme-colors/list': () => import('@/components/AdminLayout/Pages/Themes/ThemesList'),
  'theme-colors/create': () => import('@/components/AdminLayout/Pages/Themes/ThemeCreate'),
  'backup/list': () => import('@/components/AdminLayout/Pages/BackUp/BackUpList'),
  'cv/view': () => import('@/components/AdminLayout/Pages/CV/CVView'),
  'cv/update': () => import('@/components/AdminLayout/Pages/CV/CVUpdate'),
  'messages/create': () => import('@/components/AdminLayout/Pages/Messages/MessageCreate'),
  'aboutme/update': () => import('@/components/AdminLayout/Pages/AboutMe/AboutMeUpdate'),
  'signatures/list': () => import('@/components/AdminLayout/Pages/Signatures/SignaturesList'),
  'signatures/create': () => import('@/components/AdminLayout/Pages/Signatures/SignaturesCreate'),
};

const AdminPage = (): ReactElement | null => {
  const { query, replace }: NextRouter = useRouter();
  const slug: string | string[] | undefined = query.slug;
  const { user, loading: userLoading }: UserContextType = useUser();

  const [ready, setReady]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const role: string = user?.role ?? 'view';

  const slugPath: string = useMemo<string>(() => {
    if (Array.isArray(slug)) return slug.join('/');
    return slug ?? 'dashboard';
  }, [slug]);

  const hasAccess: (key: string, role: string) => boolean = (key: string, role: string): boolean => {
    const findInItems: (items: NavItem[]) => boolean = (items: NavItem[]): boolean => {
      for (const item of items) {
        if (item.key === key) {
          return !item.roles || item.roles.includes(role as any);
        }
        if (item.children && findInItems(item.children)) {
          const child: NavItem | undefined = item.children.find(c => c.key === key);
          if (child) {
            return !child.roles || child.roles.includes(role as any);
          }
        }
      }
      return false;
    };
    return findInItems(navigation);
  };

  useEffect((): void => {
    if (!userLoading && user !== undefined) {
      if (user && user.isPasswordChange === false) {
        replace('/admin/auth/changePassword');
        return;
      }
      setReady(true);
    }
  }, [userLoading, user, replace]);

  useEffect((): void => {
    if (!ready) return;
    if (!slugPath) return;

    if (!pagesMap[slugPath] || !hasAccess(slugPath, role)) {
      replace('/admin/dashboard');
    }
  }, [slugPath, role, replace, ready]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-body" data-testid="admin-loading">
        <LoadingCustom />
      </div>
    );
  }

  const DynamicComponent = dynamic(pagesMap[slugPath] || pagesMap['dashboard']);

  return (
    <AdminLayout>
      <DynamicComponent />
    </AdminLayout>
  );
};

AdminPage.displayName = 'AdminPage';

export default AdminPage;