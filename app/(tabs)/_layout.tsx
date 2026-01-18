import { FinancialProvider } from '@/src/contexts/FinanciialContext';
import { Stack } from "expo-router";
export default function TabsLayout() {
  return (
    <FinancialProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </FinancialProvider>
  );
}
