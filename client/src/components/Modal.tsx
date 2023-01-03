import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { IModalProps } from "../constants/interfaces";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Modal: FC<IModalProps> = ({ isOpen, setIsOpen, description, title }) => {
  const focusRef = useRef(null);

  return (
    <>
      <div className="fixed flex items-center justify-center"></div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" open={isOpen} className="relative z-10" onClose={() => {}} initialFocus={focusRef}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 blur-lg" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                  ref={focusRef}
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex"
                  >
                    <AiOutlineLoading3Quarters className="animate-spin mr-3 mb-3"/>
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
