'use client';

import { Model } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModelListProps {
  models: Model[];
  onEdit: (model: Model) => void;
  onDelete: (id: string) => void;
  onSelect: (model: Model) => void;
  isLoading?: boolean;
}

export function ModelList({ models, onEdit, onDelete, onSelect, isLoading }: ModelListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading models...</p>
        </CardContent>
      </Card>
    );
  }

  if (models.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No models yet. Create your first model to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <Card key={model.id} className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{model.name}</CardTitle>
                {model.description && (
                  <CardDescription className="mt-1.5">{model.description}</CardDescription>
                )}
              </div>
            </div>

            <div className="mt-2">
              <Badge variant="secondary">{model?.exteriors?.length || 0} Exterior(s)</Badge>
            </div>

          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer"
                onClick={() => onSelect(model)}
              >
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(model)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    confirm(
                      `Are you sure you want to delete "${model.name}"? This will also delete all associated exteriors, options, and cost items.`
                    )
                  ) {
                    onDelete(model.id);
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
