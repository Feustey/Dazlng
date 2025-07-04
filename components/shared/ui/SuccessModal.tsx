"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-center mb-4">
                  <CheckCircleIcon className="w-16 h-16 text-green-500" />
                </div>
                
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 text-center mb-4"
                >
                  Message envoyé avec succès !
                </Dialog.Title>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    Merci de nous avoir contacté ! En attendant notre réponse, pourquoi ne pas :
                  </p>
                  
                  <div className="space-y-2">
                    <Link
                      href="/help"
                      className="block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Consulter notre FAQ
                    </Link>
                    
                    <Link
                      href="/token-for-good"
                      className="block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Rejoindre la communauté Token For Good
                    </Link>
                    
                    <a
                      href="https://t.me/daznode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Nous suivre sur Telegram
                    </a>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Fermer
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SuccessModal; 