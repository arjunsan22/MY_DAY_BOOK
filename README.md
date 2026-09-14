<div align="center">
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nextjs/nextjs.png" alt="Next.js" width="80" height="80" />
  
  # 📘 My Day Book
  
  **A beautiful, lightning-fast personal daily work and productivity tracker.** <br/>
  Built specifically to maintain chronological logs of daily tasks, monitor active time versus break time, and review historical productivity metrics—all with a premium user interface.
</div>

---

## ✨ Features

- **⏱️ Active Work Timer:** Start a session with one click and let the tracker calculate your real-time duration. The timer continues running perfectly even if your system sleeps or the browser closes.
- **📅 Interactive Timeline:** View your daily activities structured beautifully on a chronological timeline. Overlapping times are automatically highlighted!
- **📊 Productivity Analytics:** Instantly see your total logged time versus actual work time (excluding breaks). Detailed monthly and daily category breakdowns are available in the Reports section.
- **📝 Daily Notes:** Keep track of ad-hoc thoughts or reminders tied to specific dates.
- **💾 Local First & Private:** All data is safely stored in your browser's `localStorage`. No accounts, no servers, complete privacy.
- **🔄 Import/Export:** Easily backup your work history as a JSON file and restore it at any time.
- **🎨 Premium UI/UX:** Crafted with **TailwindCSS** and powered by **GSAP** for buttery-smooth animations, staggered list entrances, and physics-based modal bounces.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [GSAP (GreenSock)](https://gsap.com/) & `@gsap/react`
- **Icons:** Custom SVG / Heroicons inspired
- **Storage:** Browser `localStorage` API

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/My_Day_Book.git
   cd My_Day_Book
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## 📁 Project Structure

```text
My_Day_Book/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (Pages & Layout)
│   ├── components/
│   │   ├── dashboard/      # Main dashboard components (Timeline, Stats, etc.)
│   │   ├── layout/         # Sidebar, Header, Modals
│   │   ├── ui/             # Reusable UI elements (FadeIn, ConfirmDialog)
│   │   └── work/           # Work logic components (StartWork, ActiveCard)
│   └── lib/                # Utilities and Storage logic
│       ├── storage/        # LocalStorage CRUD operations
│       ├── utils/          # Time and Date formatting utilities
│       └── constants.js    # Category data and config
└── package.json            # Project metadata and dependencies
```

## 🤝 Contributing

This is a personal project, but suggestions, bug reports, and pull requests are always welcome! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License.
