import { TeamPlans } from "./TeamPlans";
import TeamSignUpPlan from "./TeamSignUpPlan";

const TeamSignUp = () => {
  return (
    <div className="flex w-full justify-center py-12">
      <div className=" flex  max-w-6xl flex-col gap-12">
        Looks like you don{"'"}t belong to a team yet, sign up today!
        <div className="flex w-full flex-wrap justify-center gap-12 ">
          {TeamPlans.map((plan) => (
            <TeamSignUpPlan key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSignUp;
