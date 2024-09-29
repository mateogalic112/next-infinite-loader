import { GithubUser } from "@/models/api";
import Image from "next/image";

interface Props {
  users: GithubUser[];
}

const InfiniteList = ({ users }: Props) => {
  return (
    <ul className="p-4 bg-slate-700 flex flex-col items-center gap-8">
      {users.map((item) => (
        <li
          key={item.id}
          className="w-[100px] h-[100px] rounded-full overflow-hidden relative"
        >
          <Image
            src={item.avatar_url}
            alt={item.id.toString()}
            width={100}
            height={100}
            priority
          />
        </li>
      ))}
    </ul>
  );
};

export default InfiniteList;
