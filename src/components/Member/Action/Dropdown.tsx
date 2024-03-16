import type { ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";

const Dropdown = ({
  children,
  items,
}: {
  children: ReactNode | ReactNode[];
  items: { name: string; onClick: () => void }[];
}) => {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button>{children}</Menu.Button>
        <Transition
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100 transform -translate-y-0.25"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Menu.Items
            className={
              "absolute flex w-32  transform flex-col gap-2 bg-main p-2"
            }
          >
            {items.map((item) => {
              return (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-accent" : "bg-main"
                      } rounded-md p-2`}
                      onClick={item.onClick}
                    >
                      {item.name}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Dropdown;
