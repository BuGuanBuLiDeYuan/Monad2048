import styles from '@/styles/nft-card.module.css';

interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

interface NFTCardProps {
  metadata: NFTMetadata;
}

export default function NFTCard({ metadata }: NFTCardProps) {
  // 直接使用传入的metadata对象
  const { name, image, attributes } = metadata;

  const highestScore = attributes.find((attr: any) => attr.trait_type === 'Highest Score')?.value || 'N/A';
  const player = attributes.find((attr: any) => attr.trait_type === 'Player')?.value || 'N/A';
  const timestamp = attributes.find((attr: any) => attr.trait_type === 'Timestamp')?.value || 'N/A';
  const rarity = attributes.find((attr: any) => attr.trait_type === 'Rarity')?.value || 'N/A';

  // 确保图片URL存在，并添加错误处理
  const imageUrl = image || 'https://ipfs.io/ipfs/bafybeighwgusfefm23avzsxpaqbkacrqmywfunx3lx3nywmf23uwxvb45i'; // 默认图片

  // 根据稀有度添加备用图片
  const getBackupImageByRarity = () => {
    const rarityValue = String(rarity).toLowerCase();
    if (rarityValue.includes('legendary')) {
      return 'https://ipfs.io/ipfs/bafybeicc4xossvnz3acndhqw4zcs4xa2xgiyotpvb3ptishm75qtyeszwq';
    } else if (rarityValue.includes('epic')) {
      return 'https://ipfs.io/ipfs/bafybeifh6ifdof7mee7rqkw355tnxh2qrlu2nudze7dhbbxeqcvpuele7q';
    } else if (rarityValue.includes('rare')) {
      return 'https://ipfs.io/ipfs/bafybeiaf3fy7r2evvqlhqqpbwla3lsurie2h6cwanalp7fzpxn3cq7pwgy';
    } else {
      return 'https://ipfs.io/ipfs/bafybeighwgusfefm23avzsxpaqbkacrqmywfunx3lx3nywmf23uwxvb45i';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={name || 'NFT'}
          className={styles.image}
          onError={(e) => {
            // 图片加载失败时使用备用图片
            const target = e.target as HTMLImageElement;
            console.log('Image failed to load, using backup:', target.src);
            target.src = getBackupImageByRarity();
          }}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{name || 'Unnamed NFT'}</h3>
        <div className={styles.attributes}>
          <div className={styles.attribute}>
            <span className={styles.label}>Highest Score: </span>
            <span className={styles.value}>{highestScore}</span>
          </div>
          <div className={styles.attribute}>
            <span className={styles.label}>Timestamp: </span>
            <span className={styles.value}>{timestamp}</span>
          </div>
          <div className={styles.attribute}>
            <span className={styles.label}>Rarity: </span>
            <span className={styles.value}>{rarity}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 