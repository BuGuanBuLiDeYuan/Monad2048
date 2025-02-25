import styles from '@/styles/coming-soon.module.css';
import Link from 'next/link';

export default function ComingSoon() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.comingSoon}>
                    <span>Coming Soon</span>
                    <div className={styles.dots}>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                    </div>
                </div>
                <p>我们正在努力开发 NFT 交易市场功能，敬请期待！</p>
                <p>这是 <Link href="https://x.com/LongLongLongBTC">不管不理的员团队</Link>，借助 LLM 工具，在不懂编程的基础上，基于开源项目修改而来，移植到 Monad 测试网的。</p>
                <p>欢迎有志之士联系我们，一起做 Monad 测试网的开发，一起实现更多有趣的项目。</p>
            </div>
        </div>
    );
}
