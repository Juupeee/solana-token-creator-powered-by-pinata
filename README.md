# Solana Token Creator powered by Pinata

This project is a web application that allows users to create Solana tokens easily, with metadata storage powered by Pinata. It was developed as part of the [Pinata x Dev.to Hackathon](https://dev.to/challenges/pinata).

## Live Demo

Check out the live demo: [Solana Token Creator powered by Pinata](https://solana-token-creator-powered-by-pinata.vercel.app/)

## Features

- Create Solana tokens with custom metadata
- Upload token logos to Pinata IPFS
- View recently created tokens in a dynamic marquee
- Wallet integration for Solana transactions
- Dark mode support

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Solana Web3.js
- Metaplex Foundation libraries
- Pinata SDK
- React Query
- Zustand for state management
- Bun (as package manager)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   bun install
   ```
3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`:
     ```
     cp .env.example .env.local
     ```
   - Edit `.env.local` and fill in your actual values for each variable
4. Run the development server:
   ```
   bun dev
   ```

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: React components
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and API wrappers
- `src/schemas`: Zod schemas for form validation
- `public`: Static assets

## Key Components

- `FormCreateToken`: Main form for creating tokens
- `RunningTokens`: Displays recently created tokens
- `LogoUpload`: Handles token logo uploads
- `SuccessModal`: Shows transaction details after token creation

## Solana Integration

The project uses Solana Web3.js and Metaplex Foundation libraries to interact with the Solana blockchain. Key functionalities include:

- Wallet connection
- Token creation and minting
- Metadata upload to Pinata IPFS

## Pinata Integration

Pinata is used for storing token metadata and logos on IPFS. The integration is handled in the `src/lib/pinata.ts` file.

## Styling

The project uses Tailwind CSS for styling, with custom components from shadcn/ui. Dark mode is supported and can be toggled in the navbar.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
