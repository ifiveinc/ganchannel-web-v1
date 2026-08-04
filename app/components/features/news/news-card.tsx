import type { NewsData } from "~/types/news/news";
import iFiveIcon from "~/assets/ifive-icon.png";

type NewsCardProps = {
  newsData: NewsData;
};

export default function NewsCard({ newsData }: NewsCardProps) {
  let isImageExist: boolean = true; //表示する画像を管理するためのフラグ

  if (newsData.image == "none") {
    isImageExist = false;
  }

  const newsDate = String(newsData.date);

  const year = newsDate.slice(0, 4);
  const month = newsDate.slice(4, 6);
  const day = newsDate.slice(6, 8);

  return (
    <a
      href={newsData.link}
      className="block h-25 max-w-full rounded-2xl border border-[#999999] flex overflow-hidden"
    >
      <div className="h-full w-1/4 p-2">
        <img
          src={isImageExist ? newsData.image : iFiveIcon}
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col justify-between h-full w-3/4 p-1 bg-gradient-to-b from-white to-[#bccec2] ">
        <p className="line-clamp-2 text-sm">{newsData.title}</p>
        <div className="flex justify-between">
          <p>{`[${year},${month},${day}]`}</p>
          <p className="bg-[#004400] text-white text-center rounded-xl px-2 py-1 text-sm font-mono line-clamp-1">
            {newsData.category}
          </p>
        </div>
      </div>
    </a>
  );
}
