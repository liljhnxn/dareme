export enum DareStatus {
  OPEN = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
}

export type DareCategory = "Fun" | "Knowledge" | "Gaming" | "Fitness";

export interface Dare {
  id: bigint;
  creator: `0x${string}`;
  participant: `0x${string}`;
  title: string;
  description: string;
  category: DareCategory | string;
  createdAt: bigint;
  completedAt: bigint;
  status: DareStatus;
}

