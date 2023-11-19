import { Box, CircularProgress } from "@mui/material";
import { bgGradient } from 'src/theme/css';
import { alpha, useTheme } from '@mui/material/styles';

export default function LoadingPage() {
    const theme = useTheme();
    
    return (
        <Box
            sx={{
                ...bgGradient({
                    color: alpha(theme.palette.background.default, 0.9),
                    imgUrl: '/assets/background/overlay_4.jpg',
                }),
                height: 1,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        </Box>
    )
}