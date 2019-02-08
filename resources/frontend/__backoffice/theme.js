import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },

        secondary: {
            main: '#b0bec5',
        },
    },

    typography: {
        useNextVariants: true,
        htmlFontSize: 14,
    },
});
