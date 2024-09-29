"use client";

import { useUsers } from "@/contexts/user-context";
import { GithubUser } from "@/models/api";
import Image from "next/image";

const usersMap = new Map<number, GithubUser[]>();

const InfiniteList = () => {
  const users = useUsers();

  usersMap.set(users.data[0].id, users.data);

  const userList = [...usersMap.values()].flat();

  return (
    <ul className="p-4 bg-slate-700 flex flex-col items-center gap-8">
      {userList.map((item) => (
        <li key={item.id}>
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
