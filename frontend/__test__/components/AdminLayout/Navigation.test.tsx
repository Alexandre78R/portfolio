import navigation, { NavItem } from '@/components/AdminLayout/Navigation'

describe('Navigation', () => {
  it('should be an array', () => {
    expect(Array.isArray(navigation)).toBe(true)
  })

  it('all top-level items should have name, key and icon', () => {
    const isReactComponent: (comp: any) => boolean = (comp: any) =>
        typeof comp === 'function' || (typeof comp === 'object' && comp !== null)

    navigation.forEach((item) => {
        expect(item.name as string).toBeDefined()
        expect(typeof item.name as string).toBe('string')

        expect(item.key as string).toBeDefined()
        expect(typeof item.key as string).toBe('string')

        expect(item.icon as any).toBeDefined()
        expect(isReactComponent(item.icon as any)).toBe(true as boolean)
    })
  })

  it('all keys should be unique', () => {
    const allKeys: string[] = []  as string[]

    const collectKeys: (items: NavItem[]) => void = (items) => {
      items.forEach((item) => {
        allKeys.push(item.key as string)
        if (item.children as NavItem[]) collectKeys(item.children as NavItem[])
      })
    }

    collectKeys(navigation as NavItem[])

    const uniqueKeys: Set<string> = new Set(allKeys as string[])
    expect(uniqueKeys.size as number).toBe(allKeys.length as number)
  })

  it('all children should have parentKey matching their parent', () => {
    navigation.forEach((parent) => {
      parent.children?.forEach((child) => {
        expect(child.parentKey as string).toBe(parent.key as string)
      })
    })
  })

  it('all roles should be valid', () => {
    const validRoles: string[] = ['admin', 'editor', 'view']

    const checkRoles: (items: NavItem[]) => void = (items) => {
      items.forEach((item) => {
        if (item.roles) {
          item.roles.forEach((role) => expect(validRoles as string[]).toContain(role as string))
        }
        if (item.children as NavItem[]) checkRoles(item.children as NavItem[])
      })
    }

    checkRoles(navigation as NavItem[])
  })

  it('optional fields should exist if present', () => {
    navigation.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          expect(child.key as string).toBeDefined()
          expect(child.name as string).toBeDefined()
          expect(child.icon as any).toBeDefined()
        })
      }
    })
  })
})