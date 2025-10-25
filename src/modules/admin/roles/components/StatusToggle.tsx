import { Switch } from '@/shared/components/ui/switch';
import { useState, useEffect } from 'react';

interface StatusToggleProps {
  userId: string
}

export function StatusToggle({ userId }: StatusToggleProps) {
  const [isActive, setIsActive] = useState(userId === "INACTIVO");

  useEffect(() => {
    setIsActive(userId === "INACTIVO");
  }, [userId]);

  console.log(isActive)
  console.log(userId)



  return (
    <Switch checked={isActive} onCheckedChange={setIsActive} />
  );
}