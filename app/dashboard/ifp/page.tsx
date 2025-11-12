'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IFPMappingForm } from '@/components/ifp-mapping-form';
import { IFPMappingList } from '@/components/ifp-mapping-list';
import { IFPMappingFormData, IFPMappingResponse } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function IFPMapperPage() {
  const [mappings, setMappings] = useState<IFPMappingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<IFPMappingResponse | null>(null);
  const [error, setError] = useState<string>('');

  // Fetch all mappings
  const fetchMappings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ifp-mappings');
      if (!response.ok) {
        throw new Error('Failed to fetch mappings');
      }
      const data = await response.json();
      setMappings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error fetching mappings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  const handleOpenDialog = () => {
    setEditingMapping(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (mapping: IFPMappingResponse) => {
    setEditingMapping(mapping);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMapping(null);
  };

  const handleSubmit = async (data: IFPMappingFormData) => {
    setError('');
    try {
      if (editingMapping) {
        // Update existing mapping
        const response = await fetch(`/api/ifp-mappings/${editingMapping.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            btName: data.btName,
            costGroup: data.costGroup,
            locationMarkups: data.locationMarkups,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update mapping');
        }

        const updatedMapping = await response.json();
        setMappings((prev) =>
          prev.map((m) => (m.id === updatedMapping.id ? updatedMapping : m))
        );
      } else {
        // Create new mapping
        const response = await fetch('/api/ifp-mappings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create mapping');
        }

        const newMapping = await response.json();
        setMappings((prev) => [...prev, newMapping].sort((a, b) => a.ifpKey.localeCompare(b.ifpKey)));
      }

      handleCloseDialog();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      throw new Error(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ifp-mappings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete mapping');
      }

      setMappings((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IFP to BT Mapper</h1>
          <p className="text-muted-foreground mt-2">
            Configure mappings from IFP options to BT items with location-specific markups
          </p>
        </div>
        <Button onClick={handleOpenDialog} className="w-full md:w-auto">
          <Plus className="h-4 w-4" />
          Add Mapping
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Mappings List */}
      <IFPMappingList
        mappings={mappings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMapping ? 'Edit Mapping' : 'Create New Mapping'}
            </DialogTitle>
            <DialogDescription>
              {editingMapping
                ? `Update the mapping for "${editingMapping.ifpKey}"`
                : 'Add a new IFP to BT mapping with location-specific markups'}
            </DialogDescription>
          </DialogHeader>
          <IFPMappingForm
            initialData={editingMapping || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
