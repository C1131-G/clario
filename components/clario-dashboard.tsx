"use client";

import {
  ArrowUpRight,
  ChartLineUp,
  CheckCircle,
  Database,
  Moon,
  Package,
  PaperPlaneTilt,
  Plus,
  ShoppingCart,
  Sparkle,
  TrendUp,
  UsersThree,
} from "@phosphor-icons/react";
import { useReducer } from "react";
import type { FormEvent, KeyboardEvent } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type Accent = "amber" | "blue" | "purple" | "teal";
type MessageRole = "assistant" | "user";

interface Message {
  content: string;
  id: string;
  role: MessageRole;
  time: string;
}

interface Metric {
  accent: Accent;
  detail: string;
  label: string;
  value: string;
}

interface ChartPoint {
  display: string;
  label: string;
  value: number;
}

interface DashboardResult {
  chart: readonly ChartPoint[];
  chartSummary: string;
  customers: readonly { amount: string; name: string; share: string }[];
  metrics: readonly Metric[];
  summary: string;
  title: string;
}

interface Conversation {
  id: string;
  messages: readonly Message[];
  preview: string;
  result: DashboardResult;
  time: string;
  title: string;
}

const ASTER_REVENUE = "₹4.8L";
const BLUEBIRD_REVENUE = "₹2.9L";
const NORTHSTAR_REVENUE = "₹3.6L";
const SALES_ORDERS_LABEL = "Sales orders";

const SALES_RESULT: DashboardResult = {
  chart: [
    { display: "₹2.8L", label: "Jan", value: 48 },
    { display: "₹3.6L", label: "Feb", value: 62 },
    { display: "₹4.1L", label: "Mar", value: 70 },
    { display: "₹4.7L", label: "Apr", value: 82 },
    { display: "₹5.2L", label: "May", value: 96 },
  ],
  chartSummary:
    "Monthly sales increased from ₹2.8 lakh in January to ₹5.2 lakh in May.",
  customers: [
    { amount: ASTER_REVENUE, name: "Aster Retail Group", share: "19%" },
    { amount: NORTHSTAR_REVENUE, name: "Northstar Components", share: "15%" },
    { amount: BLUEBIRD_REVENUE, name: "Bluebird Manufacturing", share: "12%" },
  ],
  metrics: [
    {
      accent: "blue",
      detail: "vs. previous period",
      label: "Total sales",
      value: "₹24.8L",
    },
    {
      accent: "teal",
      detail: "completed orders",
      label: SALES_ORDERS_LABEL,
      value: "186",
    },
    {
      accent: "amber",
      detail: "average order value",
      label: "AOV",
      value: "₹13,333",
    },
  ],
  summary:
    "Revenue is trending upward, with May contributing the strongest month in the selected period.",
  title: "Sales performance",
};

const INVENTORY_RESULT: DashboardResult = {
  chart: [
    { display: "82%", label: "Core", value: 82 },
    { display: "64%", label: "Parts", value: 64 },
    { display: "51%", label: "Kits", value: 51 },
    { display: "39%", label: "Tools", value: 39 },
    { display: "28%", label: "Supplies", value: 28 },
  ],
  chartSummary:
    "Core products have the healthiest stock coverage; supplies have the lowest coverage.",
  customers: [
    { amount: "18 units", name: "Industrial seal kit", share: "Critical" },
    { amount: "24 units", name: "Drive coupling 40mm", share: "Critical" },
    { amount: "31 units", name: "Control relay 24V", share: "Watch" },
  ],
  metrics: [
    {
      accent: "amber",
      detail: "below reorder point",
      label: "Low-stock items",
      value: "5",
    },
    {
      accent: "blue",
      detail: "units on hand",
      label: "Available units",
      value: "1,284",
    },
    {
      accent: "teal",
      detail: "this month",
      label: "Stock turns",
      value: "3.8×",
    },
  ],
  summary:
    "Five items are below their reorder threshold and need attention from the purchasing team.",
  title: "Inventory watchlist",
};

const CUSTOMER_RESULT: DashboardResult = {
  chart: [
    { display: ASTER_REVENUE, label: "Aster", value: 100 },
    { display: NORTHSTAR_REVENUE, label: "Northstar", value: 75 },
    { display: BLUEBIRD_REVENUE, label: "Bluebird", value: 60 },
    { display: "₹2.2L", label: "Vertex", value: 46 },
    { display: "₹1.8L", label: "Cedar", value: 38 },
  ],
  chartSummary:
    "Aster Retail Group leads at ₹4.8 lakh, followed by Northstar Components at ₹3.6 lakh.",
  customers: [
    { amount: ASTER_REVENUE, name: "Aster Retail Group", share: "19%" },
    { amount: NORTHSTAR_REVENUE, name: "Northstar Components", share: "15%" },
    { amount: BLUEBIRD_REVENUE, name: "Bluebird Manufacturing", share: "12%" },
  ],
  metrics: [
    {
      accent: "purple",
      detail: "current period",
      label: "Top customer",
      value: "₹4.8L",
    },
    {
      accent: "blue",
      detail: "of total sales",
      label: "Top 3 share",
      value: "46%",
    },
    {
      accent: "teal",
      detail: "active accounts",
      label: "Customers",
      value: "42",
    },
  ],
  summary:
    "The top three accounts represent 46% of revenue in the current demo period.",
  title: "Top customers by revenue",
};

const PURCHASE_RESULT: DashboardResult = {
  chart: [
    { display: "32", label: "Jan", value: 42 },
    { display: "41", label: "Feb", value: 55 },
    { display: "49", label: "Mar", value: 67 },
    { display: "58", label: "Apr", value: 78 },
    { display: "72", label: "May", value: 94 },
  ],
  chartSummary:
    "Purchase orders rose from 32 in January to 72 in May as sales order volume grew.",
  customers: [
    { amount: "72", name: "Purchase orders", share: "Supplier side" },
    { amount: "186", name: SALES_ORDERS_LABEL, share: "Customer side" },
    { amount: "2.6×", name: "Order ratio", share: "Sales / purchase" },
  ],
  metrics: [
    {
      accent: "blue",
      detail: "customer orders",
      label: SALES_ORDERS_LABEL,
      value: "186",
    },
    {
      accent: "amber",
      detail: "supplier orders",
      label: "Purchase orders",
      value: "72",
    },
    {
      accent: "teal",
      detail: "sales / purchase",
      label: "Order ratio",
      value: "2.6×",
    },
  ],
  summary:
    "Sales orders are outpacing purchase orders, creating a healthy but watchable fulfillment gap.",
  title: "Orders comparison",
};

const BASE_MESSAGES: readonly Message[] = [
  {
    content: "Show monthly sales and top customers.",
    id: "sales-question",
    role: "user",
    time: "10:42 AM",
  },
  {
    content:
      "Here’s a demo view using sample SAP Business One data. Sales are climbing steadily, and the top three accounts contribute nearly half of the current period’s revenue. I’ve placed the supporting trend and customer breakdown in the insight panel.",
    id: "sales-answer",
    role: "assistant",
    time: "10:42 AM",
  },
];

const CONVERSATIONS: readonly Conversation[] = [
  {
    id: "sales",
    messages: BASE_MESSAGES,
    preview: "Monthly sales and top customers",
    result: SALES_RESULT,
    time: "10:42 AM",
    title: "Sales performance",
  },
  {
    id: "inventory",
    messages: [
      {
        content: "Which items are low in stock?",
        id: "inventory-question",
        role: "user",
        time: "Yesterday",
      },
      {
        content:
          "Five items are below their reorder threshold in the sample inventory. The most urgent items are the industrial seal kit and the 40mm drive coupling.",
        id: "inventory-answer",
        role: "assistant",
        time: "Yesterday",
      },
    ],
    preview: "Items below reorder threshold",
    result: INVENTORY_RESULT,
    time: "Yesterday",
    title: "Inventory watchlist",
  },
  {
    id: "orders",
    messages: [
      {
        content: "Compare purchase orders versus sales orders.",
        id: "orders-question",
        role: "user",
        time: "Mon",
      },
      {
        content:
          "Sales orders are 2.6 times higher than purchase orders in the sample period. That is positive for demand, but the fulfillment team should keep an eye on supply coverage.",
        id: "orders-answer",
        role: "assistant",
        time: "Mon",
      },
    ],
    preview: "Purchase orders vs sales orders",
    result: PURCHASE_RESULT,
    time: "Mon",
    title: "Orders comparison",
  },
];

const PROMPTS = [
  { icon: TrendUp, label: "Show total sales this month" },
  { icon: UsersThree, label: "Show my top customers" },
  { icon: Package, label: "Which items are low in stock?" },
  { icon: ShoppingCart, label: "Compare purchase and sales orders" },
] as const;

const RESULT_BY_PROMPT = [
  { match: /customer|client|account/u, result: CUSTOMER_RESULT },
  { match: /stock|inventory|item|product/u, result: INVENTORY_RESULT },
  { match: /purchase|sales order|supplier/u, result: PURCHASE_RESULT },
] as const;

const getResultForPrompt = (prompt: string) =>
  RESULT_BY_PROMPT.find(({ match }) => match.test(prompt))?.result ??
  SALES_RESULT;

const getResponseForPrompt = (prompt: string, result: DashboardResult) => {
  if (/stock|inventory|item|product/u.test(prompt)) {
    return `I found ${result.metrics[0].value} low-stock items in the sample inventory. The insight panel highlights the items that need purchasing attention first.`;
  }
  if (/purchase|sales order|supplier/u.test(prompt)) {
    return "Sales orders are currently outpacing purchase orders in the sample period. I’ve added the order comparison and trend to the insight panel.";
  }
  if (/customer|client|account/u.test(prompt)) {
    return "Here are the strongest customer accounts in the sample period. I’ve included their revenue share so the concentration is easy to scan.";
  }
  return "Here’s a sales snapshot from the sample SAP Business One data. The insight panel shows the trend, headline KPIs, and the accounts contributing most to revenue.";
};

interface ConversationListProps {
  activeId: string | null;
  conversations: readonly Conversation[];
  onSelect: (conversation: Conversation) => void;
}

const ConversationList = ({
  activeId,
  conversations,
  onSelect,
}: ConversationListProps) => (
  <ul className="conversation-list">
    {conversations.map((conversation) => (
      <li key={conversation.id}>
        <Button
          type="button"
          className={`conversation-item h-auto min-h-11 w-full justify-start rounded-none ${activeId === conversation.id ? "is-active" : ""}`}
          variant="ghost"
          aria-pressed={activeId === conversation.id}
          onClick={() => onSelect(conversation)}
        >
          <span className="conversation-item-topline">
            <span>{conversation.title}</span>
            <time>{conversation.time}</time>
          </span>
          <span className="conversation-preview">{conversation.preview}</span>
        </Button>
      </li>
    ))}
  </ul>
);

const ResultPanel = ({ result }: { result: DashboardResult | null }) => {
  if (!result) {
    return (
      <div className="result-empty">
        <div className="result-empty-icon">
          <ChartLineUp aria-hidden="true" size={24} weight="duotone" />
        </div>
        <h2>Your insight will appear here</h2>
        <p>
          Ask a question in plain language and Clario will shape the answer into
          a decision-ready view.
        </p>
      </div>
    );
  }

  const chartMax = Math.max(...result.chart.map((point) => point.value));

  return (
    <div className="result-content">
      <div className="result-heading">
        <div>
          <p className="eyebrow">LIVE RESULT · DEMO DATA</p>
          <h2>{result.title}</h2>
        </div>
        <Button
          type="button"
          className="icon-button subtle-button"
          variant="ghost"
          size="icon"
          aria-label="Open result details"
        >
          <ArrowUpRight aria-hidden="true" size={17} weight="bold" />
        </Button>
      </div>

      <p className="result-summary">{result.summary}</p>

      <div className="metric-grid">
        {result.metrics.map((metric) => (
          <article
            className={`metric-card accent-${metric.accent}`}
            key={metric.label}
          >
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </div>

      <section className="result-section" aria-labelledby="trend-heading">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">TREND</p>
            <h3 id="trend-heading">Performance over time</h3>
          </div>
          <TrendUp
            aria-hidden="true"
            className="section-accent-icon"
            size={20}
            weight="bold"
          />
        </div>
        <p className="chart-summary">{result.chartSummary}</p>
        <figure className="bar-chart" aria-labelledby="chart-caption">
          <div className="chart-plot" aria-hidden="true">
            {result.chart.map((point) => (
              <div className="bar-column" key={point.label}>
                <span className="bar-value">{point.display}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${Math.max(12, (point.value / chartMax) * 100)}%`,
                    }}
                  />
                </div>
                <span className="bar-label">{point.label}</span>
              </div>
            ))}
          </div>
          <figcaption id="chart-caption" className="visually-hidden">
            {result.chartSummary}
          </figcaption>
          <table className="visually-hidden">
            <caption>Performance chart data</caption>
            <thead>
              <tr>
                <th scope="col">Period</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {result.chart.map((point) => (
                <tr key={point.label}>
                  <th scope="row">{point.label}</th>
                  <td>{point.display}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      </section>

      <section
        className="result-section customers-section"
        aria-labelledby="customers-heading"
      >
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">BREAKDOWN</p>
            <h3 id="customers-heading">Top accounts</h3>
          </div>
          <UsersThree
            aria-hidden="true"
            className="section-accent-icon"
            size={20}
            weight="bold"
          />
        </div>
        <ol className="customer-list">
          {result.customers.map((customer, index) => (
            <li key={customer.name}>
              <span className="customer-rank">0{index + 1}</span>
              <span className="customer-name">{customer.name}</span>
              <span className="customer-amount">{customer.amount}</span>
              <span className="customer-share">{customer.share}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

interface DashboardState {
  activeId: string | null;
  draft: string;
  messages: readonly Message[];
  result: DashboardResult | null;
  statusMessage: string;
}

type DashboardAction =
  | { conversation: Conversation; type: "select" }
  | { type: "new-chat" }
  | { type: "set-draft"; value: string }
  | {
      assistantMessage: Message;
      result: DashboardResult;
      type: "submit";
      userMessage: Message;
    }
  | { message: string; type: "status" };

const INITIAL_DASHBOARD_STATE: DashboardState = {
  activeId: "sales",
  draft: "",
  messages: BASE_MESSAGES,
  result: SALES_RESULT,
  statusMessage: "Ready for your next question.",
};

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case "select": {
      return {
        ...state,
        activeId: action.conversation.id,
        draft: "",
        messages: action.conversation.messages,
        result: action.conversation.result,
        statusMessage: `${action.conversation.title} loaded.`,
      };
    }
    case "new-chat": {
      return {
        ...state,
        activeId: null,
        draft: "",
        messages: [],
        result: null,
        statusMessage: "New conversation started.",
      };
    }
    case "set-draft": {
      return { ...state, draft: action.value };
    }
    case "submit": {
      return {
        ...state,
        activeId: null,
        draft: "",
        messages: [
          ...state.messages,
          action.userMessage,
          action.assistantMessage,
        ],
        result: action.result,
        statusMessage: "Clario added a demo result to the conversation.",
      };
    }
    case "status": {
      return { ...state, statusMessage: action.message };
    }
    default: {
      return state;
    }
  }
};

const ClarioDashboard = () => {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    INITIAL_DASHBOARD_STATE
  );

  const selectConversation = (conversation: Conversation) => {
    dispatch({ conversation, type: "select" });
  };

  const startNewChat = () => dispatch({ type: "new-chat" });

  const submitQuestion = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      dispatch({ message: "Enter a question before sending.", type: "status" });
      return;
    }

    const nextResult = getResultForPrompt(trimmedQuestion);
    const now = "Just now";
    const messageId = state.messages.length;
    dispatch({
      assistantMessage: {
        content: getResponseForPrompt(trimmedQuestion, nextResult),
        id: `assistant-${messageId}`,
        role: "assistant",
        time: now,
      },
      result: nextResult,
      type: "submit",
      userMessage: {
        content: trimmedQuestion,
        id: `user-${messageId}`,
        role: "user",
        time: now,
      },
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion(state.draft);
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
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
    <div className="dashboard-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <aside className="dashboard-sidebar" aria-label="Conversation history">
        <div className="brand-lockup">
          <div className="brand-symbol" aria-hidden="true">
            C
          </div>
          <div>
            <p className="brand-kicker">VEDHASOFT AI</p>
            <p className="brand-name">
              Clario<span>*</span>
            </p>
          </div>
        </div>
        <p className="brand-description">
          Business intelligence for SAP Business One.
        </p>

        <Button
          type="button"
          className="new-chat-button"
          variant="default"
          size="lg"
          onClick={startNewChat}
        >
          <Plus aria-hidden="true" size={18} weight="bold" />
          New chat
        </Button>

        <div className="history-heading">
          <p className="eyebrow">RECENT QUESTIONS</p>
          <span>03</span>
        </div>
        <ConversationList
          activeId={state.activeId}
          conversations={CONVERSATIONS}
          onSelect={selectConversation}
        />

        <div className="sidebar-spacer" />
        <div className="workspace-status">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>SAP B1 demo data</strong>
            <span>Read-only workspace</span>
          </div>
          <CheckCircle aria-hidden="true" size={17} weight="fill" />
        </div>
        <p className="sidebar-footer">v1.0 · Demo workspace</p>
      </aside>

      <main
        id="main-content"
        className="chat-column"
        aria-labelledby="dashboard-heading"
      >
        <header className="workspace-header">
          <div className="mobile-brand" aria-label="Clario">
            <div className="brand-symbol small" aria-hidden="true">
              C
            </div>
            <span>
              Clario<span>*</span>
            </span>
          </div>
          <div className="workspace-title">
            <p className="eyebrow">WORKSPACE / BUSINESS INTELLIGENCE</p>
            <h1 id="dashboard-heading">Ask Clario</h1>
            <p>Type a business question. Get a decision-ready view.</p>
          </div>
          <div className="header-actions">
            <span className="connection-pill">
              <Database aria-hidden="true" size={15} weight="duotone" /> Demo
              company
            </span>
            <ThemeToggle />
          </div>
        </header>

        <details className="mobile-history">
          <summary>
            <span>Recent questions</span>
            <span className="summary-count">03</span>
          </summary>
          <ConversationList
            activeId={state.activeId}
            conversations={CONVERSATIONS}
            onSelect={selectConversation}
          />
        </details>

        <section className="messages-region" aria-label="Chat conversation">
          {state.messages.length === 0 ? (
            <div className="welcome-state">
              <div className="welcome-icon">
                <Sparkle aria-hidden="true" size={27} weight="fill" />
              </div>
              <p className="eyebrow">YOUR SAP B1 COPILOT</p>
              <h2>What should we look at?</h2>
              <p>
                Ask about sales, inventory, purchasing, or customers. Clario
                turns plain language into a useful business view.
              </p>
            </div>
          ) : (
            <div className="message-list">
              {state.messages.map((message) => (
                <article className={`message ${message.role}`} key={message.id}>
                  <div className="message-avatar" aria-hidden="true">
                    {message.role === "assistant" ? (
                      <Sparkle size={17} weight="fill" />
                    ) : (
                      "Y"
                    )}
                  </div>
                  <div className="message-body">
                    <div className="message-meta">
                      <strong>
                        {message.role === "assistant" ? "Clario" : "You"}
                      </strong>
                      <time>{message.time}</time>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section
          className="suggestions-section"
          aria-labelledby="suggestions-heading"
        >
          <div className="section-heading-row compact">
            <div>
              <p className="eyebrow" id="suggestions-heading">
                TRY A QUESTION
              </p>
            </div>
            <span className="suggestions-note">
              No SQL. No reports. No consultant.
            </span>
          </div>
          <div className="prompt-list">
            {PROMPTS.map(({ icon: Icon, label }) => (
              <Button
                type="button"
                className="prompt-button"
                variant="outline"
                key={label}
                onClick={() => submitQuestion(label)}
              >
                <Icon aria-hidden="true" size={16} weight="duotone" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        <form className="composer" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="question-input">
            Ask a question about your SAP Business One data
          </label>
          <textarea
            id="question-input"
            name="question"
            rows={1}
            value={state.draft}
            onChange={(event) =>
              dispatch({ type: "set-draft", value: event.target.value })
            }
            onKeyDown={handleComposerKeyDown}
            placeholder="Ask about sales, inventory, customers, or purchases..."
          />
          <Button
            type="submit"
            className="send-button"
            variant="default"
            size="icon-lg"
            aria-label="Send question"
          >
            <PaperPlaneTilt aria-hidden="true" size={19} weight="fill" />
          </Button>
          <p>Press Enter to send · Shift+Enter for a new line</p>
        </form>
        <output
          className="visually-hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.statusMessage}
        </output>
      </main>

      <aside className="result-panel" aria-label="Insight preview">
        <div className="result-panel-header">
          <div>
            <p className="eyebrow">CLARIO OUTPUT</p>
            <p className="result-panel-title">Insight preview</p>
          </div>
          <span className="sample-badge">SAMPLE DATA</span>
        </div>
        <ResultPanel result={state.result} />
        <div className="result-panel-footer">
          <Moon aria-hidden="true" size={15} weight="duotone" /> Built for clear
          decisions, not more reports.
        </div>
      </aside>
    </div>
  );
};

export { ClarioDashboard };
