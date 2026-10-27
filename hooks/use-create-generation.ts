"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createGeneration } from "@/requests/generations";
import { queryKeys } from "@/requests/query-keys";
import { rememberLead } from "@/utils/lead";
import { createWorkspaceHref } from "@/utils/generation-href";

export function useCreateGeneration() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: [...queryKeys.generations, "create"] as const,
    mutationFn: (prompt: string) => createGeneration(prompt, crypto.randomUUID()),
    onSuccess: async (generation) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.generations }),
        queryClient.invalidateQueries({ queryKey: queryKeys.quote }),
        queryClient.invalidateQueries({ queryKey: queryKeys.me }),
      ]);
      rememberLead("generation", null, generation.prompt);
      router.replace(createWorkspaceHref(generation.id));
    },
  });
}
