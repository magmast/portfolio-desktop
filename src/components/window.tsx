"use client";

import { Slot } from "@radix-ui/react-slot";
import { Maximize, Minimize, X } from "lucide-react";
import {
  AnimatePresence,
  type DragControls,
  motion,
  transform,
  useDragControls,
} from "motion/react";
import React, { useState } from "react";
import invariant from "tiny-invariant";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { useDesktop } from "./desktop";

interface WindowState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isMaximized: boolean;
  maximize: () => void;
  minimize: () => void;
  dragControls: DragControls;
}

const WindowContext = React.createContext<WindowState | undefined>(undefined);

function useWindow() {
  const context = React.useContext(WindowContext);
  invariant(context, "useWindow must be used within a Window component.");
  return context;
}

export function Window({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = React.useState(false);

  const [isMaximized, setMaximized] = useState(false);

  const open = () => setOpen(true);

  const close = () => {
    setOpen(false);
    setMaximized(false);
  };

  const maximize = () => setMaximized(true);

  const minimize = () => setMaximized(false);

  const dragControls = useDragControls();

  return (
    <WindowContext.Provider
      value={{
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
}: React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  const { open } = useWindow();
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

export function WindowContent({
  id,
  ...props
}: React.ComponentPropsWithoutRef<typeof MotionBaseWindowContent> & {
  id: string;
}) {
  const { isOpen, isMaximized } = useWindow();

  return (
    <AnimatePresence>
      {isOpen &&
        (isMaximized ? (
          <MaximizedWindowContent {...props} key={id} id={id} />
        ) : (
          <MinimizedWindowContent {...props} key={id} id={id} />
        ))}
    </AnimatePresence>
  );
}

const BaseWindowContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "absolute min-w-80 overflow-hidden bg-white text-black shadow-2xl",
        className,
      )}
    />
  );
});
BaseWindowContent.displayName = "BaseWindowContent";

const MotionBaseWindowContent = motion.create(BaseWindowContent);

function MinimizedWindowContent({
  id,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof MotionBaseWindowContent> & {
  id: string;
}) {
  const desktop = useDesktop();
  const { dragControls } = useWindow();

  return (
    <MotionBaseWindowContent
      {...props}
      id={id}
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
      dragConstraints={desktop}
      dragMomentum={false}
      whileDrag={{ scale: 0.98 }}
      drag
    />
  );
}

function MaximizedWindowContent({
  id,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof MotionBaseWindowContent> & {
  id: string;
}) {
  return (
    <MotionBaseWindowContent
      {...props}
      id={id}
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
}: React.ComponentPropsWithoutRef<typeof motion.div>) {
  const { dragControls, isMaximized } = useWindow();

  return (
    <motion.div
      layout
      {...props}
      className={cn("flex items-center bg-zinc-100 p-1 px-3", className)}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        dragControls.start(event);
      }}
    >
      {children}

      <div className="flex justify-end">
        {isMaximized ? (
          <WindowMinimize asChild>
            <Button variant="ghost" size="icon">
              <Minimize />
            </Button>
          </WindowMinimize>
        ) : (
          <WindowMaximize asChild>
            <Button variant="ghost" size="icon">
              <Maximize />
            </Button>
          </WindowMaximize>
        )}

        <WindowClose asChild>
          <Button variant="ghost" size="icon">
            <X />
          </Button>
        </WindowClose>
      </div>
    </motion.div>
  );
}

export function WindowTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...props}
      className={cn("col-start-2 flex-grow font-medium", className)}
    />
  );
}

export function WindowBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div layout {...props} className={cn("px-4 py-2", className)} />
  );
}

export function WindowMaximize({
  asChild,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  const { maximize } = useWindow();
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
}: React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  const { minimize } = useWindow();
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
}: React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  const { close } = useWindow();
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
