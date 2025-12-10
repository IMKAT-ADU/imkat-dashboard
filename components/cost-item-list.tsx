'use client';

import { CostItem } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CostItemListProps {
  costItems: CostItem[];
  onEdit: (costItem: CostItem) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function CostItemList({ costItems, onEdit, onDelete, isLoading }: CostItemListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading cost items...</p>
        </CardContent>
      </Card>
    );
  }

  if (costItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No cost items yet. Add cost items or cost groups that this option maps to.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>BuilderTrend Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Behavior</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costItems.map((costItem) => (
              <TableRow key={costItem.id}>
                <TableCell className="font-medium">{costItem.btName}</TableCell>
                <TableCell>
                  <Badge variant={costItem.costGroup ? 'default' : 'secondary'}>
                    {costItem.costGroup ? 'Cost Group' : 'Cost Item'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={costItem.isDefault ? 'outline' : 'default'}>
                    {costItem.isDefault ? 'Default (when NOT selected)' : 'When Selected'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => onEdit(costItem)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete "${costItem.btName}"?`
                          )
                        ) {
                          onDelete(costItem.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
