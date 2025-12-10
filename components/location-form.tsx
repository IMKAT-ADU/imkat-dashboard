'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Location } from '@/lib/types';

const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  markup: z.number().min(0, 'Markup must be 0 or greater'),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface LocationFormProps {
  onSubmit: (data: LocationFormData) => Promise<void>;
  initialData?: Location;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function LocationForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: LocationFormProps) {
  const [submitError, setSubmitError] = useState<string>('');

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          markup: initialData.markup,
        }
      : {
          name: '',
          markup: 0,
        },
  });

  const handleSubmit = async (data: LocationFormData) => {
    setSubmitError('');
    try {
      await onSubmit(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setSubmitError(message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {submitError && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
            {submitError}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Sacramento, Los Angeles"
                  disabled={isLoading || !!initialData}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The name of the location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="markup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Markup %</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    step="0.01"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                  <span className="absolute right-3 top-2.5 text-muted-foreground pointer-events-none">
                    %
                  </span>
                </div>
              </FormControl>
              <FormDescription>
                The markup percentage for this location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update Location' : 'Add Location'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
