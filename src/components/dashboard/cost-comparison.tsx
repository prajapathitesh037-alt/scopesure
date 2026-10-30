'use client';

import React from 'react';
import { DEMO_VENDORS } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';

export function CostComparison() {
  const vendorsWithPrice = DEMO_VENDORS.filter((v) => v.quotedPrice !== null);
  const maxPrice = Math.max(...vendorsWithPrice.map((v) => v.quotedPrice!));

  return (
    <div className="rounded-2xl bg-bg-card border border-border p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-text-primary mb-1">Cost Comparison</h3>
      <p className="text-xs text-text-secondary mb-5">Quoted prices by vendor</p>

      <div className="space-y-4">
        {DEMO_VENDORS.map((vendor) => {
          const price = vendor.quotedPrice;
          const percentage = price !== null && maxPrice > 0 ? (price / maxPrice) * 100 : 0;

          return (
            <div key={vendor.id}>
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: vendor.color }}
                  />
                  <span className="font-medium text-text-primary">{vendor.name}</span>
                </div>
                <span className="font-semibold text-text-primary tabular-nums">
                  {price !== null ? formatCurrency(price) : 'Not specified'}
                </span>
              </div>
              <div className="h-3 rounded-full bg-sage/40 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: vendor.color,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Price range</span>
          <span className="font-medium text-text-primary tabular-nums">
            {formatCurrency(Math.min(...vendorsWithPrice.map((v) => v.quotedPrice!)))} – {formatCurrency(maxPrice)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-text-secondary">
          <span>Difference</span>
          <span className="font-medium text-warning tabular-nums">
            {formatCurrency(maxPrice - Math.min(...vendorsWithPrice.map((v) => v.quotedPrice!)))}
          </span>
        </div>
      </div>
    </div>
  );
}
