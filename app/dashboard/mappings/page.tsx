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
import { Spinner } from '@/components/ui/spinner';
import { Plus, ArrowLeft, Home } from 'lucide-react';
import {
  Model,
  ModelFormData,
  Exterior,
  ExteriorFormData,
  Option,
  OptionFormData,
  CostItem,
  CostItemFormData,
  ExteriorCostItem,
  ExteriorCostItemFormData,
} from '@/lib/types';

// Import all our components
import { ModelForm } from '@/components/model-form';
import { ModelList } from '@/components/model-list';
import { ExteriorForm } from '@/components/exterior-form';
import { ExteriorList } from '@/components/exterior-list';
import { OptionForm } from '@/components/option-form';
import { OptionList } from '@/components/option-list';
import { CostItemForm } from '@/components/cost-item-form';
import { CostItemList } from '@/components/cost-item-list';
import { ExteriorCostItemForm } from '@/components/exterior-cost-item-form';
import { ExteriorCostItemList } from '@/components/exterior-cost-item-list';

type ViewLevel = 'models' | 'exteriors' | 'options' | 'costItems' | 'exteriorCostItems';

export default function MappingsPage() {
  const [currentView, setCurrentView] = useState<ViewLevel>('models');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedExterior, setSelectedExterior] = useState<Exterior | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const [models, setModels] = useState<Model[]>([]);
  const [exteriors, setExteriors] = useState<Exterior[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [exteriorCostItems, setExteriorCostItems] = useState<ExteriorCostItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'model' | 'exterior' | 'option' | 'costItem' | 'exteriorCostItem'>(
    'model'
  );
  const [editingItem, setEditingItem] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // Fetch models
  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/models?includeExteriors=true');
      if (!response.ok) throw new Error('Failed to fetch models');
      const data = await response.json();
      setModels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch exteriors for a model
  const fetchExteriors = useCallback(async (modelId: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/exteriors?modelId=${modelId}&includeOptions=true&includeExteriorCostItems=true`);
      if (!response.ok) throw new Error('Failed to fetch exteriors');
      const data = await response.json();
      setExteriors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch options for an exterior
  const fetchOptions = useCallback(async (exteriorId: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/options?exteriorId=${exteriorId}&includeCostItems=true`);
      if (!response.ok) throw new Error('Failed to fetch options');
      const data = await response.json();
      setOptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch cost items for an option
  const fetchCostItems = useCallback(async (optionId: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/cost-items?optionId=${optionId}`);
      if (!response.ok) throw new Error('Failed to fetch cost items');
      const data = await response.json();
      setCostItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch exterior cost items for an exterior
  const fetchExteriorCostItems = useCallback(async (exteriorId: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/exterior-cost-items?exteriorId=${exteriorId}`);
      if (!response.ok) throw new Error('Failed to fetch exterior cost items');
      const data = await response.json();
      setExteriorCostItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Navigation handlers
  const navigateToModels = () => {
    setCurrentView('models');
    setSelectedModel(null);
    setSelectedExterior(null);
    setSelectedOption(null);
    fetchModels();
  };

  const navigateToExteriors = (model: Model) => {
    setSelectedModel(model);
    setCurrentView('exteriors');
    setSelectedExterior(null);
    setSelectedOption(null);
    fetchExteriors(model.id);
  };

  const navigateToOptions = (exterior: Exterior) => {
    setSelectedExterior(exterior);
    setCurrentView('options');
    setSelectedOption(null);
    fetchOptions(exterior.id);
  };

  const navigateToCostItems = (option: Option) => {
    setSelectedOption(option);
    setCurrentView('costItems');
    fetchCostItems(option.id);
  };

  const navigateToExteriorCostItems = (exterior: Exterior) => {
    setSelectedExterior(exterior);
    setCurrentView('exteriorCostItems');
    fetchExteriorCostItems(exterior.id);
  };

  const goBack = () => {
    if (currentView === 'costItems') {
      setCurrentView('options');
      setSelectedOption(null);
      if (selectedExterior) fetchOptions(selectedExterior.id);
    } else if (currentView === 'exteriorCostItems') {
      setCurrentView('exteriors');
      setSelectedExterior(null);
      if (selectedModel) fetchExteriors(selectedModel.id);
    } else if (currentView === 'options') {
      setCurrentView('exteriors');
      setSelectedExterior(null);
      if (selectedModel) fetchExteriors(selectedModel.id);
    } else if (currentView === 'exteriors') {
      navigateToModels();
    }
  };

  // Dialog handlers
  const openDialog = (
    type: 'model' | 'exterior' | 'option' | 'costItem' | 'exteriorCostItem',
    editItem?: any
  ) => {
    setDialogType(type);
    setEditingItem(editItem || null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  // CRUD handlers for Models
  const handleSubmitModel = async (data: ModelFormData) => {
    try {
      if (editingItem) {
        const response = await fetch(`/api/models/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update model');
        await fetchModels();
      } else {
        const response = await fetch('/api/models', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create model');
        }
        await fetchModels();
      }
      closeDialog();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      const response = await fetch(`/api/models/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete model');
      await fetchModels();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // CRUD handlers for Exteriors
  const handleSubmitExterior = async (data: ExteriorFormData) => {
    try {
      if (editingItem) {
        const response = await fetch(`/api/exteriors/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: data.name }),
        });
        if (!response.ok) throw new Error('Failed to update exterior');
        if (selectedModel) await fetchExteriors(selectedModel.id);
      } else {
        const response = await fetch('/api/exteriors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create exterior');
        }
        if (selectedModel) await fetchExteriors(selectedModel.id);
      }
      closeDialog();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteExterior = async (id: string) => {
    try {
      const response = await fetch(`/api/exteriors/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete exterior');
      if (selectedModel) await fetchExteriors(selectedModel.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // CRUD handlers for Options
  const handleSubmitOption = async (data: OptionFormData) => {
    try {
      if (editingItem) {
        const response = await fetch(`/api/options/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: data.name }),
        });
        if (!response.ok) throw new Error('Failed to update option');
        if (selectedExterior) await fetchOptions(selectedExterior.id);
      } else {
        const response = await fetch('/api/options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create option');
        }
        if (selectedExterior) await fetchOptions(selectedExterior.id);
      }
      closeDialog();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteOption = async (id: string) => {
    try {
      const response = await fetch(`/api/options/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete option');
      if (selectedExterior) await fetchOptions(selectedExterior.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // CRUD handlers for Cost Items
  const handleSubmitCostItem = async (data: CostItemFormData) => {
    try {
      if (editingItem) {
        const response = await fetch(`/api/cost-items/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ btName: data.btName, costGroup: data.costGroup }),
        });
        if (!response.ok) throw new Error('Failed to update cost item');
        if (selectedOption) await fetchCostItems(selectedOption.id);
      } else {
        const response = await fetch('/api/cost-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create cost item');
        }
        if (selectedOption) await fetchCostItems(selectedOption.id);
      }
      closeDialog();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteCostItem = async (id: string) => {
    try {
      const response = await fetch(`/api/cost-items/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete cost item');
      if (selectedOption) await fetchCostItems(selectedOption.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // CRUD handlers for Exterior Cost Items
  const handleSubmitExteriorCostItem = async (data: ExteriorCostItemFormData) => {
    try {
      if (editingItem) {
        const response = await fetch(`/api/exterior-cost-items/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ btName: data.btName, costGroup: data.costGroup, isDefault: data.isDefault }),
        });
        if (!response.ok) throw new Error('Failed to update exterior cost item');
        if (selectedExterior) await fetchExteriorCostItems(selectedExterior.id);
      } else {
        const response = await fetch('/api/exterior-cost-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create exterior cost item');
        }
        if (selectedExterior) await fetchExteriorCostItems(selectedExterior.id);
      }
      closeDialog();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteExteriorCostItem = async (id: string) => {
    try {
      const response = await fetch(`/api/exterior-cost-items/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete exterior cost item');
      if (selectedExterior) await fetchExteriorCostItems(selectedExterior.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Breadcrumb component
  const Breadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <button onClick={navigateToModels} className="hover:text-foreground flex items-center gap-1">
        <Home className="h-4 w-4" />
        Models
      </button>
      {selectedModel && (
        <>
          <span>/</span>
          <button
            onClick={() => navigateToExteriors(selectedModel)}
            className="hover:text-foreground"
          >
            {selectedModel.name}
          </button>
        </>
      )}
      {selectedExterior && (
        <>
          <span>/</span>
          <button
            onClick={() => navigateToOptions(selectedExterior)}
            className="hover:text-foreground"
          >
            {selectedExterior.name}
          </button>
        </>
      )}
      {selectedOption && (
        <>
          <span>/</span>
          <span className="text-foreground">{selectedOption.name}</span>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mapping Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Configure your hierarchical mapping structure: Model → Exterior → Option → Cost Items
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Breadcrumb Navigation */}
      {currentView !== 'models' && <Breadcrumb />}

      {/* Models View */}
      {currentView === 'models' && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Models</h2>
            <Button onClick={() => openDialog('model')}>
              <Plus className="h-4 w-4" />
              Add Model
            </Button>
          </div>
          {isLoading && models.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Spinner />
                  <p className="text-muted-foreground">Loading models...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ModelList
              models={models}
              onEdit={(model) => openDialog('model', model)}
              onDelete={handleDeleteModel}
              onSelect={navigateToExteriors}
              isLoading={isLoading}
            />
          )}
        </>
      )}

      {/* Exteriors View */}
      {currentView === 'exteriors' && selectedModel && (
        <>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1 flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Exteriors for {selectedModel.name}
              </h2>
              <Button onClick={() => openDialog('exterior')}>
                <Plus className="h-4 w-4" />
                Add Exterior
              </Button>
            </div>
          </div>
          <ExteriorList
            exteriors={exteriors}
            onEdit={(exterior) => openDialog('exterior', exterior)}
            onDelete={handleDeleteExterior}
            onSelect={navigateToOptions}
            onManageCosts={navigateToExteriorCostItems}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Options View */}
      {currentView === 'options' && selectedExterior && (
        <>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1 flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Options for {selectedExterior.name}
              </h2>
              <Button onClick={() => openDialog('option')}>
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>
          </div>
          <OptionList
            options={options}
            onEdit={(option) => openDialog('option', option)}
            onDelete={handleDeleteOption}
            onSelect={navigateToCostItems}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Cost Items View */}
      {currentView === 'costItems' && selectedOption && (
        <>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1 flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Cost Items for {selectedOption.name}
              </h2>
              <Button onClick={() => openDialog('costItem')}>
                <Plus className="h-4 w-4" />
                Add Cost Item
              </Button>
            </div>
          </div>
          <CostItemList
            costItems={costItems}
            onEdit={(costItem) => openDialog('costItem', costItem)}
            onDelete={handleDeleteCostItem}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Exterior Cost Items View */}
      {currentView === 'exteriorCostItems' && selectedExterior && (
        <>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1 flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Cost Items for {selectedExterior.name}
              </h2>
              <Button onClick={() => openDialog('exteriorCostItem')}>
                <Plus className="h-4 w-4" />
                Add Cost Item
              </Button>
            </div>
          </div>
          <ExteriorCostItemList
            exteriorCostItems={exteriorCostItems}
            onEdit={(exteriorCostItem) => openDialog('exteriorCostItem', exteriorCostItem)}
            onDelete={handleDeleteExteriorCostItem}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Dialog for Create/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Create'}{' '}
              {dialogType === 'model' && 'Model'}
              {dialogType === 'exterior' && 'Exterior'}
              {dialogType === 'option' && 'Option'}
              {dialogType === 'costItem' && 'Cost Item'}
              {dialogType === 'exteriorCostItem' && 'Exterior Cost Item'}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? `Update the ${dialogType === 'exteriorCostItem' ? 'exterior cost item' : dialogType}`
                : `Add a new ${dialogType === 'exteriorCostItem' ? 'exterior cost item' : dialogType} to the hierarchy`}
            </DialogDescription>
          </DialogHeader>

          {dialogType === 'model' && (
            <ModelForm
              initialData={editingItem}
              onSubmit={handleSubmitModel}
              onCancel={closeDialog}
              isLoading={isLoading}
            />
          )}

          {dialogType === 'exterior' && selectedModel && (
            <ExteriorForm
              initialData={editingItem}
              modelId={selectedModel.id}
              onSubmit={handleSubmitExterior}
              onCancel={closeDialog}
              isLoading={isLoading}
            />
          )}

          {dialogType === 'option' && selectedExterior && (
            <OptionForm
              initialData={editingItem}
              exteriorId={selectedExterior.id}
              onSubmit={handleSubmitOption}
              onCancel={closeDialog}
              isLoading={isLoading}
            />
          )}

          {dialogType === 'costItem' && selectedOption && (
            <CostItemForm
              initialData={editingItem}
              optionId={selectedOption.id}
              onSubmit={handleSubmitCostItem}
              onCancel={closeDialog}
              isLoading={isLoading}
            />
          )}

          {dialogType === 'exteriorCostItem' && selectedExterior && (
            <ExteriorCostItemForm
              initialData={editingItem}
              exteriorId={selectedExterior.id}
              onSubmit={handleSubmitExteriorCostItem}
              onCancel={closeDialog}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
