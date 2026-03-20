export type Department = {
    id: string
    name: string
    head: string
    memberCount: number
    kpi: number
    status: 'active' | 'inactive'
    description: string
}
