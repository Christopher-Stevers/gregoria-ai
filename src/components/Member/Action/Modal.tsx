import { Dialog } from "@headlessui/react";

const Modal = ({
  name,
  setShowModal,
  showModal,
}: {
  name: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}) => {
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <Dialog
      className={"fixed inset-0 bg-black/50"}
      open={showModal}
      onClose={() => setShowModal(false)}
    >
      <Dialog.Panel className=" modal inset-20 ">
        <button onClick={handleCloseModal}>Add {name}</button>
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
