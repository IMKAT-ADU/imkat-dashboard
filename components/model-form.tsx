'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ModelFormData, Model } from '@/lib/types';

interface ModelFormProps {
  initialData?: Model;
  onSubmit: (data: ModelFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ModelForm({ initialData, onSubmit, onCancel, isLoading }: ModelFormProps) {
  const [formData, setFormData] = useState<ModelFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Model name is required');
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
        <Label htmlFor="name">Model Name*</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., C1 Model 1188 Sq Ft"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading || isSubmitting || !!initialData}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="e.g., Standard single-story model"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isLoading || isSubmitting}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Model' : 'Create Model'}
        </Button>
      </div>
    </form>
  );
}
