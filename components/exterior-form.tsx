'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExteriorFormData, Exterior } from '@/lib/types';

interface ExteriorFormProps {
  initialData?: Exterior;
  modelId: string;
  onSubmit: (data: ExteriorFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ExteriorForm({
  initialData,
  modelId,
  onSubmit,
  onCancel,
  isLoading,
}: ExteriorFormProps) {
  const [formData, setFormData] = useState<ExteriorFormData>({
    name: initialData?.name || '',
    modelId: modelId,
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Exterior name is required');
      }

      await onSubmit(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/5 border border-destructive text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Exterior Name*</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., Classic, Spanish, Farmhouse"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading || isSubmitting}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Exterior' : 'Create Exterior'}
        </Button>
      </div>
    </form>
  );
}
