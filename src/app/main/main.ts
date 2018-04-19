import {app, BrowserWindow, dialog, Event, ipcMain, Menu, shell} from 'electron';
import {GlobalSettings} from '../../domain/states/objects/settings/GlobalSettings';
import {isDev, isMacOS} from '../shared/environment';
import {packageJson} from '../shared/package';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import WebContents = Electron.WebContents;

const electronSettings               = require('electron-settings');
const globalSettings: GlobalSettings = electronSettings.get('globalSettings') || {
    inlineForms: false,
};

let win: BrowserWindow | null;
const isDevelopment = isDev();

function createWindow() {
    win = new BrowserWindow({width: 1000, height: 800});

    const url: string = isDevelopment
        ? `http://localhost:${process.env.DEV_SERVER_PORT}`
        : `file://${__dirname}/index.html`;

    win.loadURL(url);

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    if (isDevelopment) {
        win.webContents.openDevTools();
    }

    createMenu();
}

function createMenu() {
    let template: MenuItemConstructorOptions[] = [
        {
            label:   'File',
            submenu: [
                {
                    label: 'Open Project',
                    click: function () {
                        if (win) {
                            openSelectProjectDialog(win.webContents);
                        }
                    },
                },
                {
                    label: 'Close Project',
                    click: function () {
                        if (win) {
                            win.webContents.send('close-project');
                        }
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Quit',
                    role:  'quit',
                },
            ],
        },
    ];

    if (isDevelopment) {
        template.push({
            label:   'View',
            submenu: [
                {role: 'reload'},
                {role: 'forcereload'},
                {role: 'toggledevtools'},
                {type: 'separator'},
                {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'},
            ],
        });
    }

    template.push({
        label:   'Settings',
        submenu: [
            {
                label:   'Inline Forms',
                type:    'checkbox',
                checked: globalSettings.inlineForms,
                click:   function () {
                    if (win) {
                        win.webContents.send('toggle-settings-inlineForms');
                    }
                },
            },
            {type: 'separator'},
            {
                label: 'Open Settings Folder',
                click: function () {
                    shell.showItemInFolder(electronSettings.file());
                },
            },
        ],
    });

    template.push({
        role: 'editMenu',
    });

    template.push({
        role:    'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'},
        ],
    });

    if (isMacOS() && template[0] && template[0].submenu) {
        let submenus = (template[0].submenu as MenuItemConstructorOptions[]);

        template[0].submenu = [
            {type: 'separator'},
            {role: 'about'},
            ...submenus,
        ];
    }

    template.push({
        label:   'Help',
        submenu: [
            {
                label: 'Open Download Page',
                click: function () {
                    shell.openExternal(packageJson.downloadUrl);
                },
            },
        ],
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('open-select-project-dialog', function (event: Event) {
    openSelectProjectDialog(event.sender);
});

function openSelectProjectDialog(webContents: WebContents) {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters:    [
            {name: 'Project Files', extensions: ['json']},
        ],
    }, function (files: string[]) {
        if (files) {
            webContents.send('project-selected', files[0]);
        }
    });
}