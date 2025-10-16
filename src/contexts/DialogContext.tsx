import React, { useCallback, useRef, useState } from "react";

import MessageDialog, {
  DialogActionHandler,
  DialogActionResult,
  MessageDialogProps,
} from "../components/atoms/MessageDialog";
import { Maybe } from "../types/Maybe";
import { ReadonlyPropsWithChildren } from "../types/ReadonlyPropsWithChildren";

export type DialogOptions<T> = Omit<
  MessageDialogProps,
  "open" | "data-testid" | "disabledButtons" | "onAction"
> & {
  fetchData?: () => Maybe<T>;
};

export type DialogContextType = <T>(
  options: DialogOptions<T>
) => Promise<DialogContextResult<T>>;

export const DialogContext = React.createContext<DialogContextType>(
  Promise.reject
);

type DialogContextResult<T> = DialogActionResult & { data?: T };

interface PromiseRefType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (result: DialogContextResult<any>) => void;
}

export function DialogContextProvider({ children }: ReadonlyPropsWithChildren) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [options, setOptions] = useState<DialogOptions<any>>({} as DialogOptions<any>);
  const [open, setOpen] = useState<boolean>(false);
  const promiseRef = useRef<PromiseRefType>(null);
  const openConfirmation = useCallback<DialogContextType>((options) => {
    return new Promise((resolve) => {
      promiseRef.current = { resolve };
      setOptions(options);
      setOpen(true);
    });
  }, []);

  const handleAction = useCallback<DialogActionHandler>(
    (result: DialogActionResult) => {
      setOpen(false);
      const resolvedData = {
        ...result,
        data: options.fetchData?.(),
      };
      promiseRef.current?.resolve(resolvedData);
    },
    [options]
  );

  return (
    <>
      <DialogContext.Provider value={openConfirmation}>
        {children}
      </DialogContext.Provider>
      <MessageDialog
        {...options}
        open={open}
        onAction={handleAction}
        data-testid="context-dialog"
      />
    </>
  );
}
