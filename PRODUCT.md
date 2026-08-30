# Clario product truth

- Clario is a web application for non-technical SAP Business One managers.
- Its product category is conversational business intelligence: managers ask plain-language business questions and receive explainable reports.
- SAP Business One data is read-only and is accessed through the SAP Business One Service Layer.
- Clario application persistence belongs in the dedicated `CLARIO` HANA schema; SAP company schemas are not modified.
- Accounts are administrator-created. Public signup, SMTP, and social login are intentionally out of scope.
- The current default is deterministic demo mode. A provider-neutral TanStack AI adapter can be configured later through environment variables.
- The product target is WCAG 2.2 AA, including keyboard operation, visible focus, responsive reflow, and equivalent accessible chart data.
