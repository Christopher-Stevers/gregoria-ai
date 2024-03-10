import ProfileDialog from "./ProfileDialog";

import { getServerAuthSession } from "~/server/auth";

const Profile = async () => {
  const session = await getServerAuthSession();
  return <ProfileDialog session={session} />;
};

export default Profile;
