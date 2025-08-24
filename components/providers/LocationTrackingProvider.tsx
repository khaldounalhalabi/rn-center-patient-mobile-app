import React, { ReactNode, useEffect } from "react";
import useBackgroundLocation from "@/hooks/useBackgroundLocation";

const LocationTrackingProvider = ({ children }: { children?: ReactNode }) => {
  const trackLocation = useBackgroundLocation();

  useEffect(() => {
    trackLocation();
  }, []);
  
  return <>{children}</>;
};

export default LocationTrackingProvider;
