# Store Export Fixes

## Issue Fixed
The `lib/store.ts` was missing critical export functions that were being imported by `lib/use-sensor-data.ts`.

### Missing Exports
1. `setAlerts` - Function to set alerts in SWR cache
2. `setIsDemo` - Function to set demo mode flag in SWR cache

### Solution
Added the following functions to `lib/store.ts`:

```typescript
export function setAlerts(alerts: Alert[]) {
  mutate(ALERTS_KEY, alerts, { revalidate: false })
}

export function setIsDemo(isDemo: boolean) {
  mutate(DEMO_KEY, isDemo, { revalidate: false })
}
```

## Import Chain
- `app/dashboard/page.tsx` imports `useSensorData`
- `useSensorData` imports `{ setSensorReadings, setAlerts, setIsDemo }` from store
- Store now exports all three functions

## Console Error Resolution
✅ Export setIsDemo doesn't exist in target module - **FIXED**
✅ Export setAlerts doesn't exist in target module - **FIXED**

All imports from store.ts now resolve correctly.
