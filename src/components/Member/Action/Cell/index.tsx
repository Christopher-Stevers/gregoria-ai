import Input from "~/components/base/input";
import Dropdown from "../Dropdown";
import {
  type TemplateActionType,
  type TemplateStepType,
} from "~/server/db/funnel";
import { useIsLive } from "~/app/member/[funnelName]/page";
import { useTeam } from "~/providers/TeamProvider";

import { api } from "~/trpc/react";
type TemplateStatusType = TemplateActionType["statusTemplates"][0];

const Cell = ({
  templateStatus,
  canHaveParent,
  parent,
}: {
  templateStatus: TemplateStatusType;
  canHaveParent: boolean;
  parent?: TemplateStepType & { id: number };
}) => {
  const { teamId, userId } = useTeam();
  const isLive = useIsLive();

  const { data: statusCount, isLoading } = api.status.get.useQuery(
    {
      statusTemplateId: templateStatus.id!,
      teamId,
      userId,
    },
    { initialData: 0 },
  );
  const utils = api.useUtils();
  const setStatefulCount = (value: number) => {
    console.log(typeof value, value, "value");
    utils.status.get.setData(
      { statusTemplateId: templateStatus.id!, teamId, userId },
      value,
    );
  };

  const { mutate } = api.status.create.useMutation();

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
    if (isLive && statusTemplateId) {
      mutate({
        teamId,
        userId,
        statusTemplateId,
        quantity: valChange,
        parentActionId: parent?.id,
      });
    }
  };

  const editingOptions = {
    teamId,
    userId,
    statusTemplateId: templateStatus.id,
    statusCount,
    isLive,
  };

  const handleOneUp = () => {
    const newStatusCount = statusCount + 1;
    if (!canHaveParent && newStatusCount) {
      setStatefulCount(newStatusCount);
      handleEditCell(newStatusCount, editingOptions).catch(console.error);
    }
  };
  const handleOneDown = () => {
    const newStatusCount = statusCount - 1;
    if (newStatusCount) {
      setStatefulCount(newStatusCount);
      handleEditCell(newStatusCount, editingOptions).catch(console.error);
    }
  };

  const items =
    parent?.actionTemplates?.map((action) => {
      return {
        name: action.name,
        onClick: () => {
          const newStatusCount = statusCount + 1;
          handleEditCell(newStatusCount, editingOptions).catch(console.error);
          setStatefulCount(newStatusCount);
        },
      };
    }) ?? [];

  return (
    <td
      key={templateStatus.name.concat("row")}
      className="  flex-1 rounded-md p-2"
    >
      <div className="relative flex gap-2">
        {canHaveParent ? (
          <Dropdown items={items}>
            <div className="bg-accent   h-6 w-6 border-2 border-main">
              <span className="relative -top-1"> +</span>
            </div>
          </Dropdown>
        ) : (
          <button
            onClick={handleOneUp}
            className="bg-accent   h-6 w-6 border-2 border-main"
          >
            <span className="relative -top-1"> +</span>
          </button>
        )}
        {!isLoading && (
          <>
            {canHaveParent ? (
              <div className="w-12">{statusCount}</div>
            ) : (
              <Input
                className="w-12 bg-transparent"
                value={statusCount?.toString() ?? ""}
                setValue={(val) => {
                  handleEditCell(parseInt(val, 10), editingOptions).catch(
                    console.error,
                  );
                  setStatefulCount(parseInt(val, 10));
                }}
              />
            )}
          </>
        )}
        <button
          onClick={handleOneDown}
          className="bg-accent   h-6 w-6 border-2 border-main"
        >
          <span className="relative -top-1"> -</span>
        </button>
      </div>
    </td>
  );
};

export default Cell;
