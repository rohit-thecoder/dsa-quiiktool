import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/e2e',workers:1,use:{baseURL:'http://127.0.0.1:3137',channel:process.env.PW_CHANNEL||'chromium'},webServer:{command:'npm run start -- -p 3137',url:'http://127.0.0.1:3137',timeout:120000,reuseExistingServer:true}});
