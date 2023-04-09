import { Avatar } from "flowbite-react";
import { formatTime } from "../../helpers/time";

export type Tweet = {
  avatar: string;
  name: string;
  twitterName: string;
  content: string;
  timestamp: number;
};
export default function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div className="w-full">
      <Avatar img={tweet.avatar} rounded={true} className="justify-start">
        <div className="space-y-[3px] font-medium dark:text-white">
          <div>{tweet.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {tweet.twitterName}
          </div>
        </div>
      </Avatar>
      <div
        className="text-title text-[12px] my-2"
        dangerouslySetInnerHTML={{ __html: tweet.content }}
      />
      <span className="text-description text-[10px]">
        {formatTime(tweet.timestamp)}
      </span>
    </div>
  );
}
