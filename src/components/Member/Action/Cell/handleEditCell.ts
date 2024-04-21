"use server";
import { api } from "~/trpc/server";

const handleEditCell = async (
  val: number,
  {
    statusCount,
    teamId,
    userId,
    statusTemplateId,
    isLive,
  }: {
    isLive: boolean;
    statusCount?: number;
    userId: string;
    teamId: number;
    statusTemplateId?: number;
  },
) => {
  const valChange = val - (statusCount ?? 0);
  console.log(valChange, "valChange");
  if (isLive && statusTemplateId) {
    await api.status.create.mutate({
      teamId,
      userId,
      statusTemplateId,
      quantity: valChange,
    });
  }
};

export default handleEditCell;
