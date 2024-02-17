import ReactDOM from 'react-dom/client';
import App from './App';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
