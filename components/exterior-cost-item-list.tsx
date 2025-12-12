'use client';

import { ExteriorCostItem } from '@/lib/types';
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

interface ExteriorCostItemListProps {
  exteriorCostItems: ExteriorCostItem[];
  onEdit: (exteriorCostItem: ExteriorCostItem) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ExteriorCostItemList({ exteriorCostItems, onEdit, onDelete, isLoading }: ExteriorCostItemListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading cost items...</p>
        </CardContent>
      </Card>
    );
  }

  if (exteriorCostItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No cost items yet. Add cost items or cost groups that this exterior maps to.
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
            {exteriorCostItems.map((exteriorCostItem) => (
              <TableRow key={exteriorCostItem.id}>
                <TableCell className="font-medium">{exteriorCostItem.btName}</TableCell>
                <TableCell>
                  <Badge variant={exteriorCostItem.costGroup ? 'default' : 'secondary'}>
                    {exteriorCostItem.costGroup ? 'Cost Group' : 'Cost Item'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={exteriorCostItem.isDefault ? 'outline' : 'default'}>
                    {exteriorCostItem.isDefault ? 'Default (when NOT selected)' : 'When Selected'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => onEdit(exteriorCostItem)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete "${exteriorCostItem.btName}"?`
                          )
                        ) {
                          onDelete(exteriorCostItem.id);
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
