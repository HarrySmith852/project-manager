import React from 'react'
import Container from '@/components/shared/Container'

export default function DepartmentsPage() {
    return (
        <Container>
            <div className="flex items-center justify-between mb-4">
                <h3>Departments</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <p>Manage organizational departments from this module.</p>
            </div>
        </Container>
    )
}
