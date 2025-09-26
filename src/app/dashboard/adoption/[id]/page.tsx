"use client";

import { AdoptionDetails } from "@/components/adoption/AdoptionDetails";
import * as React from "react";


const AdoptionPage = ({params}: {params: Promise<{id: string}>}) => {
  const {id} = React.use(params);

  return <AdoptionDetails adoptionId={id} />;
};

export default AdoptionPage;