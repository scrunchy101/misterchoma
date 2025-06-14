
import React from "react";
import { CleanPOSPage } from "@/components/pos/CleanPOSPage";
import { SimplePOSProvider } from "@/components/pos/SimplePOSSystem";

const POS: React.FC = () => {
  return (
    <SimplePOSProvider>
      <CleanPOSPage />
    </SimplePOSProvider>
  );
};

export default POS;
