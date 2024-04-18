"use client";
import { FolderArrowDownIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useTeam, useUser } from "~/providers/TeamProvider";
import type { FunnelTemplateType } from "~/server/db/funnel";
import { api } from "~/trpc/react";

const SaveFunnel = ({
  funnelTemplate,
  threadId,
}: {
  funnelTemplate: FunnelTemplateType | null;
  threadId: string;
}) => {
  const team = useTeam();
  const user = useUser();
  const { mutate: createFunnelTemplate } =
    api.funnelTemplate.create.useMutation();
  const handleSave = async () => {
    console.log(team, "mine", user);
    if (!funnelTemplate) return;
    createFunnelTemplate({
      funnelTemplate: funnelTemplate,
      creatorThreadId: threadId,
      userId: user.id,
      teamId: team.id,
    });
  };
  return (
    <button disabled={!funnelTemplate} onClick={handleSave}>
      <FolderArrowDownIcon className="lg-icon text-hot" />
    </button>
  );
};

export default SaveFunnel;
