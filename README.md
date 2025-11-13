# Get-a-clue

A mystery detective board game where you navigate a grid-based mansion, solve cases, and gain experience. Play solo or team up with other detectives in real-time multiplayer!

## Features

### 🎮 Unified Board Game Experience
- **Grid-based Movement** - Navigate a 9x9 mansion grid with connected rooms
- **Character Selection** - Choose from 6 unique detective avatars
- **XP & Leveling System** - Gain experience by solving cases and level up
- **Cases Solved Tracking** - Track your detective career progress

### 🌐 Solo & Multiplayer Modes
- **Solo Play** - Play alone and hone your detective skills
- **Real-time Multiplayer** - Create or join rooms with simple 6-character codes
- **Live Updates** - See other players move in real-time via Socket.IO
- **Player Stats** - View all connected players' levels and cases solved

### 🎴 Card Collection (Coming Soon)
- Placeholder UI for future Firebase integration
- Card packs, trading, and marketplace features planned

### 🎨 Vintage Detective Aesthetic
- Case file styling with typewriter text
- Worn edges and coffee stain effects
- Retro detective bureau design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ray-seal/Get-a-clue.git
cd Get-a-clue
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### Development

#### Run Both Client & Server Together (Recommended)

```bash
npm run dev
```

This starts:
- **Client** at [http://localhost:3000](http://localhost:3000)
- **Server** at [http://localhost:3001](http://localhost:3001)

#### Run Client Only (Solo Mode Only)

```bash
npm run dev:client
```

#### Run Server Only

```bash
npm run dev:server
```

### Production Build

```bash
# Build both client and server
npm run build

# Start client
npm start

# Start server (in separate terminal)
npm run start:server
```

### Environment Variables

Create a `.env.local` file in the root directory (optional):

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

For the server, you can set (optional):

```env
PORT=3001
CLIENT_URL=http://localhost:3000
```

## How to Play

### Solo Mode

1. Go to the home page
2. Click **"PLAY SOLO"**
3. Choose your detective name and avatar
4. Click **"🎲 Roll Dice"** to get movement points (1-6 steps)
5. Use **arrow keys** or **click highlighted tiles** to move around the mansion
6. Click **"🔍 Search for Clues"** when in a room to find evidence
7. Click **"Solve Case"** to gain +50 XP and increment cases solved
8. Track your progress, clues found, and XP in the HUD

### Multiplayer Mode

#### Creating a Room

1. Go to the home page
2. Click **"MULTIPLAYER"**
3. Click **"CREATE ROOM"**
4. Choose your detective name and avatar
5. Share the **6-character room code** with friends
6. Play together in real-time!

#### Joining a Room

1. Go to the home page
2. Click **"MULTIPLAYER"**
3. Enter the **6-character room code** from your friend
4. Click **"JOIN"**
5. Choose your detective name and avatar
6. Start playing!

### Controls

- **Roll Dice Button** - Roll a die to get 1-6 movement points
- **Arrow Keys** or **WASD** - Move your detective (uses movement points)
- **Click Tile** - Move to a highlighted tile within your movement range
- **Search for Clues Button** - Search the current room for clues (awards XP)
- **Solve Case Button** - Gain +50 XP and increment cases solved
- **Card Collection Button** - View placeholder for future card features

## Game Mechanics

### Dice-Based Movement
- Click **"Roll Dice"** to get 1-6 movement points at the start of your turn
- Each move to an adjacent tile costs 1 movement point
- Only adjacent tiles (north, south, east, west) are accessible
- Green highlighted tiles show where you can move with remaining points
- Roll dice again when you run out of movement points

### Clue Searching
- When you enter a room, a **"Search for Clues"** button appears
- Different rooms have different probabilities of containing clues
- Finding a clue awards XP (15-40 XP depending on the clue)
- Clues are tracked in your inventory (shown in HUD as "Clues Found")
- Each clue can only be found once per player

### Room System
- The mansion contains 9 distinct rooms:
  - **Library** - High chance for documents and books
  - **Study** - Letters, receipts, and keys
  - **Dining Hall** - Fingerprints and weapons
  - **Kitchen** - Footprints and evidence
  - **Ballroom** - Fabric and photographs
  - **Lounge** - Cigars and fingerprints
  - **Conservatory** - Outdoor evidence
  - **Billiard Room** - Social evidence
  - **Grand Foyer** - Entrance evidence

### Experience & Leveling
- Finding clues awards **15-40 XP** depending on the clue type
- Solving a case awards **50 XP**
- Level formula: `level = floor(sqrt(xp/100)) + 1`
- Level 1: 0-99 XP
- Level 2: 100-399 XP
- Level 3: 400-899 XP
- And so on...

### Multiplayer
- Room codes are **6 alphanumeric characters** (lowercase)
- Rooms stay active while players are connected
- Inactive rooms are cleaned up after 30 minutes
- All players see each other's movements, dice rolls, and clue discoveries in real-time
- Each player has their own movement points and inventory

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Socket.IO** - Real-time multiplayer communication
- **Express** - Backend server framework
- **nanoid** - Secure room code generation

## Project Structure

```
Get-a-clue/
├── app/                      # Next.js app directory
│   ├── components/           # React components
│   │   ├── CharacterSelect.tsx
│   │   ├── GameBoard.tsx
│   │   ├── HUD.tsx
│   │   └── CardCollection.tsx
│   ├── game/                 # Game page
│   │   └── page.tsx
│   └── page.tsx              # Home page
├── lib/                      # Shared libraries
│   ├── models/              # Data models
│   │   ├── grid.ts          # Grid and room logic
│   │   └── player.ts        # Player model
│   ├── services/            # Services
│   │   └── socket.ts        # Socket.IO client wrapper
│   └── utils/               # Utilities
│       └── leveling.ts      # XP and leveling logic
├── server/                   # Backend server
│   └── src/
│       └── index.ts         # Socket.IO server
└── public/                   # Static assets
    └── assets/
        └── characters/      # Character sprite SVGs
```

## Future Features (Not Yet Implemented)

These features are planned for future releases:

- 🔐 **Firebase Authentication** - Persistent user accounts
- 🎴 **Card System** - Collectible mystery cards
- 🏪 **Card Marketplace** - Buy, sell, and trade cards
- 💾 **Persistent Rooms** - Rooms saved to Firestore
- 📊 **Leaderboards** - Global player rankings
- 🎯 **Achievements** - Unlock badges and rewards

## Development Notes

### Server Details

- **Standalone Package** - The server is a completely separate package with its own `package.json`, `tsconfig.json`, and dependencies
- **Independent Build** - Server can be built and deployed independently from the Next.js client
- **Excluded from Next Build** - The root TypeScript configuration excludes the server directory to prevent build conflicts
- Default port: **3001**
- Uses Socket.IO v4 for real-time communication
- In-memory room storage (no database required for MVP)
- Automatic cleanup of inactive rooms

### Client Details

- Built with Next.js 16 App Router
- Client-side state management for solo mode
- Socket.IO integration for multiplayer
- Responsive design with Tailwind CSS

## Deploy to Vercel

### Client Deployment

This app is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_SERVER_URL` to your server URL
3. Deploy!

**Note**: The server directory is automatically excluded from Vercel deployments via `.vercelignore`. Only the Next.js client is deployed to Vercel.

### Server Deployment

The Socket.IO server is a standalone package that must be deployed separately to a service that supports long-running Node.js processes.

#### Recommended Hosting Services

- **Railway** - Easy deployment with Git integration
- **Render** - Free tier available, good for hobby projects
- **Fly.io** - Global edge deployment
- **DigitalOcean App Platform** - Managed platform with auto-scaling
- **Heroku** - Classic PaaS option

#### Deployment Steps

1. **Install server dependencies** (if not already done):
   ```bash
   cd server
   npm install
   ```

2. **Build the server**:
   ```bash
   npm run build
   ```
   This compiles TypeScript to JavaScript in the `dist` directory.

3. **Deploy to your chosen service**:
   - Most services can deploy directly from the `server` directory
   - Use `npm start` as the start command (runs `node dist/index.js`)
   - Or use `npm run dev` for development environments

4. **Set environment variables**:
   - `PORT` - Port for the server (default: 3001)
   - `CLIENT_URL` - URL of your deployed client (e.g., `https://yourapp.vercel.app`)

5. **Update client environment**:
   - Set `NEXT_PUBLIC_SERVER_URL` in Vercel to point to your deployed server URL

#### Manual Deployment Example

If deploying to a VPS or custom server:

```bash
# On your server
cd /path/to/app
cd server
npm ci --production
npm run build
PORT=3001 CLIENT_URL=https://yourapp.vercel.app npm start
```

#### Using Process Managers

For production deployments on VPS, use a process manager:

```bash
# Using PM2
npm install -g pm2
cd server
pm2 start dist/index.js --name "get-a-clue-server"
```

## Manual QA / Testing

### Testing Dice-Based Movement and Clue System

1. **Start both client and server**:
   ```bash
   npm run dev
   ```
   This will start the client at http://localhost:3000 and server at http://localhost:3001

2. **Test Solo Mode**:
   - Go to http://localhost:3000
   - Click "PLAY SOLO"
   - Choose a character name and avatar
   - Click "Roll Dice" - should display a number 1-6 and show movement points in HUD
   - Click a highlighted green tile or use arrow keys to move
   - Movement points should decrease with each move
   - When you enter a room, "Search for Clues" button should appear
   - Click "Search for Clues" - should either find a clue (with XP award) or show "nothing found"
   - Clues found should increment in the HUD
   - XP should increase when clues are found

3. **Test Multiplayer Mode**:
   - Open two browser windows (or incognito + regular)
   - In Window 1:
     - Go to http://localhost:3000
     - Click "MULTIPLAYER" → "CREATE ROOM"
     - Choose character and note the room code
   - In Window 2:
     - Go to http://localhost:3000
     - Click "MULTIPLAYER"
     - Enter the room code from Window 1
     - Choose character
   - Both players should see each other on the board
   - Test in Window 1:
     - Roll dice - Window 2 should see "[Player] rolled X"
     - Move around - Window 2 should see player move
     - Search for clues - Window 2 should see "[Player] found a clue"
   - Test in Window 2:
     - Repeat above - Window 1 should see all actions
   - Both players should maintain independent movement points and inventories

4. **Expected Behaviors**:
   - ✅ Dice rolls generate 1-6 movement points
   - ✅ Movement consumes points (1 per tile)
   - ✅ Can only move when movement points > 0
   - ✅ Green overlay shows reachable tiles
   - ✅ "Search for Clues" appears when in a room
   - ✅ Clue searches award 15-40 XP
   - ✅ Each clue can only be found once per player
   - ✅ All actions synchronize in multiplayer
   - ✅ HUD displays movement points, clues found, XP, level

## Troubleshooting

### Multiplayer not working?

- Ensure server is running on port 3001
- Check console for Socket.IO connection errors
- Verify `NEXT_PUBLIC_SERVER_URL` environment variable
- Check firewall settings

### Build errors?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clean server install
cd server
rm -rf node_modules package-lock.json
npm install
```

## License

This is a generic implementation that does not breach any copyright laws.