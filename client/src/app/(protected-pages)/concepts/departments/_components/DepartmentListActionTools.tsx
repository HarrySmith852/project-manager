'use client'

import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'

const DepartmentListActionTools = () => {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => alert('Add new department clicked')}
            >
                Add new
            </Button>
        </div>
    )
}

export default DepartmentListActionTools
