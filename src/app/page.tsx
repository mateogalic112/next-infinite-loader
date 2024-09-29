import InfiniteList from "@/components/infinite-list";
import LoadingSpinner from "@/components/loading-spinner";
import { UsersProvider } from "@/contexts/user-context";
import { GithubUser, PaginatedResponse } from "@/models/api";

const getUsers = async (
  cursor: number
): Promise<PaginatedResponse<GithubUser[]>> => {
  const PER_PAGE = 12;

  const url = new URL("https://api.github.com/users");

  const params = new URLSearchParams({
    since: `${cursor}`,
    per_page: `${PER_PAGE}`,
  });
  url.search = params.toString();

  const response = await fetch(url, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch users");

  const data = await response.json();
  const users = data as GithubUser[];

  const hasNextPage = users.length === PER_PAGE;
  // Use last user id as next page cursor
  const nextPage = hasNextPage ? users[users.length - 1].id : null;

  return {
    data: users,
    nextPage,
  };
};

interface UserSearchParams {
  cursor: string | null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: UserSearchParams;
}) {
  const users = getUsers(Number(searchParams?.cursor ?? 0));

  return (
    <main>
      <h1>GitHub Users</h1>
      <div className="max-w-[400px] max-h-[360px] overflow-y-scroll pr-4">
        <UsersProvider usersPromise={users}>
          <InfiniteList />

          <LoadingSpinner />
        </UsersProvider>
      </div>
    </main>
  );
}
