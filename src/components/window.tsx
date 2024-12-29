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
import Link from "next/link";
import { useQueryStates } from "nuqs";
import React from "react";
import invariant from "tiny-invariant";

import { Text } from "~/components/text";
import { Button } from "~/components/ui/button";
import { searchParams, urlKeys, useSerialize } from "~/lib/search-params";
import { cn } from "~/lib/utils";
import { scaleVariants } from "~/lib/variants";

const MotionPortal = m.create(Portal.Root);

const WindowBoundaryContext = React.createContext<
  | {
      boundary: HTMLElement | null;
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
  const [ref, setRef] = React.useState<HTMLElement | null>(null);

  return (
    <WindowBoundaryContext.Provider value={{ boundary: ref }}>
      <Comp
        {...props}
        ref={(node) => {
          setRef(node);
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

  const [{ windows, isMaximized }, setParams] = useQueryStates(
    {
      windows: searchParams.windows,
      isMaximized: searchParams.isMaximized,
    },
    { urlKeys },
  );

  const order = React.useMemo(() => windows.indexOf(id), [windows, id]);

  const isLastWindow = React.useMemo(
    () => order === windows.length - 1,
    [order, windows],
  );

  const open = React.useCallback(
    async ({ maximized }: { maximized?: boolean } = {}) =>
      void (await setParams(({ windows, isMaximized, ...params }) => ({
        windows: [...windows.filter((oid) => oid !== id), id],
        isMaximized: maximized ?? isMaximized,
        ...params,
      }))),
    [id, setParams],
  );

  const serialize = useSerialize();

  return {
    id,
    order,
    dragControls,
    isOpen: React.useMemo(() => windows.includes(id), [windows, id]),
    open,
    openHref: React.useMemo(
      () =>
        serialize({
          windows: [...windows.filter((oid) => oid !== id), id],
        }),
      [id, serialize, windows],
    ),
    closeHref: React.useMemo(
      () =>
        serialize({
          windows: windows.filter((oid) => oid !== id),
          isMaximized: false,
        }),
      [serialize, id, windows],
    ),
    isMaximized: React.useMemo(
      () => isLastWindow && isMaximized,
      [isLastWindow, isMaximized],
    ),
    maximizeHref: React.useMemo(
      () =>
        serialize({
          windows: [...windows.filter((oid) => oid !== id), id],
          isMaximized: true,
        }),
      [id, serialize, windows],
    ),
    minimizeHref: React.useMemo(
      () => serialize({ isMaximized: false }),
      [serialize],
    ),
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
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Link>, "href"> & {
  asChild?: boolean;
  href?: string;
}) {
  const Comp = asChild ? Slot : Link;
  const { openHref } = useWindow("WindowTrigger");
  return <Comp href={openHref} {...props} />;
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

  const maximizableProps = React.useMemo(
    () =>
      isMaximized
        ? { transformTemplate: () => "" }
        : {
            drag: true,
            dragMomentum: false,
            dragListener: false,
            dragControls: dragControls as never,
            dragConstraints: { current: boundary },
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
          container={boundary}
          variants={scaleVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          layoutId={id}
          layoutDependency={isMaximized}
          {...maximizableProps}
          {...props}
          key={id}
          className={cn(
            "absolute z-10 min-w-80 overflow-hidden bg-white text-black shadow-lg",
            isMaximized ? "!m-0" : "left-1/2 top-1/2 h-auto w-auto rounded-lg",
            className,
            isMaximized &&
              "left-0 top-0 h-full w-full sm:h-full sm:w-full md:h-full md:w-full lg:h-full lg:w-full xl:h-full xl:w-full 2xl:h-full 2xl:w-full",
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
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-zinc-200"
            asChild
          >
            <WindowMinimize>
              <Minimize />
            </WindowMinimize>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-zinc-200"
            asChild
          >
            <WindowMaximize>
              <Maximize />
            </WindowMaximize>
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-zinc-200"
          asChild
        >
          <WindowClose>
            <X />
          </WindowClose>
        </Button>
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
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Link>, "href"> & {
  asChild?: boolean;
  href?: string;
}) {
  const Comp = asChild ? Slot : Link;
  const { maximizeHref } = useWindow("WindowHeader");
  return <Comp href={maximizeHref} {...props} />;
}

export function WindowMinimize({
  asChild,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Link>, "href"> & {
  asChild?: boolean;
  href?: string;
}) {
  const Comp = asChild ? Slot : Link;
  const { minimizeHref } = useWindow("WindowHeader");
  return <Comp href={minimizeHref} {...props} />;
}

export function WindowClose({
  asChild,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Link>, "href"> & {
  asChild?: boolean;
  href?: string;
}) {
  const Comp = asChild ? Slot : Link;
  const { closeHref } = useWindow("WindowHeader");
  return <Comp href={closeHref} {...props} />;
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
