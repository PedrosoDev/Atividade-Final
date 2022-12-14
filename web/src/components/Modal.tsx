import { XMarkIcon } from "@heroicons/react/24/solid";
import { MouseEventHandler, PropsWithChildren } from "react";

type Props = {
  onclosed?: MouseEventHandler<HTMLButtonElement>;
  isOpen: boolean;
};

export default function Modal({
  isOpen,
  onclosed,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={isOpen ? "block" : "hidden"}>
      <button
        onClick={onclosed}
        className="absolute z-10 top-0 w-full h-full bg-black bg-opacity-60"
      ></button>
      <div className="absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-md w-1/2 h-1/2 p-3">
        <button
          onClick={onclosed}
          className="absolute top-2 right-2 text-slate-300 p-1 rounded-full hover:bg-red-400 hover:text-white"
        >
          <XMarkIcon className="h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
