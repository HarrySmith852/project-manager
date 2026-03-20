'use client'

import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Department } from '../types'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    inactive: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const mockDepartments: Department[] = [
    { id: '1', name: 'Engineering', head: 'Alice Smith', memberCount: 42, status: 'active', description: 'Software and Hardware engineering' },
    { id: '2', name: 'Human Resources', head: 'Bob Johnson', memberCount: 12, status: 'active', description: 'HR and recruitment' },
    { id: '3', name: 'Marketing', head: 'Carol Williams', memberCount: 25, status: 'inactive', description: 'Product and Content marketing' },
    { id: '4', name: 'Sales', head: 'David Brown', memberCount: 30, status: 'active', description: 'Direct and Enterprise Sales' },
    { id: '5', name: 'Customer Support', head: 'Eve Davis', memberCount: 55, status: 'active', description: '24/7 Support and Success' },
    { id: '6', name: 'Finance', head: 'Frank Miller', memberCount: 8, status: 'active', description: 'Accounting and Financial Planning' },
    { id: '7', name: 'Legal', head: 'Grace Taylor', memberCount: 5, status: 'active', description: 'Corporate law and compliance' },
]

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const DepartmentListTable = () => {
    const [data] = useState<Department[]>(mockDepartments)

    const columns: ColumnDef<Department>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {row.name}
                        </div>
                    )
                },
            },
            {
                header: 'Description',
                accessorKey: 'description',
            },
            {
                header: 'Head',
                accessorKey: 'head',
            },
            {
                header: 'Members',
                accessorKey: 'memberCount',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.memberCount} Mbmrs</span>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag className={statusColor[row.status] || ''}>
                                <span className="capitalize">{row.status}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: () => (
                    <ActionColumn
                        onEdit={() => alert('Edit clicked')}
                        onViewDetail={() => alert('View clicked')}
                    />
                ),
            },
        ],
        [],
    )

    return (
        <DataTable
            columns={columns}
            data={data}
            noData={data.length === 0}
            pagingData={{
                total: data.length,
                pageIndex: 1,
                pageSize: 10,
            }}
        />
    )
}

export default DepartmentListTable
