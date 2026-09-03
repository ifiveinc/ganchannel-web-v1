import type { NewsData } from "~/types/news/news";
import NewsCard from "./news-card";
import styles from "./news-list.module.css";

type NewsListProps = {
  newsList: NewsData[];
};

// ニュースの一覧。1列に並べる（デザイン規約 §6.3）。
export default function NewsList({ newsList }: NewsListProps) {
  return (
    <ul className={styles.list}>
      {newsList.map((news) => (
        <li key={`${news.link}-${news.date}`}>
          <NewsCard news={news} />
        </li>
      ))}
    </ul>
  );
}
