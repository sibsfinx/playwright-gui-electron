import { app, BrowserWindow } from 'electron';
import { exec } from 'child_process';

const initialUrl = 'about:blank';

class MainApp {
	private mainWindow: BrowserWindow | null = null;

	public init(): void {
		app.on('ready', this.createWindow);
		app.on('window-all-closed', this.onWindowAllClosed);
	}

	private createWindow = (): void => {
		this.mainWindow = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				nodeIntegration: true
			}
		});

		this.mainWindow.loadURL(initialUrl);

		// Trigger Playwright codegen after the window loads
		this.mainWindow.webContents.on('did-finish-load', this.runPlaywrightCodegen);

		this.mainWindow.on('closed', () => {
			this.mainWindow = null;
		});
	}

	private runPlaywrightCodegen = (): void => {
		exec(`yarn playwright codegen ${initialUrl}`, (err, stdout, stderr) => {
			if (err) {
				console.error(`exec error: ${err.message}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
			if (stderr) {
				console.error(`stderr: ${stderr}`);
			}
		});
	}

	private onWindowAllClosed = (): void => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	}
}

const mainApp = new MainApp();
mainApp.init();
