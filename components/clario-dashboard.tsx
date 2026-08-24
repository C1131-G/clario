"use client";

import {
  ChatCircle,
  PaperPlaneTilt,
  Plus,
  Sparkle,
} from "@phosphor-icons/react";
import { useReducer } from "react";
import type { FormEvent, KeyboardEvent } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

interface Message {
  content: string;
  id: string;
}

interface Conversation {
  id: string;
  messages: readonly Message[];
  title: string;
}

interface DashboardState {
  conversations: Conversation[];
  draft: string;
  messages: readonly Message[];
  selectedId: string | null;
  status: string;
}

type DashboardAction =
  | { type: "new-chat" }
  | { type: "select"; conversation: Conversation }
  | { type: "set-draft"; value: string }
  | { type: "set-status"; value: string }
  | { type: "submit"; conversation: Conversation };

const titleFromQuestion = (question: string) => {
  const title = question.trim().replaceAll(/\s+/gu, " ");
  return title.length > 48 ? `${title.slice(0, 48).trim()}…` : title;
};

const initialDashboardState: DashboardState = {
  conversations: [],
  draft: "",
  messages: [],
  selectedId: null,
  status: "Ready for your first question.",
};

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case "new-chat": {
      return {
        ...state,
        draft: "",
        messages: [],
        selectedId: null,
        status: "New conversation started.",
      };
    }
    case "select": {
      return {
        ...state,
        draft: "",
        messages: action.conversation.messages,
        selectedId: action.conversation.id,
        status: `${action.conversation.title} loaded.`,
      };
    }
    case "set-draft": {
      return { ...state, draft: action.value };
    }
    case "set-status": {
      return { ...state, status: action.value };
    }
    case "submit": {
      const conversationExists = state.conversations.some(
        (item) => item.id === action.conversation.id
      );
      return {
        ...state,
        conversations: conversationExists
          ? state.conversations.map((item) =>
              item.id === action.conversation.id ? action.conversation : item
            )
          : [action.conversation, ...state.conversations],
        draft: "",
        messages: action.conversation.messages,
        selectedId: action.conversation.id,
        status: "Question added to this conversation.",
      };
    }
    default: {
      return state;
    }
  }
};

const ChatHistory = ({
  conversations,
  onNewChat,
  onSelect,
  selectedId,
}: {
  conversations: readonly Conversation[];
  onNewChat: () => void;
  onSelect: (conversation: Conversation) => void;
  selectedId: string | null;
}) => {
  const { isMobile, setOpenMobile } = useSidebar();

  const selectConversation = (conversation: Conversation) => {
    onSelect(conversation);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const startNewChat = () => {
    onNewChat();
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
            className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl text-lg font-semibold"
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
        <Button
          className="h-11 w-full justify-start gap-2"
          onClick={startNewChat}
          type="button"
        >
          <Plus aria-hidden="true" size={18} weight="bold" />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[0.65rem] tracking-[0.16em] uppercase">
            Chat history
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100svh-13rem)]">
              {conversations.length === 0 ? (
                <div className="text-muted-foreground px-2 py-8 text-sm">
                  No conversations yet.
                </div>
              ) : (
                <SidebarMenu>
                  {conversations.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        className="h-auto min-h-11 items-start py-2.5"
                        isActive={selectedId === conversation.id}
                        onClick={() => selectConversation(conversation)}
                        tooltip={conversation.title}
                        type="button"
                      >
                        <ChatCircle aria-hidden="true" size={17} />
                        <span className="truncate">{conversation.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
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
    </Sidebar>
  );
};

const ChatDashboard = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  const startNewChat = () => dispatch({ type: "new-chat" });

  const selectConversation = (conversation: Conversation) =>
    dispatch({ conversation, type: "select" });

  const submitQuestion = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      dispatch({
        type: "set-status",
        value: "Enter a question before sending.",
      });
      return;
    }

    const message: Message = {
      content: trimmedQuestion,
      id: `message-${Date.now()}`,
    };
    const nextMessages = [...state.messages, message];
    const conversationId = state.selectedId ?? `conversation-${Date.now()}`;
    const existingConversation = state.conversations.find(
      (conversation) => conversation.id === conversationId
    );
    const conversation: Conversation = {
      id: conversationId,
      messages: nextMessages,
      title: existingConversation?.title ?? titleFromQuestion(trimmedQuestion),
    };

    dispatch({ conversation, type: "submit" });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion(state.draft);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submitQuestion(state.draft);
    }
  };

  return (
    <SidebarProvider>
      <ChatHistory
        conversations={state.conversations}
        onNewChat={startNewChat}
        onSelect={selectConversation}
        selectedId={state.selectedId}
      />
      <main
        className="flex min-h-svh min-w-0 flex-1 flex-col"
        id="main-content"
      >
        <header className="flex min-h-16 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator className="hidden h-5 md:block" orientation="vertical" />
            <div>
              <p className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.16em] uppercase">
                Workspace
              </p>
              <h1 className="font-heading text-xl leading-none md:text-2xl">
                Ask Clario
              </h1>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <section
          aria-label="Chat conversation"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1">
            <div className="mx-auto flex min-h-[calc(100svh-12rem)] w-full max-w-3xl items-center justify-center px-5 py-12 md:px-8">
              {state.messages.length === 0 ? (
                <div className="max-w-md text-center">
                  <div className="bg-muted/50 text-primary mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border">
                    <Sparkle aria-hidden="true" size={26} weight="duotone" />
                  </div>
                  <p className="text-muted-foreground mb-3 font-mono text-xs tracking-[0.18em] uppercase">
                    Your SAP B1 workspace
                  </p>
                  <h2 className="font-heading text-4xl tracking-tight md:text-5xl">
                    What would you like to know?
                  </h2>
                  <p className="text-muted-foreground mt-4 text-sm leading-6 md:text-base">
                    Ask a business question in plain language. Your conversation
                    will appear here as you build it.
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-6 self-start">
                  {state.messages.map((message) => (
                    <article className="flex gap-3" key={message.id}>
                      <div
                        aria-hidden="true"
                        className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
                      >
                        Y
                      </div>
                      <div className="min-w-0 pt-1">
                        <p className="text-muted-foreground mb-1 text-xs font-medium">
                          You
                        </p>
                        <p className="text-sm leading-6 whitespace-pre-wrap md:text-base">
                          {message.content}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="bg-background/95 border-t px-4 py-4 backdrop-blur md:px-6">
            <form className="mx-auto w-full max-w-3xl" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="question-input">
                Ask a question about your SAP Business One data
              </label>
              <div className="bg-muted/30 focus-within:border-ring focus-within:ring-ring/20 relative rounded-2xl border p-2 shadow-sm focus-within:ring-3">
                <Textarea
                  aria-describedby="composer-help"
                  className="min-h-16 border-0 bg-transparent pr-14 shadow-none focus-visible:ring-0"
                  id="question-input"
                  name="question"
                  onChange={(event) =>
                    dispatch({ type: "set-draft", value: event.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about sales, inventory, customers, or purchases…"
                  rows={2}
                  value={state.draft}
                />
                <Button
                  aria-label="Send question"
                  className="absolute right-2 bottom-2 size-11"
                  size="icon-lg"
                  type="submit"
                >
                  <PaperPlaneTilt aria-hidden="true" size={18} weight="fill" />
                </Button>
              </div>
              <p
                className="text-muted-foreground mt-2 text-center text-xs"
                id="composer-help"
              >
                Enter to send · Shift+Enter for a new line
              </p>
              <output className="sr-only" aria-live="polite">
                {state.status}
              </output>
            </form>
          </div>
        </section>
      </main>
    </SidebarProvider>
  );
};

const ClarioDashboard = () => <ChatDashboard />;

export { ClarioDashboard };
