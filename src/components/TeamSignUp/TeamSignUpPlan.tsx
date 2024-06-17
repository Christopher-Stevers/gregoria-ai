import type { TeamPlan } from "./TeamPlans";
import H3 from "../base/h3";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const TeamSignUpPlan = async ({ plan }: { plan: TeamPlan }) => {
  const session = await getServerAuthSession();
  const handleSignUp = async () => {
    "use server";
    await api.team.create.mutate({
      name: `${session?.user?.name}'s team`,
      userId: session?.user?.id,
    });
  };
  return (
    <div className="flex w-72 flex-col gap-4 rounded-md border-text p-4 ">
      <div className="self-center py-4 text-4xl font-extrabold">
        {plan.hasPrice ? `$${plan.price}/mo` : "Contact"}
      </div>

      <H3 className="text-hot">{plan.name}</H3>

      <p>{plan.description}</p>
      <ul className="list-style-default">
        {plan.feature.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <div className="flex-1"></div>
      <form>
        <button
          formAction={handleSignUp}
          className="bg-accent h-min w-full self-end justify-self-end rounded-md border-2  border-hot p-2 text-center leading-tight"
        >
          <span>Sign Up</span>
        </button>
      </form>
    </div>
  );
};

export default TeamSignUpPlan;
