import ReactDOM from 'react-dom/client';
import App from './App';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://c84e0cb05bb94982c8a10829283568fa@o251958.ingest.sentry.io/4506844846751744',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [import.meta.env.VITE_API_DOMAIN],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
