- npm create vite@latest frontend-vue -- --template vue-ts

# tailwind
- npm install -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p
```
- tailwind.config.js

  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],


- src/index.css

@tailwind base;
@tailwind components;
@tailwind utilities;


- main.ts
import './index.css'

```

# router
- npm install vue-router@4


# pinia
- npm i pinia