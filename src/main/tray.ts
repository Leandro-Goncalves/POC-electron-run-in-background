import { app, BrowserWindow, Menu, Tray } from 'electron';

const CustomTray = (
  iconPath: string,
  mainWindow: BrowserWindow,
  quit: () => void
): Tray => {
  const tray = new Tray(iconPath);

  const menuConfig = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        quit();
      },
    },
  ]);

  tray.setContextMenu(menuConfig);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  return tray;
};

export default CustomTray;
