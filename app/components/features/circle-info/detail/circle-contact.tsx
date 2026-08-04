import { MdSend, MdOpenInNew } from "react-icons/md";
import type { CircleContact as CircleContactType } from "~/types/circle";
import styles from "./circle-contact.module.css";

type CircleContactProps = {
  contact: CircleContactType;
};

// SNS・連絡先。代表者・連絡先と外部リンクをまとめて表示する。
export default function CircleContact({ contact }: CircleContactProps) {
  const rows = [
    { label: "代表者", value: contact.representative },
    { label: "連絡先", value: contact.email },
  ].filter((row) => row.value !== null && row.value !== "");

  if (rows.length === 0 && contact.links.length === 0) return null;

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>
        <span className={styles.titleIcon}>
          <MdSend size={16} aria-hidden />
        </span>
        SNS・連絡先
      </h3>

      <div className={styles.body}>
        {rows.length > 0 && (
          <dl className={styles.rows}>
            {rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <dt className={styles.label}>{row.label}</dt>
                <dd className={styles.value}>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {contact.links.length > 0 && (
          <ul className={styles.links}>
            {contact.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.link}
                >
                  <span className={styles.linkLabel}>{link.label}</span>
                  <MdOpenInNew
                    size={20}
                    aria-hidden
                    className={styles.linkIcon}
                  />
                  <span className={styles.srOnly}>
                    （新しいタブで開きます）
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
