import { FC, Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { MdOutlineArrowDropDownCircle, MdCheck } from "react-icons/md";
import { IDropdownProps } from "../constants/interfaces";
import ACTIONS from "../constants/actions";
import defaultCode from "../constants/defaultCode";

const Dropdown: FC<IDropdownProps> = ({
  content,
  selected,
  setSelected,
  socketRef,
  roomId,
  auxiliaryRef,
  dropdownType,
  setCurrentCode
}) => {
  const [query, setQuery] = useState("");

  const filteredContent =
    query === ""
      ? content
      : content.filter((item) =>
          item
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const effectRan = useRef(false);
  useEffect(() => {
    if (socketRef.current) {
      if (dropdownType === "Theme") {
        socketRef.current?.on(ACTIONS.THEME_CHANGE, ({ newTheme }) => {
          setSelected(newTheme);
        });
      } 

      else if (dropdownType === "Language") {
        socketRef.current?.on(ACTIONS.LANGUAGE_CHANGE, ({ newLanguage }) => {
          setSelected(newLanguage);
        });
      } 
      
      else {
        console.log("socketRef receiving the wrong data 🤔");
      }
    }

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
      effectRan.current = true;
    };
  }, [socketRef.current]);

  return (
    <div className="min-w-fit max-w-[72px] overflow-y-visible z-10">
      <Combobox
        value={selected}
        onChange={(newSelection) => {
          setSelected(newSelection);
          auxiliaryRef.current = newSelection;
          
          if (dropdownType === "Theme") {
            socketRef.current?.emit(ACTIONS.THEME_CHANGE, {
              roomId,
              newTheme: newSelection,
            });
          }
          
          else if (dropdownType === "Language") {
            setCurrentCode(defaultCode[newSelection])
            socketRef.current?.emit(ACTIONS.LANGUAGE_CHANGE, {
              roomId,
              newLanguage: newSelection,
            });
          }

          else {
            console.log("Combobox newSelection error 🤔")
          }
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-slate-700 text-left drop-shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0 bg-slate-700 text-white truncate"
              //   displayValue={(item) => item}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 bg-slate-700">
              <MdOutlineArrowDropDownCircle
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredContent.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredContent.map((item, idx) => (
                  <Combobox.Option
                    key={idx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-blue-600 text-white" : "text-white"
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-green-500"
                            }`}
                          >
                            <MdCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default Dropdown;
