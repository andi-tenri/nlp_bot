import { Helmet } from 'react-helmet-async';

import { DeviceView } from 'src/sections/device/view';

// ----------------------------------------------------------------------

export default function DevicePage() {
  return (
    <>
      <Helmet>
        <title> Device | NLP Bot </title>
      </Helmet>

      <DeviceView />
    </>
  );
}
