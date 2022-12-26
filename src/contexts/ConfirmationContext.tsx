import React, { PropsWithChildren, useCallback, useRef, useState } from "react";

import MessageDialog, { DialogActionHandler } from "../components/atoms/MessageDialog";

export interface ConfirmationOptions {
  title: string;
  message: string;
}

export type ConfirmationContextType = (options: ConfirmationOptions) => Promise<boolean>;

export const ConfirmationContext = React.createContext<ConfirmationContextType>(Promise.reject);

interface PromiseRefType {
  resolve: (confirmed: boolean) => void;
}

export function ConfirmationContextProvider({ children }: PropsWithChildren<{}>) {
  const [options, setOptions] = useState<ConfirmationOptions>({} as ConfirmationOptions);
  const [open, setOpen] = useState<boolean>(false);
  const promiseRef = useRef<PromiseRefType>();
  const openConfirmation = useCallback<ConfirmationContextType>((options) => {
      return new Promise((resolve) => {
        promiseRef.current = { resolve };
        setOptions(options);
        setOpen(true);
      });
  }, []);

  const handleAction = useCallback<DialogActionHandler>((_, reason) => {
    setOpen(false);
    promiseRef.current?.resolve(reason === "Confirm");
  }, []);

  return (
    <>
      <ConfirmationContext.Provider value={openConfirmation}>
        {children}
      </ConfirmationContext.Provider>
      <MessageDialog
        open={open}
        title={options.title}
        message={options.message}
        buttons={["Cancel", "Confirm"]}
        closeable={true}
        onAction={handleAction}
      /> 
    </>
  );
}
