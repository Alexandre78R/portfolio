import navigation, { NavItem } from '@/components/AdminLayout/Navigation'

describe('Navigation', () => {
  it('should be an array', () => {
    expect(Array.isArray(navigation)).toBe(true)
  })

  it('all top-level items should have name, key and icon', () => {
    const isReactComponent: (comp: any) => boolean = (comp: any) =>
        typeof comp === 'function' || (typeof comp === 'object' && comp !== null)

    navigation.forEach((item) => {
        expect(item.name).toBeDefined()
        expect(typeof item.name).toBe('string')

        expect(item.key).toBeDefined()
        expect(typeof item.key).toBe('string')

        expect(item.icon).toBeDefined()
        expect(isReactComponent(item.icon)).toBe(true)
    })
  })

  it('all keys should be unique', () => {
    const allKeys: string[] = []

    const collectKeys: (items: NavItem[]) => void = (items) => {
      items.forEach((item) => {
        allKeys.push(item.key)
        if (item.children) collectKeys(item.children)
      })
    }

    collectKeys(navigation)

    const uniqueKeys: Set<string> = new Set(allKeys)
    expect(uniqueKeys.size).toBe(allKeys.length)
  })

  it('all children should have parentKey matching their parent', () => {
    navigation.forEach((parent) => {
      parent.children?.forEach((child) => {
        expect(child.parentKey).toBe(parent.key)
      })
    })
  })

  it('all roles should be valid', () => {
    const validRoles: string[] = ['admin', 'editor', 'view']

    const checkRoles: (items: NavItem[]) => void = (items) => {
      items.forEach((item) => {
        if (item.roles) {
          item.roles.forEach((role) => expect(validRoles).toContain(role))
        }
        if (item.children) checkRoles(item.children)
      })
    }

    checkRoles(navigation)
  })

  it('optional fields should exist if present', () => {
    navigation.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          expect(child.key).toBeDefined()
          expect(child.name).toBeDefined()
          expect(child.icon).toBeDefined()
        })
      }
    })
  })
})