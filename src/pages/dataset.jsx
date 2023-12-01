import { Helmet } from 'react-helmet-async';

import { DatasetView } from 'src/sections/dataset/view';

// ----------------------------------------------------------------------

export default function DatasetPage() {
  return (
    <>
      <Helmet>
        <title> Dataset | NLP Bot </title>
      </Helmet>

      <DatasetView />
    </>
  );
}
