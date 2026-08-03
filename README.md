# Web版 がんちゃんねる

岩手大学の情報を統合するWebアプリ「がんちゃんねる」。

技術構成: React Router v7（SSR）/ TypeScript / React 19 / Tailwind CSS v4 / Vite

## ドキュメント

各種ドキュメントの正本は [`docs/`](./docs) に集約している。

- [ドキュメント目次](./docs/README.md)
- [開発規約](./docs/development-guidelines.md)
- [アーキテクチャ・ディレクトリ構成](./docs/architecture.md)
- [デザイン規約](./docs/design-guidelines.md)
- [デザイン規約の要件定義書](./docs/design-requirements.md)
- [要件・仕様](./docs/requirements.md)（作成中）

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
