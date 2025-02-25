import { useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/index.module.css';
import Board from '@/components/board';
import Score from '@/components/score';
import Sidebar from '@/components/sidebar';
import Profile from '@/components/profile';
import ComingSoon from '@/components/ComingSoon';
import Footer from '@/components/Footer';

type Tab = 'game' | 'marketplace' | 'profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('game');

  const renderContent = () => {
    switch (activeTab) {
      case 'game':
        return (
          <div className={styles.gameContainer}>
            <div className={styles.gameHeader}>
              <h1>2048</h1>
              <Score />
            </div>
            <main className={styles.gameMain}>
              <Board onTabChange={setActiveTab} />
            </main>
            <div className={styles.gameDescription}>
              <h2>关于 Monad 2048</h2>
              <p>
                Monad 2048 是一款基于区块链的经典 2048 游戏。玩家可以通过滑动方块合并相同数字，
                获得高分后将游戏成就铸造为独特的 NFT。每个 NFT 都有不同的稀有度，
                并存储在 IPFS 上，确保其永久性和不可篡改性。
              </p>
              <p>
                游戏还提供代币奖励系统，玩家可以通过日常游戏和高分挑战赚取代币。
                这些代币可用于游戏内特权和未来的 NFT 交易市场。
              </p>
              <h3>主要特点</h3>
              <ul>
                <li>经典 2048 游戏玩法</li>
                <li>基于游戏成就的 NFT 铸造系统</li>
                <li>代币奖励机制</li>
                <li>即将推出的 NFT 交易市场</li>
                <li>支持 Monad 测试网</li>
              </ul>
            </div>
          </div>
        );
      case 'marketplace':
        return <ComingSoon />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <div className={styles.gameContainer}>
            <div className={styles.gameHeader}>
              <h1>2048</h1>
              <Score />
            </div>
            <main className={styles.gameMain}>
              <Board onTabChange={setActiveTab} />
            </main>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Monad 2048 - 区块链版 2048 游戏，Monad 公链 | 赚取 NFT 和代币</title>
        <meta name="description" content="玩经典的 2048 游戏，获得高分并铸造独特的 NFT。在 MONAD 公链记录您的成就，赚取代币奖励。" />
        <meta name="keywords" content="2048, GameFi, 区块链游戏, NFT, 加密游戏, Play-to-Earn, Web3, Monad" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="@LongLongLongBTC, @SuruiLiu" />

        {/* Open Graph 标签，用于社交媒体分享 */}
        <meta property="og:title" content="Monad 2048 - 区块链版 2048 游戏" />
        <meta property="og:description" content="玩经典的 2048 游戏，获得高分并铸造独特的 NFT。在区块链上记录您的成就，赚取代币奖励。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://monad2048.xyz" /> {/* 替换为您的实际网址 */}
        <meta property="og:image" content="https://monad2048.xyz/public/logo512.png" /> {/* 替换为您的实际图片 URL */}

        {/* Twitter 卡片标签 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Monad 2048 - 区块链版 2048 游戏" />
        <meta name="twitter:description" content="玩经典的 2048 游戏，获得高分并铸造独特的 NFT。" />
        <meta name="twitter:image" content="https://monad2048.xyz/public/logo512.png" /> {/* 替换为您的实际图片 URL */}

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://monad2048.xyz" /> {/* 替换为您的实际网址 */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGame",
              "name": "2048 GameFi",
              "description": "区块链版 2048 游戏，玩家可以铸造 NFT 并赚取代币奖励。",
              "genre": ["Puzzle", "Blockchain", "GameFi"],
              "gamePlatform": ["Web Browser", "Blockchain"],
              "applicationCategory": "Game",
              "operatingSystem": "Any",
              "author": {
                "@type": "Person",
                "name": "LongLongLongBTC"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </Head>

      <Sidebar currentTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.content}>
        {renderContent()}
        <Footer />
      </div>
    </div>
  );
}
