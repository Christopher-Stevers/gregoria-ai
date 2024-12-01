"use client";

import { Dialog } from "@headlessui/react";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const ProfileDialog = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = async () => {
    console.log("signing in");
    await signIn("discord");
    console.log("signed in");
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div className="text-text">
      {
        <>
          {!session && <button onClick={handleSignIn}>Sign in</button>}
          {session && (
            <>
              <button
                onClick={() => {
                  setIsOpen(true);
                }}
                className=" flex gap-4"
              >
                <span>{session.user?.name}</span>
                <Image
                  width="24"
                  height="24"
                  className="rounded-full"
                  src={session.user?.image ?? ""}
                  alt="User image"
                />
              </button>
              <Dialog
                className={"fixed inset-0 bg-transparent"}
                open={isOpen}
                onClose={handleCloseModal}
              >
                <Dialog.Panel className=" modal right-0 top-12 ">
                  <button onClick={handleCloseModal}>Settings</button>
                  <button onClick={handleSignOut}>Sign Out</button>
                </Dialog.Panel>
              </Dialog>
            </>
          )}
        </>
      }
    </div>
  );
};

export default ProfileDialog;
