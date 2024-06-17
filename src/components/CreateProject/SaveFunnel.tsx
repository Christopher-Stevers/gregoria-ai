"use client";
import { FolderArrowDownIcon } from "@heroicons/react/24/solid";
import { useTeam } from "~/providers/TeamProvider";
import type { FunnelTemplateType } from "~/server/db/static";
import { api } from "~/trpc/react";

const SaveFunnel = ({
  funnelTemplate,
  threadId,
  funnelName,
}: {
  funnelTemplate: FunnelTemplateType | null;
  threadId: string;
  funnelName: string;
}) => {
  const { teamId, userId } = useTeam();
  const { mutate: createFunnelTemplate } =
    api.funnelTemplate.create.useMutation();
  const handleSave = async () => {
    if (!funnelTemplate) return;
    createFunnelTemplate({
      name: funnelName,
      funnelTemplate: funnelTemplate,
      creatorThreadId: threadId,
      userId,
      teamId,
    });
  };
  return (
    <button disabled={!funnelTemplate} onClick={handleSave}>
      <FolderArrowDownIcon className="lg-icon text-hot" />
    </button>
  );
};

export default SaveFunnel;
