import { MdMailOutline, MdMail } from "react-icons/md";
import { INQUIRY_EMAIL } from "~/constants";
import styles from "./inquiry-contact-card.module.css";

// 受け付けている内容の例。増えても縦に伸びるだけなので配列で持つ
const TOPICS = [
  "広告掲載のご相談",
  "サービスへのご意見・ご要望",
  "不具合のご報告",
];

// メールでの問い合わせ導線をまとめたカード（デザイン規約 §16.1）。
export default function InquiryContactCard() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>
        <span className={styles.titleIcon}>
          <MdMailOutline size={16} aria-hidden />
        </span>
        メールでのお問い合わせ
      </h2>

      <div className={styles.body}>
        <p className={styles.topicsLabel}>次のような内容を受け付けています。</p>

        <ul className={styles.topics}>
          {TOPICS.map((topic) => (
            <li key={topic} className={styles.topic}>
              <span aria-hidden className={styles.topicMark}>
                ・
              </span>
              <span>{topic}</span>
            </li>
          ))}
        </ul>

        <div className={styles.address}>
          <p className={styles.addressLabel}>宛先</p>
          <p className={styles.addressValue}>{INQUIRY_EMAIL}</p>
        </div>

        {/* 外部アプリ（メールアプリ）へ渡すため、Link ではなく href を使う */}
        <a href={`mailto:${INQUIRY_EMAIL}`} className={styles.mailButton}>
          <MdMail size={20} aria-hidden />
          メールを作成する
        </a>

        <p className={styles.note}>
          ※ボタンを押すと、お使いのメールアプリが開きます。
        </p>
      </div>
    </section>
  );
}
