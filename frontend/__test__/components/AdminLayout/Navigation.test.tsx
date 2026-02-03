import navigation, { type NavItem, type Role } from '@/components/AdminLayout/Navigation'
import type { ComponentType } from 'react'

const isReactComponent: (component: unknown) => component is ComponentType<{ className?: string }> = (
  component: unknown
): component is ComponentType<{ className?: string }> => {
  return (
    typeof component === 'function' ||
    (typeof component === 'object' && component !== null)
  )
}

describe('Navigation', (): void => {
  it('should be an array', (): void => {
    const isArray: boolean = Array.isArray(navigation)
    expect(isArray).toBe(true)
  })

  it('all top-level items should have name, key and icon', (): void => {
    navigation.forEach((item: NavItem): void => {
      const name: string = item.name
      const key: string = item.key
      const icon = item.icon

      expect(name).toBeDefined()
      expect(typeof name).toBe('string')

      expect(key).toBeDefined()
      expect(typeof key).toBe('string')

      expect(icon).toBeDefined()
      expect(isReactComponent(icon)).toBe(true)
    })
  })

  it('all keys should be unique', (): void => {
    const allKeys: string[] = []

    const collectKeys = (items: NavItem[]): void => {
      items.forEach((item: NavItem): void => {
        const key: string = item.key
        allKeys.push(key)

        const children: NavItem[] | undefined = item.children
        if (children) {
          collectKeys(children)
        }
      })
    }

    collectKeys(navigation)

    const uniqueKeys: Set<string> = new Set<string>(allKeys)
    const uniqueCount: number = uniqueKeys.size
    const totalCount: number = allKeys.length

    expect(uniqueCount).toBe(totalCount)
  })

  it('all children should have parentKey matching their parent', (): void => {
    navigation.forEach((parent: NavItem): void => {
      const parentKey: string = parent.key

      parent.children?.forEach((child: NavItem): void => {
        const childParentKey: string | undefined = child.parentKey
        expect(childParentKey).toBe(parentKey)
      })
    })
  })

  it('all roles should be valid', (): void => {
    const validRoles: ReadonlyArray<Role> = ['admin', 'editor', 'view']

    const checkRoles = (items: NavItem[]): void => {
      items.forEach((item: NavItem): void => {
        const roles: Role[] | undefined = item.roles

        roles?.forEach((role: Role): void => {
          expect(validRoles).toContain(role)
        })

        const children: NavItem[] | undefined = item.children
        if (children) {
          checkRoles(children)
        }
      })
    }

    checkRoles(navigation)
  })

  it('optional fields should exist if present', (): void => {
    navigation.forEach((item: NavItem): void => {
      const children: NavItem[] | undefined = item.children

      if (children) {
        children.forEach((child: NavItem): void => {
          const key: string = child.key
          const name: string = child.name
          const icon: ComponentType<{ className?: string }> = child.icon

          expect(key).toBeDefined()
          expect(name).toBeDefined()
          expect(icon).toBeDefined()
        })
      }
    })
  })
})