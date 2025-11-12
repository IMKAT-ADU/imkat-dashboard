'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IFPMappingFormData, IFPMappingResponse } from '@/lib/types';
import { X } from 'lucide-react';

const locationMarkupSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  markup: z.number().min(0, 'Markup must be 0 or greater'),
});

const ifpMappingSchema = z.object({
  ifpKey: z.string().min(1, 'IFP key is required').toLowerCase(),
  btName: z.string().min(1, 'BT name is required'),
  costGroup: z.boolean().default(false),
  locationMarkups: z.array(locationMarkupSchema).default([]),
});

interface IFPMappingFormProps {
  onSubmit: (data: IFPMappingFormData) => Promise<void>;
  initialData?: IFPMappingResponse;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function IFPMappingForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: IFPMappingFormProps) {
  const [submitError, setSubmitError] = useState<string>('');

  const form = useForm<IFPMappingFormData>({
    resolver: zodResolver(ifpMappingSchema),
    defaultValues: initialData
      ? {
          ifpKey: initialData.ifpKey,
          btName: initialData.btName,
          costGroup: initialData.costGroup,
          locationMarkups: initialData.locationMarkups,
        }
      : {
          ifpKey: '',
          btName: '',
          costGroup: false,
          locationMarkups: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locationMarkups',
  });

  const handleSubmit = async (data: IFPMappingFormData) => {
    setSubmitError('');
    try {
      await onSubmit(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setSubmitError(message);
    }
  };

  const addLocationMarkup = () => {
    append({ name: '', markup: 0 });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {submitError && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="ifpKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFP Key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Patio, Garage Door"
                    disabled={isLoading || !!initialData}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The IFP option key this mapping applies to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="btName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BT Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Patio Upgrade"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The mapped BT name for this IFP option
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="costGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mapping Type</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={(value) => field.onChange(value === 'cost-group')}
                value={field.value ? 'cost-group' : 'cost-item'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cost-item">Cost Item</SelectItem>
                  <SelectItem value="cost-group">Cost Group</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Determines whether this is a cost group or cost item
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card className="bg-muted/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Location Markups</CardTitle>
                <CardDescription>
                  Add location-specific markup percentages
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLocationMarkup}
                disabled={isLoading}
              >
                + Add Location
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                No locations added yet. Click "Add Location" to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`locationMarkups.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className={index === 0 ? '' : 'invisible'}>
                            Location Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Sacramento, LA"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`locationMarkups.${index}.markup`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className={index === 0 ? '' : 'invisible'}>
                            Markup %
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="0"
                                step="0.01"
                                disabled={isLoading}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value) || 0)
                                }
                              />
                              <span className="absolute right-3 top-2.5 text-muted-foreground pointer-events-none">
                                %
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={isLoading}
                      className="mb-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
            {isLoading ? 'Saving...' : initialData ? 'Update Mapping' : 'Create Mapping'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
