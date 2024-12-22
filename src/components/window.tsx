"use client";

import * as Portal from "@radix-ui/react-portal";
import { Slot } from "@radix-ui/react-slot";
import { Maximize, Minimize, X } from "lucide-react";
import { AnimatePresence, useDragControls } from "motion/react";
import * as m from "motion/react-m";
import React from "react";
import invariant from "tiny-invariant";

import { Text } from "~/components/text";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface WindowManagerState {
  ref: React.RefObject<HTMLDivElement | null>;
  order: string[];
  focus: (id: string) => void;
  remove: (id: string) => void;
}

const WindowManagerContext = React.createContext<
  WindowManagerState | undefined
>(undefined);

function useWindowManager(displayName: string) {
  const context = React.use(WindowManagerContext);
  invariant(
    context,
    `${displayName} must be used within a WindowManager component.`,
  );
  return context;
}

export function WindowManager(props: React.ComponentPropsWithRef<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [order, setOrder] = React.useState<string[]>([]);

  const focus = React.useCallback((id: string) => {
    setOrder((order) => [...order.filter((oid) => oid !== id), id]);
  }, []);

  const remove = React.useCallback((id: string) => {
    setOrder((order) => order.filter((oid) => oid !== id));
  }, []);

  return (
    <WindowManagerContext.Provider value={{ ref, order, focus, remove }}>
      <div ref={ref} {...props} />
    </WindowManagerContext.Provider>
  );
}

interface WindowState {
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isMaximized: boolean;
  maximize: () => void;
  minimize: () => void;
  dragControls: NonNullable<
    React.ComponentPropsWithoutRef<(typeof m)["div"]>["dragControls"]
  >;
}

const WindowContext = React.createContext<WindowState | undefined>(undefined);

function useWindow(displayName: string) {
  const context = React.useContext(WindowContext);
  invariant(context, `${displayName} must be used within a Window component.`);
  return context;
}

export function Window({
  children,
  id,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = React.useState(false);

  const [isMaximized, setMaximized] = React.useState(false);

  const { focus, remove } = useWindowManager("Window");

  const open = React.useCallback(() => {
    setOpen(true);
    focus(id);
  }, [id, focus]);

  const close = React.useCallback(() => {
    setOpen(false);
    setMaximized(false);
    remove(id);
  }, [id, remove]);

  const maximize = () => setMaximized(true);

  const minimize = () => setMaximized(false);

  const dragControls =
    useDragControls() as unknown as WindowState["dragControls"];

  return (
    <WindowContext.Provider
      value={{
        id,
        isOpen,
        open,
        close,
        isMaximized,
        maximize,
        minimize,
        dragControls,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function WindowTrigger({
  asChild,
  onClick,
  ...props
}: React.ComponentPropsWithRef<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  const { open } = useWindow("WindowTrigger");
  return (
    <Comp
      {...props}
      onClick={(event) => {
        open();
        onClick?.(event);
      }}
    />
  );
}

const windowContentVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  shown: {
    scale: 1,
    opacity: 1,
  },
};

export function WindowContent(
  props: React.ComponentPropsWithoutRef<typeof MotionBaseWindowContent> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) {
  const { id, isOpen, isMaximized } = useWindow("WindowContent");

  return (
    <AnimatePresence>
      {isOpen &&
        (isMaximized ? (
          <MaximizedWindowContent {...props} key={id} />
        ) : (
          <MinimizedWindowContent {...props} key={id} />
        ))}
    </AnimatePresence>
  );
}

function BaseWindowContent({
  className,
  style,
  onPointerDown,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  const {
    ref: windowManagerRef,
    focus,
    order,
  } = useWindowManager("WindowContent");
  const { id } = useWindow("WindowContent");

  return (
    <Portal.Root container={windowManagerRef.current}>
      <div
        {...props}
        className={cn(
          "absolute min-w-80 overflow-hidden bg-white text-black shadow-lg",
          className,
        )}
        style={{
          zIndex: order.indexOf(id) + 1,
          ...style,
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          focus(id);
        }}
      />
    </Portal.Root>
  );
}

const MotionBaseWindowContent = m.create(BaseWindowContent);

function MinimizedWindowContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof MotionBaseWindowContent> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { ref: windowManagerRef } = useWindowManager("WindowContent");
  const { id, dragControls } = useWindow("WindowContent");

  return (
    <MotionBaseWindowContent
      {...props}
      layoutId={id}
      className={cn("left-1/2 top-1/2 h-auto w-auto rounded-lg", className)}
      variants={windowContentVariants}
      initial="hidden"
      animate="shown"
      exit="hidden"
      transformTemplate={(_, generated) =>
        ` translate(-50%, -50%) ${generated}`
      }
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={windowManagerRef}
      dragMomentum={false}
      whileDrag={{ scale: 0.98, cursor: "grabbing" }}
      drag
    />
  );
}

function MaximizedWindowContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof MotionBaseWindowContent> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { id } = useWindow("WindowContent");

  return (
    <MotionBaseWindowContent
      {...props}
      layoutId={id}
      className={cn("left-0 top-0 h-full w-full", className)}
      variants={windowContentVariants}
      initial="hidden"
      animate="shown"
      exit="hidden"
    />
  );
}

export function WindowHeader({
  className,
  children,
  onPointerDown,
  ...props
}: React.ComponentPropsWithRef<typeof m.div>) {
  const { dragControls, isMaximized } = useWindow("WindowHeader");

  return (
    <m.div
      layout
      {...props}
      className={cn(
        "flex touch-none items-center bg-zinc-100 p-1 px-3",
        className,
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        event.preventDefault();
        dragControls.start(event);
      }}
    >
      {children as React.ReactNode}

      <div className="flex justify-end">
        {isMaximized ? (
          <WindowMinimize asChild>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-200">
              <Minimize />
            </Button>
          </WindowMinimize>
        ) : (
          <WindowMaximize asChild>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-200">
              <Maximize />
            </Button>
          </WindowMaximize>
        )}

        <WindowClose asChild>
          <Button variant="ghost" size="icon" className="hover:bg-zinc-200">
            <X />
          </Button>
        </WindowClose>
      </div>
    </m.div>
  );
}

export function WindowTitle({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<"h2">) {
  return (
    <Text
      variant="window-title"
      {...props}
      asChild
      className={cn("col-start-2 flex-grow", className)}
    >
      <h2>{children}</h2>
    </Text>
  );
}

export function WindowBody({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof m.div>) {
  return <m.div layout {...props} className={cn("px-4 py-2", className)} />;
}

export function WindowMaximize({
  asChild,
  onClick,
  ...props
}: React.ComponentPropsWithRef<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  const { maximize } = useWindow("WindowHeader");
  return (
    <Comp
      {...props}
      onClick={(event) => {
        onClick?.(event);
        maximize();
      }}
    />
  );
}

export function WindowMinimize({
  asChild,
  onClick,
  ...props
}: React.ComponentPropsWithRef<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  const { minimize } = useWindow("WindowHeader");
  return (
    <Comp
      {...props}
      onClick={(event) => {
        onClick?.(event);
        minimize();
      }}
    />
  );
}

export function WindowClose({
  asChild,
  onClick,
  ...props
}: React.ComponentPropsWithRef<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  const { close } = useWindow("WindowHeader");
  return (
    <Comp
      {...props}
      onClick={(event) => {
        onClick?.(event);
        close();
      }}
    />
  );
}

export function ToDoWindow({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Window id={id}>
      {children}
      <WindowContent>
        <WindowHeader>
          <WindowTitle>{title}</WindowTitle>
        </WindowHeader>

        <WindowBody>
          <Text variant="body" asChild>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
          </Text>
        </WindowBody>
      </WindowContent>
    </Window>
  );
}
