import { useState, useMemo } from 'react';

export default function usePasswordToggle(initialValue = {}) {
  const [shwoPassword, setShowPassword] = useState(initialValue);

  const onPasswordToggle = (name) => {
    setShowPassword({
      ...shwoPassword,
      [`${name}`]: shwoPassword?.[`${name}`] ? !shwoPassword?.[`${name}`] : true,
    });
  };

  return useMemo(() => ({
    onPasswordToggle,
    shwoPassword,
  }));
}
