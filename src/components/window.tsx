"use client";

import * as Portal from "@radix-ui/react-portal";
import { Slot } from "@radix-ui/react-slot";
import { Maximize, Minimize, X } from "lucide-react";
import {
  AnimatePresence,
  type DragControls,
  useDragControls,
} from "motion/react";
import * as m from "motion/react-m";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  useQueryState,
} from "nuqs";
import React from "react";
import invariant from "tiny-invariant";
import { useIsClient } from "usehooks-ts";

import { Text } from "~/components/text";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { scaleVariants } from "~/variants/scale-variants";

const MotionPortal = m.create(Portal.Root);

const WindowBoundaryContext = React.createContext<
  | {
      boundary: React.RefObject<HTMLElement | null>;
    }
  | undefined
>(undefined);

function useWindowBoundary(displayName: string) {
  const context = React.use(WindowBoundaryContext);
  invariant(
    context,
    `${displayName} must be used within a WindowBoundary component.`,
  );
  return context;
}

export function WindowBoundary({
  asChild,
  ...props
}: React.ComponentPropsWithRef<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  const ref = React.useRef<HTMLElement>(null);

  return (
    <WindowBoundaryContext.Provider value={{ boundary: ref }}>
      <Comp
        {...props}
        ref={(node) => {
          ref.current = node;
          if (typeof props.ref === "function") {
            props.ref(node);
          } else if (props.ref) {
            props.ref.current = node;
          }
        }}
      />
    </WindowBoundaryContext.Provider>
  );
}

const WindowContext = React.createContext<
  { id: string; dragControls: DragControls } | undefined
>(undefined);

function useWindow(displayName: string) {
  const context = React.use(WindowContext);
  invariant(context, `${displayName} must be used within a Window component.`);
  const { id, dragControls } = context;

  const [windows, setWindows] = useQueryState(
    "w",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [isMaximized, setIsMaximized] = useQueryState(
    "m",
    parseAsBoolean.withDefault(false),
  );

  const order = React.useMemo(() => windows.indexOf(id), [windows, id]);

  const isLastWindow = React.useMemo(
    () => order === windows.length - 1,
    [order, windows],
  );

  const open = React.useCallback(
    async () =>
      void (await setWindows((order) => [
        ...order.filter((oid) => oid !== id),
        id,
      ])),
    [id, setWindows],
  );

  return {
    id,
    order,
    dragControls,
    isOpen: React.useMemo(() => windows.includes(id), [windows, id]),
    open,
    close: React.useCallback(async () => {
      await setWindows((order) => order.filter((oid) => oid !== id));
      if (isLastWindow) {
        await setIsMaximized(false);
      }
    }, [id, setWindows, isLastWindow, setIsMaximized]),
    isMaximized: React.useMemo(
      () => isLastWindow && isMaximized,
      [isLastWindow, isMaximized],
    ),
    maximize: React.useCallback(async () => {
      void open();
      await setIsMaximized(true);
    }, [open, setIsMaximized]),
    minimize: React.useCallback(() => setIsMaximized(false), [setIsMaximized]),
  };
}

export function Window({
  children,
  id,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const dragControls = useDragControls();

  return (
    <WindowContext.Provider value={{ id, dragControls }}>
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
      onClick={async (event) => {
        onClick?.(event);
        await open();
      }}
    />
  );
}

export function WindowContent({
  className,
  style,
  onPointerDown,
  ...props
}: React.ComponentPropsWithoutRef<typeof MotionPortal> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { boundary } = useWindowBoundary("WindowContent");
  const { id, isOpen, isMaximized, open, order, dragControls } =
    useWindow("WindowContent");
  const isClient = useIsClient();

  const maximizableProps = React.useMemo(
    () =>
      isMaximized
        ? { transformTemplate: () => "" }
        : {
            drag: true,
            dragMomentum: false,
            dragListener: false,
            dragControls: dragControls as never,
            dragConstraints: boundary,
            whileDrag: { scale: 0.95, cursor: "grabbing" },
            transformTemplate: (_: unknown, generated: string) =>
              `translate(-50%, -50%) ${generated}`,
          },
    [boundary, dragControls, isMaximized],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionPortal
          container={boundary.current}
          variants={scaleVariants}
          initial={isClient ? "hidden" : false}
          animate="visible"
          exit="hidden"
          layoutId={id}
          layoutDependency={isMaximized}
          {...maximizableProps}
          {...props}
          key={id}
          className={cn(
            "absolute z-10 min-w-80 overflow-hidden bg-white text-black shadow-lg",
            isMaximized
              ? "left-0 top-0 !m-0 h-full w-full"
              : "left-1/2 top-1/2 h-auto w-auto rounded-lg",
            className,
          )}
          style={{
            zIndex: order,
            ...style,
          }}
          onPointerDown={async (event) => {
            onPointerDown?.(event);
            await open();
          }}
        />
      )}
    </AnimatePresence>
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
      onClick={async (event) => {
        onClick?.(event);
        await maximize();
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
      onClick={async (event) => {
        onClick?.(event);
        await minimize();
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
      onClick={async (event) => {
        onClick?.(event);
        await close();
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
