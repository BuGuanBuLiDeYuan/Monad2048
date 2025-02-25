import styles from '@/styles/footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>
                made with ❤ by{' '}
                <Link
                    href="https://x.com/LongLongLongBTC"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    @LongLongLongBTC
                </Link>
                , inspired by{' '}
                <Link
                    href="https://github.com/SuruiLiu"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    @SuruiLiu
                </Link>
            </p>
        </footer>
    );
}