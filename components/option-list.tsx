'use client';

import { Option } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OptionListProps {
  options: Option[];
  onEdit: (option: Option) => void;
  onDelete: (id: string) => void;
  onSelect: (option: Option) => void;
  isLoading?: boolean;
}

export function OptionList({ options, onEdit, onDelete, onSelect, isLoading }: OptionListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading options...</p>
        </CardContent>
      </Card>
    );
  }

  if (options.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No options yet. Create your first option for this exterior.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <Card key={option.id} className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{option.name}</CardTitle>
            </div>
            <div className="mt-2">
              <Badge variant="secondary">{option?.costItems?.length || 0} Cost Item(s)</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onSelect(option)}
              >
                Manage Costs
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(option)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    confirm(
                      `Are you sure you want to delete "${option.name}"? This will also delete all associated cost items.`
                    )
                  ) {
                    onDelete(option.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
