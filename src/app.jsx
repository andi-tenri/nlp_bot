/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { Provider as ReduxProvider } from 'react-redux';
import store from 'src/store';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </ReduxProvider>
  );
}
