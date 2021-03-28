import { TestRunnerPlugin } from '@web/test-runner-core';
import type { ChromeLauncher } from '@web/test-runner-chrome';
import type { PlaywrightLauncher } from '@web/test-runner-playwright';

export type SendKeysPayload =
  | { type: string; press: undefined }
  | { type: undefined; press: string };

export function sendKeysPlugin(): TestRunnerPlugin<SendKeysPayload> {
  return {
    name: 'send-keys-command',
    async executeCommand({ command, payload, session }): Promise<any> {
      if (command === 'send-keys' && payload) {
        // handle specific behavior for playwright
        if (session.browser.type === 'playwright') {
          const page = (session.browser as PlaywrightLauncher).getPage(session.id);
          if (payload.type) {
            await page.keyboard.type(payload.type);
            return true;
          } else if (payload.press) {
            await page.keyboard.press(payload.press);
            return true;
          }
        }

        // handle specific behavior for puppeteer
        if (session.browser.type === 'puppeteer') {
          const page = (session.browser as ChromeLauncher).getPage(session.id);
          if (payload.type) {
            await page.keyboard.type(payload.type);
            return true;
          } else if (payload.press) {
            await page.keyboard.press(payload.press);
            return true;
          }
        }

        // you might not be able to support all browser launchers
        throw new Error(`Sending keys is not supported for browser type ${session.browser.type}.`);
      }
    },
  };
}
