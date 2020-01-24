const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/mainWindow.html`);
    // close entire app if main window is closed
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

function createAddWindow(window) {
    addWindow = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/addTodo.html`);
    // addWindow.removeMenu();

    addWindow.on('closed', () => addWindow = null);
}

const menuTemplate = [
    {
        label: 'File',
        submenu: [

            {
                label: 'New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Todos',
                click() {
                    mainWindow.webContents.send('clear:todos');
                }
            },
            {
                label: 'Quit',
                accelerator: (() => {
                    if (process.platform === 'darwin')
                        return 'Command+Q';
                    return 'Control+Q';
                })(),
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Control+Q',
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

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+alt+I' : 'Control+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}