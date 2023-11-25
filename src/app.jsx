/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import routes from 'src/routes/sections';
import { RouterProvider } from 'react-router-dom';
import ThemeProvider from 'src/theme';
import { Provider as ReduxProvider } from 'react-redux';
import store from 'src/store';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <RouterProvider router={routes} />
      </ThemeProvider>
    </ReduxProvider>
  );
}
