"use client";

import { useModel } from "@/hooks/use-model";
import MatchModel from "../models/Match.Model";

const ModalProvider = () => {
  const { modelType, instanceId } = useModel();
  if (modelType === null) return null;

  return (
    <>
      <MatchModel key={instanceId} />
    </>
  );
};

export default ModalProvider;
