import Profile from "./profile";

const NavBar = () => {
  return (
    <div className="bg-accent flex content-center items-center justify-between p-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem]">
        Gregoria <span className="text-hot">AI</span>
      </h1>
      <Profile />
    </div>
  );
};

export default NavBar;
