'use client';

import { Exterior } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExteriorListProps {
  exteriors: Exterior[];
  onEdit: (exterior: Exterior) => void;
  onDelete: (id: string) => void;
  onSelect: (exterior: Exterior) => void;
  onManageCosts?: (exterior: Exterior) => void;
  isLoading?: boolean;
}

export function ExteriorList({
  exteriors,
  onEdit,
  onDelete,
  onSelect,
  onManageCosts,
  isLoading,
}: ExteriorListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading exteriors...</p>
        </CardContent>
      </Card>
    );
  }

  if (exteriors.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No exteriors yet. Create your first exterior for this model.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {exteriors.map((exterior) => (
        <Card key={exterior.id} className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{exterior.name}</CardTitle>
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary">{exterior?.options?.length || 0} Option(s)</Badge>
              <Badge variant="outline">{exterior?.exteriorCostItems?.length || 0} Cost Item(s)</Badge>
            </div>

          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onSelect(exterior)}
                >
                  View Options
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                {onManageCosts && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onManageCosts(exterior)}
                  >
                    Manage Costs
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(exterior)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete "${exterior.name}"? This will also delete all associated options and cost items.`
                      )
                    ) {
                      onDelete(exterior.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
