import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import DepartmentListTable from './_components/DepartmentListTable'
import DepartmentListActionTools from './_components/DepartmentListActionTools'

export default function DepartmentsPage() {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <h3>Departments</h3>
                            <p className="mt-1 text-gray-500">Manage organizational departments from this module.</p>
                        </div>
                        <DepartmentListActionTools />
                    </div>
                    <DepartmentListTable />
                </div>
            </AdaptiveCard>
        </Container>
    )
}
