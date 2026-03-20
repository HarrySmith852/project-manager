import dashboardsNavigationConfig from './dashboards.navigation.config'
import conceptsNavigationConfig from './concepts.navigation.config'
import type { NavigationTree } from '@/@types/navigation'

const PROJECT_MANAGEMENT_DASHBOARD_KEYS = new Set([
    'dashboard.project',
    'dashboard.analytic',
])
const PROJECT_MANAGEMENT_CONCEPT_KEYS = new Set(['concepts.projects', 'concepts.departments'])

const projectManagementNavigationOnly: NavigationTree[] = [
    ...dashboardsNavigationConfig.map((section) => ({
        ...section,
        subMenu: section.subMenu.filter((item) =>
            PROJECT_MANAGEMENT_DASHBOARD_KEYS.has(item.key),
        ),
    })),
    ...conceptsNavigationConfig.map((section) => ({
        ...section,
        subMenu: section.subMenu.filter((item) =>
            PROJECT_MANAGEMENT_CONCEPT_KEYS.has(item.key),
        ),
    })),
]

const navigationConfig: NavigationTree[] = projectManagementNavigationOnly

export default navigationConfig
