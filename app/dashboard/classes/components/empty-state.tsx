'use client'

import { GraduationCap, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CreateClassDialog } from './create-class-dialog'

interface EmptyStateProps {
  searchTerm: string
}

export function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No classes found</h3>
        <p className="text-muted-foreground mb-4">
          {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first class.'}
        </p>
        {!searchTerm && (
          <CreateClassDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Class
            </Button>
          </CreateClassDialog>
        )}
      </CardContent>
    </Card>
  )
}
