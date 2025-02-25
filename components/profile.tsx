import { useState, useEffect } from 'react';
import styles from '@/styles/profile.module.css';
import { getProvider, getGameTokenContract, getGameNFTContract, checkAndSwitchNetwork } from '@/utils/ethers';
import { ethers } from 'ethers';
import NFTCard from './nft-card';
import { CONTRACT_ADDRESSES } from '@/contracts-abi/config';

interface NFTData {
  tokenId: string;
  highestScore: number;
  timestamp: string;
  rarity: string;
  image: string;
  metadata: any;
}

export default function Profile() {
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  // 解析base64编码的JSON数据
  const parseTokenURI = (tokenURI: string) => {
    try {
      // 移除 "data:application/json;base64," 前缀
      const base64Data = tokenURI.replace('data:application/json;base64,', '');
      // 解码base64数据
      const jsonString = atob(base64Data);
      console.log('Decoded JSON string:', jsonString); // 调试用

      // 清理JSON字符串中的控制字符
      const cleanJsonString = jsonString.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

      // 解析JSON
      return JSON.parse(cleanJsonString);
    } catch (error) {
      console.error('Raw tokenURI:', tokenURI); // 调试用
      console.error('Error parsing tokenURI:', error);
      return null;
    }
  };

  // 获取余额
  const fetchBalance = async (userAddress: string) => {
    try {
      const provider = getProvider();
      const contract = await getGameTokenContract(provider);
      if (!contract) {
        console.error('Failed to create GameToken contract');
        return;
      }
      const balance = await contract.balanceOf(userAddress);
      setBalance(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // 获取NFT图片URL
  const getNFTImageUrl = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'https://ipfs.io/ipfs/bafybeicc4xossvnz3acndhqw4zcs4xa2xgiyotpvb3ptishm75qtyeszwq';
      case 'epic':
        return 'https://ipfs.io/ipfs/bafybeifh6ifdof7mee7rqkw355tnxh2qrlu2nudze7dhbbxeqcvpuele7q';
      case 'rare':
        return 'https://ipfs.io/ipfs/bafybeiaf3fy7r2evvqlhqqpbwla3lsurie2h6cwanalp7fzpxn3cq7pwgy';
      case 'common':
      default:
        return 'https://ipfs.io/ipfs/bafybeighwgusfefm23avzsxpaqbkacrqmywfunx3lx3nywmf23uwxvb45i';
    }
  };

  // 将时间戳转换为可读格式
  const formatTimestamp = (timestamp: string) => {
    // 将时间戳转换为毫秒
    const date = new Date(Number(timestamp) * 1000);

    // 格式化为年月日
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取用户的NFT数据
  const fetchUserNFTs = async (userAddress: string) => {
    try {
      setIsLoading(true);
      console.log('开始获取NFTs, 地址:', userAddress);

      const provider = getProvider();
      const nftContract = await getGameNFTContract(provider);

      if (!nftContract) {
        console.error('合约初始化失败');
        setIsLoading(false);
        return;
      }

      console.log('NFT Contract 地址:', nftContract.target);

      try {
        // 获取用户的 NFT 数量
        const balance = await nftContract.balanceOf(userAddress);
        console.log('用户 NFT 数量:', balance.toString());

        if (balance.toString() === '0') {
          console.log('用户没有 NFT');
          setNfts([]);
          setIsLoading(false);
          return;
        }

        const userNFTs: NFTData[] = [];

        // 使用 tokenOfOwnerByIndex 方法获取用户的所有 tokenId
        for (let i = 0; i < Number(balance); i++) {
          try {
            // 获取用户拥有的第 i 个 NFT 的 tokenId
            const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
            console.log(`用户的第 ${i} 个 NFT, tokenId: ${tokenId}`);

            try {
              // 获取NFT详情
              const details = await nftContract.getNFTDetails(tokenId);
              console.log(`Token ${tokenId} 详情:`, details);

              const highestScore = details[0];
              const timestamp = details[2];
              const rarity = details[3];

              // 获取 tokenURI
              const tokenURI = await nftContract.tokenURI(tokenId);
              console.log(`Token ${tokenId} URI:`, tokenURI);

              // 解析 tokenURI
              const metadata = parseTokenURI(tokenURI);
              console.log(`Token ${tokenId} metadata:`, metadata);

              userNFTs.push({
                tokenId: tokenId.toString(),
                highestScore: Number(highestScore),
                timestamp,
                rarity,
                image: getNFTImageUrl(rarity),
                metadata
              });
            } catch (error) {
              console.error(`获取 Token ${tokenId} 详情失败:`, error);
            }
          } catch (error) {
            console.error(`获取用户的第 ${i} 个 NFT 失败:`, error);
          }
        }

        console.log('获取到的NFT数据:', userNFTs);
        setNfts(userNFTs);
      } catch (error) {
        console.error('获取用户Token失败:', error);
        console.error('错误详情:', error);
        setNfts([]);
      }
    } catch (error) {
      console.error('获取NFTs失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = getProvider();
          const accounts = await provider.send('eth_accounts', []);

          if (accounts.length > 0) {
            // 检查网络
            const networkSwitched = await checkAndSwitchNetwork();
            if (!networkSwitched) {
              console.error('网络切换失败');
              return;
            }

            // 初始化合约
            const tokenContract = await getGameTokenContract(provider);
            const nftContract = await getGameNFTContract(provider);

            if (!tokenContract || !nftContract) {
              console.error('合约初始化失败');
              return;
            }

            setAddress(accounts[0]);
            setIsConnected(true);
            setShowOverlay(false);
            setIsLoading(true);

            // 获取代币余额
            await fetchBalance(accounts[0]);
            // 获取NFT数据
            await fetchUserNFTs(accounts[0]);
            setIsLoading(false);
          } else {
            setIsConnected(false);
            setAddress('');
            setBalance('0');
            setNfts([]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          setIsLoading(false);
        }
      }
    };

    checkWalletConnection();

    // 监听钱包连接状态变化
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        // 检查网络
        const networkSwitched = await checkAndSwitchNetwork();
        if (!networkSwitched) {
          console.error('网络切换失败');
          return;
        }

        // 初始化合约
        const provider = getProvider();
        const tokenContract = await getGameTokenContract(provider);
        const nftContract = await getGameNFTContract(provider);

        if (!tokenContract || !nftContract) {
          console.error('合约初始化失败');
          return;
        }

        setAddress(accounts[0]);
        setIsConnected(true);
        setShowOverlay(false);
        setIsLoading(true);
        await fetchBalance(accounts[0]);
        await fetchUserNFTs(accounts[0]);
        setIsLoading(false);
      } else {
        setAddress('');
        setIsConnected(false);
        setShowOverlay(true);
        setBalance('0');
        setNfts([]);
      }
    };

    // 监听余额变化
    const handleBalanceChange = async () => {
      if (isConnected && address) {
        await fetchBalance(address);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleBalanceChange);
      window.ethereum.on('message', handleBalanceChange);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleBalanceChange);
        window.ethereum.removeListener('message', handleBalanceChange);
      }
    };
  }, [address, isConnected]);

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Address:</span>
          <span className={styles.value}>
            {isConnected ? address : 'Not Connected'}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Game Token:</span>
          <span className={styles.value}>
            {isConnected ? `${balance} ` : '0'}
          </span>
        </div>
      </div>

      {!isConnected && showOverlay && (
        <div className={styles.overlay} onClick={() => setShowOverlay(false)}>
          <div className={styles.connectMessage}>
            Please connect your wallet first
          </div>
        </div>
      )}

      <div className={styles.nftSection}>
        <h2>My NFTs</h2>
        {isLoading ? (
          <div className={styles.loading}>Loading NFTs...</div>
        ) : nfts.length === 0 ? (
          <p>No NFTs found. Play the game to mint some!</p>
        ) : (
          <div className={styles.grid}>
            {nfts.map((nft) => (
              <NFTCard
                key={nft.tokenId}
                metadata={{
                  id: nft.tokenId,
                  name: `Game NFT #${nft.tokenId}`,
                  description: "A Game NFT representing a game achievement",
                  image: nft.image,
                  attributes: [
                    {
                      trait_type: "Highest Score",
                      value: nft.highestScore
                    },
                    {
                      trait_type: "Rarity",
                      value: nft.rarity
                    },
                    {
                      trait_type: "Timestamp",
                      value: formatTimestamp(nft.timestamp)
                    }
                  ]
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 