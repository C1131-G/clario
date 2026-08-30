"use client";

import { Command as CommandIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const CommandMenu = ({ onNewChat }: { onNewChat: () => void }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // SAFETY: browser keyboard events target an Element or null; only HTMLElement exposes the fields used below.
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      ) {
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        aria-label="Open command menu"
        onClick={() => setOpen(true)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <CommandIcon aria-hidden="true" size={18} />
      </Button>
      <CommandDialog onOpenChange={setOpen} open={open} title="Clario commands">
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No command found.</CommandEmpty>
          <CommandGroup heading="Workspace">
            <CommandItem
              onSelect={() => {
                onNewChat();
                setOpen(false);
              }}
            >
              New chat
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
