"use client";

import { useState, useCallback } from "react";
import { useLoading } from "@/contexts/LoadingContext";

export const useFormLoading = (defaultMessage: string = "Processing...") => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const handleSubmit = useCallback(
    async (
      action: (formData: FormData) => Promise<void>,
      formData: FormData,
      loadingMessage?: string
    ) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      startLoading(loadingMessage || defaultMessage);

      try {
        await action(formData);
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
        stopLoading();
      }
    },
    [isSubmitting, startLoading, stopLoading, defaultMessage]
  );

  return {
    isSubmitting,
    handleSubmit,
  };
};
