/* oxlint-disable eslint/func-style, eslint/sort-keys, react/function-component-definition, react/purity, react-doctor/js-combine-iterations, react-doctor/prefer-useReducer, react-doctor/no-giant-component, anti-slop/require-safety-comment-for-type-assertion */
"use client";

import {
  ChatCircle,
  DotsThree,
  MagnifyingGlass,
  PaperPlaneTilt,
  Plus,
  Sparkle,
  Trash,
} from "@phosphor-icons/react";
import { useState, useTransition } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { toast } from "sonner";

import { ReportWorkspace } from "@/components/clario/report-workspace";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  demoConversations,
  demoReport,
  getLocalResponse,
  suggestions,
} from "@/lib/reporting/demo-data";
import type { ChartSpec, Conversation } from "@/lib/reporting/types";

const titleFromQuestion = (question: string) =>
  question.trim().replaceAll(/\s+/gu, " ").slice(0, 54);
const message = (id: string, role: "user" | "assistant", content: string) => ({
  content,
  id,
  parts: [{ type: "text" as const, content }],
  role,
});

function History({
  conversations,
  selectedId,
  query,
  onQuery,
  onNew,
  onSelect,
  onDelete,
  onRename,
}: {
  conversations: readonly Conversation[];
  selectedId: string | null;
  query: string;
  onQuery: (value: string) => void;
  onNew: () => void;
  onSelect: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const [pendingDelete, setPendingDelete] = useState<Conversation | null>(null);
  const [pendingRename, setPendingRename] = useState<Conversation | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const select = (conversation: Conversation) => {
    onSelect(conversation);
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="gap-5 p-5">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl font-semibold"
          >
            C
          </div>
          <div>
            <p className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.18em] uppercase">
              Vedhasoft AI
            </p>
            <p className="font-heading text-2xl leading-none">Clario</p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs leading-5">
          Conversational intelligence for SAP Business One managers.
        </p>
        <Button
          className="h-11 w-full justify-start gap-2"
          onClick={() => {
            onNew();
            if (isMobile) {
              setOpenMobile(false);
            }
          }}
          type="button"
        >
          <Plus aria-hidden="true" data-icon="inline-start" size={18} /> New
          chat
        </Button>
        <label className="relative">
          <span className="sr-only">Search conversations</span>
          <MagnifyingGlass
            aria-hidden="true"
            className="text-muted-foreground absolute top-3 left-3"
            size={17}
          />
          <input
            className="bg-background focus-visible:ring-ring h-11 w-full rounded-md border pr-3 pl-9 text-sm outline-none focus-visible:ring-2"
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search history"
            value={query}
          />
        </label>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[0.65rem] tracking-[0.16em] uppercase">
            Today
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100svh-18rem)]">
              <SidebarMenu>
                {conversations
                  .filter((conversation) =>
                    conversation.title
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                  .filter(
                    (conversation) => conversation.updatedAtLabel === "Today"
                  )
                  .map((conversation) => (
                    <SidebarMenuItem
                      className="group/item"
                      key={conversation.id}
                    >
                      <SidebarMenuButton
                        className="h-auto min-h-11 items-start py-2.5 pr-10"
                        isActive={selectedId === conversation.id}
                        onClick={() => select(conversation)}
                        tooltip={conversation.title}
                        type="button"
                      >
                        <ChatCircle aria-hidden="true" size={17} />
                        <span className="truncate">{conversation.title}</span>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              aria-label={`Actions for ${conversation.title}`}
                              className="absolute top-1 right-1 size-9 opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100"
                              size="icon"
                              type="button"
                              variant="ghost"
                            />
                          }
                        >
                          <DotsThree aria-hidden="true" size={17} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setPendingRename(conversation);
                              setRenameValue(conversation.title);
                            }}
                          >
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setPendingDelete(conversation)}
                            variant="destructive"
                          >
                            <Trash aria-hidden="true" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))}
                {conversations.some(
                  (conversation) =>
                    conversation.updatedAtLabel === "Previous 7 days" &&
                    conversation.title
                      .toLowerCase()
                      .includes(query.toLowerCase())
                ) && (
                  <SidebarGroupLabel className="mt-5 px-2 text-[0.65rem] tracking-[0.16em] uppercase">
                    Previous 7 days
                  </SidebarGroupLabel>
                )}
                {conversations
                  .filter(
                    (conversation) =>
                      conversation.updatedAtLabel === "Previous 7 days" &&
                      conversation.title
                        .toLowerCase()
                        .includes(query.toLowerCase())
                  )
                  .map((conversation) => (
                    <SidebarMenuItem
                      className="group/item"
                      key={conversation.id}
                    >
                      <SidebarMenuButton
                        className="h-auto min-h-11 items-start py-2.5 pr-10"
                        isActive={selectedId === conversation.id}
                        onClick={() => select(conversation)}
                        tooltip={conversation.title}
                        type="button"
                      >
                        <ChatCircle aria-hidden="true" size={17} />
                        <span className="truncate">{conversation.title}</span>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              aria-label={`Actions for ${conversation.title}`}
                              className="absolute top-1 right-1 size-9 opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100"
                              size="icon"
                              type="button"
                              variant="ghost"
                            />
                          }
                        >
                          <DotsThree aria-hidden="true" size={17} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setPendingRename(conversation);
                              setRenameValue(conversation.title);
                            }}
                          >
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setPendingDelete(conversation)}
                            variant="destructive"
                          >
                            <Trash aria-hidden="true" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
              {conversations.length === 0 && (
                <p className="text-muted-foreground px-2 py-8 text-sm">
                  No conversations yet.
                </p>
              )}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-3 p-5">
        <Separator />
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full bg-emerald-500" />
          SAP B1 demo data · Read-only
        </div>
      </SidebarFooter>
      <AlertDialog
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        open={pendingDelete !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes “{pendingDelete?.title}” from this browser session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  onDelete(pendingDelete.id);
                }
                setPendingDelete(null);
              }}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setPendingRename(null);
          }
        }}
        open={pendingRename !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
            <DialogDescription>
              Give this local conversation a clear manager-friendly title.
            </DialogDescription>
          </DialogHeader>
          <label className="text-sm font-medium" htmlFor="rename-conversation">
            Conversation title
          </label>
          <input
            className="border-input bg-background focus-visible:ring-ring h-11 rounded-md border px-3 text-sm outline-none focus-visible:ring-2"
            id="rename-conversation"
            onChange={(event) => setRenameValue(event.target.value)}
            value={renameValue}
          />
          <DialogFooter>
            <Button
              onClick={() => setPendingRename(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={renameValue.trim().length < 2}
              onClick={() => {
                if (pendingRename) {
                  onRename(pendingRename.id, renameValue.trim());
                }
                setPendingRename(null);
              }}
              type="button"
            >
              Save name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}

export function ClarioDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([
    ...demoConversations,
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(
    demoConversations[0]?.id ?? null
  );
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [report, setReport] = useState(demoReport);
  const [spec, setSpec] = useState<ChartSpec>(demoReport.chart);
  const [view, setView] = useState<"chat" | "report">("chat");
  const [reportCollapsed, setReportCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const selected = conversations.find((item) => item.id === selectedId);
  const messages = selected?.messages ?? [];
  const startNew = () => {
    setSelectedId(null);
    setDraft("");
    setView("chat");
    toast.success("New conversation started.");
  };
  const submit = (question: string) => {
    const clean = question.trim();
    if (clean.length < 2) {
      toast.error("Enter a question with at least two characters.");
      return;
    }
    const answer = getLocalResponse(clean);
    const id = selectedId ?? `local-${conversations.length + 1}`;
    const current = conversations.find((item) => item.id === id);
    const next: Conversation = {
      id,
      messages: [
        ...(current?.messages ?? []),
        message(
          `user-${id}-${(current?.messages.length ?? 0) + 1}`,
          "user",
          clean
        ),
        message(
          `assistant-${id}-${(current?.messages.length ?? 0) + 2}`,
          "assistant",
          answer.content
        ),
      ],
      reportId: answer.report.id,
      title: current?.title ?? titleFromQuestion(clean),
      updatedAtLabel: "Today",
    };
    setConversations((items) => [
      next,
      ...items.filter((item) => item.id !== id),
    ]);
    setSelectedId(id);
    setReport(answer.report);
    setSpec(answer.report.chart);
    setDraft("");
    toast.success("Local demo report updated.");
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isPending) {
      startTransition(() => submit(draft));
    }
  };
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      if (!isPending) {
        startTransition(() => submit(draft));
      }
    }
  };
  const select = (conversation: Conversation) => {
    setSelectedId(conversation.id);
    setReport(demoReport);
    setSpec(demoReport.chart);
    setView("chat");
  };
  const deleteConversation = (id: string) => {
    setConversations((items) => items.filter((item) => item.id !== id));
    if (selectedId === id) {
      startNew();
    }
  };
  return (
    <>
      <a
        className="focus:bg-background focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-3 focus:ring-2"
        href="#main-content"
      >
        Skip to main content
      </a>
      <SidebarProvider>
        <History
          conversations={conversations}
          onDelete={deleteConversation}
          onNew={startNew}
          onQuery={setQuery}
          onSelect={select}
          onRename={(id, title) =>
            setConversations((items) =>
              items.map((item) => (item.id === id ? { ...item, title } : item))
            )
          }
          query={query}
          selectedId={selectedId}
        />
        <main
          className="flex min-h-svh min-w-0 flex-1 flex-col"
          id="main-content"
        >
          <header className="flex min-h-16 items-center justify-between border-b px-4 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator
                className="hidden h-5 md:block"
                orientation="vertical"
              />
              <div>
                <p className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.16em] uppercase">
                  Clario workspace
                </p>
                <h1 className="font-heading text-xl leading-none md:text-2xl">
                  Ask Clario
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <CommandMenu onNewChat={startNew} />
              <ThemeToggle />
            </div>
          </header>
          <div className="border-b px-4 py-2 xl:hidden">
            <Tabs
              onValueChange={(value) => setView(value as "chat" | "report")}
              value={view}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="report">Report</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ResizablePanelGroup
            className="flex min-h-0 flex-1"
            orientation="horizontal"
          >
            <ResizablePanel defaultSize="70%" minSize="45%">
              <section
                aria-label="Chat conversation"
                className={`${view === "report" ? "hidden xl:flex" : "flex"} min-w-0 flex-1 flex-col`}
              >
                <MessageScrollerProvider>
                  <MessageScroller className="flex-1">
                    <MessageScrollerViewport>
                      <MessageScrollerContent className="mx-auto w-full max-w-3xl px-5 py-8 md:px-8 md:py-12">
                        {messages.length === 0 ? (
                          <MessageScrollerItem messageId="empty-state">
                            <Empty className="min-h-[45svh] border-0">
                              <EmptyHeader>
                                <EmptyMedia
                                  className="bg-muted/50 text-primary mb-2 size-14 rounded-2xl border"
                                  variant="icon"
                                >
                                  <Sparkle
                                    aria-hidden="true"
                                    size={26}
                                    weight="duotone"
                                  />
                                </EmptyMedia>
                                <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
                                  Your SAP B1 workspace
                                </p>
                                <EmptyTitle className="mt-3 text-4xl md:text-5xl">
                                  What would you like to know?
                                </EmptyTitle>
                                <EmptyDescription className="mt-4 max-w-md text-sm leading-6">
                                  Ask a business question in plain language.
                                  Clario will shape it into a manager-ready
                                  report.
                                </EmptyDescription>
                              </EmptyHeader>
                              <EmptyContent>
                                <div className="mt-8 flex max-w-xl flex-wrap justify-center gap-2">
                                  {suggestions.map((suggestion) => (
                                    <Button
                                      className="min-h-11"
                                      key={suggestion}
                                      onClick={() => submit(suggestion)}
                                      type="button"
                                      variant="outline"
                                    >
                                      {suggestion}
                                    </Button>
                                  ))}
                                </div>
                              </EmptyContent>
                            </Empty>
                          </MessageScrollerItem>
                        ) : (
                          <div className="space-y-8">
                            {messages.map((item) => (
                              <MessageScrollerItem
                                key={item.id}
                                messageId={item.id}
                                scrollAnchor={item.role === "user"}
                              >
                                <Message
                                  align={
                                    item.role === "assistant" ? "start" : "end"
                                  }
                                  key={item.id}
                                >
                                  <MessageAvatar
                                    className={
                                      item.role === "assistant"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }
                                  >
                                    {item.role === "assistant" ? "C" : "Y"}
                                  </MessageAvatar>
                                  <MessageContent>
                                    <MessageHeader>
                                      {item.role === "assistant"
                                        ? "Clario"
                                        : "You"}
                                    </MessageHeader>
                                    <div className="bg-card rounded-xl border px-4 py-3 text-sm leading-6 whitespace-pre-wrap md:text-base">
                                      {item.content}
                                    </div>
                                    {item.role === "assistant" && (
                                      <Button
                                        className="mt-4 min-h-11"
                                        onClick={() => setView("report")}
                                        type="button"
                                        variant="secondary"
                                      >
                                        Open report workspace
                                      </Button>
                                    )}
                                  </MessageContent>
                                </Message>
                              </MessageScrollerItem>
                            ))}
                          </div>
                        )}
                      </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton />
                  </MessageScroller>
                </MessageScrollerProvider>
                <div className="bg-background/95 border-t px-4 py-4 backdrop-blur md:px-6">
                  <form
                    aria-busy={isPending}
                    className="mx-auto w-full max-w-3xl"
                    onSubmit={handleSubmit}
                  >
                    <label className="sr-only" htmlFor="question-input">
                      Ask a question about your SAP Business One data
                    </label>
                    <InputGroup>
                      <InputGroupTextarea
                        aria-describedby="composer-help"
                        className="min-h-16 resize-none border-0 bg-transparent pr-14 shadow-none focus-visible:ring-0"
                        id="question-input"
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={keyDown}
                        placeholder="Ask about sales, inventory, customers, or purchases…"
                        rows={2}
                        minLength={2}
                        required
                        value={draft}
                      />
                      <InputGroupButton
                        aria-label="Send question"
                        className="absolute right-2 bottom-2 size-11"
                        disabled={isPending}
                        size="icon-sm"
                        type="submit"
                      >
                        <PaperPlaneTilt
                          aria-hidden="true"
                          size={18}
                          weight="fill"
                        />
                      </InputGroupButton>
                    </InputGroup>
                    <p
                      className="text-muted-foreground mt-2 text-center text-xs"
                      id="composer-help"
                    >
                      Enter to send · Shift+Enter for a new line · Local demo
                      only
                    </p>
                    <output aria-live="polite" className="sr-only">
                      {isPending ? "Preparing report" : "Ready"}
                    </output>
                  </form>
                </div>
              </section>
            </ResizablePanel>
            <ResizableHandle
              aria-valuemax={80}
              aria-valuemin={20}
              aria-valuenow={30}
              withHandle
            />
            <ResizablePanel defaultSize="30%" minSize="20%">
              <ReportWorkspace
                collapsed={reportCollapsed}
                onCollapse={() => setReportCollapsed((value) => !value)}
                onReset={() => setSpec(report.chart)}
                onSpecChange={setSpec}
                report={report}
                spec={spec}
                mobileVisible={view === "report"}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </SidebarProvider>
    </>
  );
}
