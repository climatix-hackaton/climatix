import z from 'zod';

export const upgradeDto = z.object({
	userId: z.string(),
	type: z.enum(['up', 'down']),
	upgradeId: z.string(),
});

export type UpgradeDto = z.infer<typeof upgradeDto>;