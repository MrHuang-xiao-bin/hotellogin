const { defineConfig } = require("vite")
import vue from '@vitejs/plugin-vue'
export default defineConfig({
	plugins:[vue()],
	server:{
		host:'0.0.0.0'
	}
})