const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/mainWindow.html`);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { label: 'New Todo' },
            {
                label: 'Quit',
                accelerator: (() => {
                    if (process.platform === 'darwin')
                        return 'Command+Q';
                    return 'Control+Q';
                })(),
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}