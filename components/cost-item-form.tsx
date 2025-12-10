'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CostItemFormData, CostItem } from '@/lib/types';

interface CostItemFormProps {
  initialData?: CostItem;
  optionId: string;
  onSubmit: (data: CostItemFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CostItemForm({
  initialData,
  optionId,
  onSubmit,
  onCancel,
  isLoading,
}: CostItemFormProps) {
  const [formData, setFormData] = useState<CostItemFormData>({
    btName: initialData?.btName || '',
    costGroup: initialData?.costGroup || false,
    isDefault: initialData?.isDefault || false,
    optionId: optionId,
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.btName.trim()) {
        throw new Error('BT name is required');
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
        <Label htmlFor="btName">BuilderTrend Name*</Label>
        <Input
          id="btName"
          type="text"
          placeholder="e.g., Kitchen Cabinets - Premium"
          value={formData.btName}
          onChange={(e) => setFormData({ ...formData, btName: e.target.value })}
          disabled={isLoading || isSubmitting}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="costGroup"
          checked={formData.costGroup}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, costGroup: checked as boolean })
          }
          disabled={isLoading || isSubmitting}
        />
        <Label htmlFor="costGroup" className="cursor-pointer">
          This is a Cost Group (not a single item)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isDefault: checked as boolean })
          }
          disabled={isLoading || isSubmitting}
        />
        <Label htmlFor="isDefault" className="cursor-pointer">
          This is a Default (used when option is NOT selected)
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Cost Item' : 'Add Cost Item'}
        </Button>
      </div>
    </form>
  );
}
