
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FoodDetailProps {
  food: {
    _id?: string;
    id?: string;
    name: string;
    calories: number;
    serving_size_g: number;
    fat_g: number;
    carbs_g: number;
    protein_g: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
    barcode?: string;
    source?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const FoodDetailModal = ({ food, isOpen, onClose }: FoodDetailProps) => {
  if (!food) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{food.name}</DialogTitle>
          <DialogDescription>Nutrition information per {food.serving_size_g}g serving</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Calories</div>
              <div className="text-lg font-semibold">{food.calories} kcal</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Fat</div>
              <div className="text-lg font-semibold">{food.fat_g}g</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Carbs</div>
              <div className="text-lg font-semibold">{food.carbs_g}g</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Protein</div>
              <div className="text-lg font-semibold">{food.protein_g}g</div>
            </div>
          </div>
          
          {(food.fiber_g !== undefined || food.sugar_g !== undefined || food.sodium_mg !== undefined) && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Additional Information</h3>
              <div className="grid grid-cols-3 gap-2">
                {food.fiber_g !== undefined && (
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Fiber</div>
                    <div className="font-medium">{food.fiber_g}g</div>
                  </div>
                )}
                {food.sugar_g !== undefined && (
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Sugar</div>
                    <div className="font-medium">{food.sugar_g}g</div>
                  </div>
                )}
                {food.sodium_mg !== undefined && (
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Sodium</div>
                    <div className="font-medium">{food.sodium_mg}mg</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {food.barcode && (
            <div className="mt-4 px-4 py-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500">Barcode</div>
              <div className="font-mono text-sm">{food.barcode}</div>
            </div>
          )}
          
          {food.source && (
            <div className="mt-2 text-right text-xs text-gray-400">
              Source: {food.source}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodDetailModal;
