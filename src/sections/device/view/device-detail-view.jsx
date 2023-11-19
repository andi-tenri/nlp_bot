import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import Iconify from 'src/components/iconify';

import ConfirmationDialogProvider, {
  useConfirmationDialog,
} from 'src/components/dialog/confirm-dialog';

import { disconnect, getQrImage, getStatus } from 'src/services/bot-service';
import { useEffect, useMemo, useState } from 'react';

// ----------------------------------------------------------------------

const STATUS_COLOR = {
  'Scanning QR': 'deepPurple',
  Connected: 'darkGreen',
  Disconnected: 'red',
};

export default function DeviceDetailPage() {
  const navigate = useNavigate();

  const { showConfirmation } = useConfirmationDialog();

  const { id } = useParams();

  const [qrImage, setQrImage] = useState('');

  const [status, setStatus] = useState({});

  const fetchStatus = async () => {
    const status = await getStatus(id);

    setStatus(status);
  };

  const fetchQrImage = async () => {
    const qrImage = getQrImage(id);

    setQrImage(qrImage);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const statusInfo = useMemo(() => {
    if (!status) return {};

    return {
      text: status.status,
      color: STATUS_COLOR[status.status],
    };
  });

  const handleRefresh = () => {
    fetchStatus();

    fetchQrImage();
  };

  const handleBack = () => {
    navigate('/device');
  };

  const handleDisconnect = async () => {
    showConfirmation({
      title: 'Disconnect Device',
      text: `Are you sure you want to disconnect device "${id}"?`,
      callback: onDisconnect,
    });
  };

  const onDisconnect = async () => {
    await disconnect(id);

    handleRefresh();
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
        {/* back button */}
        <Button
          size="small"
          onClick={handleBack}
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>

        <Typography variant="h4">Device "{id}"</Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="eva:refresh-fill" />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Stack>

      <Card>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
            <Typography variant="h5">Device Details</Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
            >
              Delete
            </Button>

            {statusInfo.text === 'Connected' && (
              <Button
                variant="contained"
                color="inherit"
                onClick={handleDisconnect}
                startIcon={<Iconify icon="eva:close-square-outline" />}
              >
                Disconnect
              </Button>
            )}
          </Stack>

          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">Device ID</Typography>
              <Typography variant="body2">{id}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">Status</Typography>
              <Typography color={statusInfo.color} variant="body2">
                {statusInfo.text}
              </Typography>
            </Stack>

            {statusInfo.text === 'Scanning QR' && (
              <Stack direction="row" alignItems="top" justifyContent="space-between">
                <Typography variant="subtitle2">QR Code</Typography>
                <Stack direction="column" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Scan this QR code to connect to the device
                  </Typography>
                  <Box sx={{ width: 256, height: 256 }}>
                    <img alt={id} src={qrImage} />
                  </Box>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Box>
      </Card>
    </Container>
  );
}
