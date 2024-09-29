import InfiniteList from "@/components/infinite-list";
import LoadingSpinner from "@/components/loading-spinner";
import { UsersProvider } from "@/contexts/user-context";
import { GithubUser, PaginatedResponse } from "@/models/api";

const getUsers = async (
  page: number
): Promise<PaginatedResponse<GithubUser[]>> => {
  const PER_PAGE = 12;

  const url = new URL("https://api.github.com/users");

  const params = new URLSearchParams({
    since: "0",
    per_page: `${page * PER_PAGE}`,
  });
  url.search = params.toString();

  const response = await fetch(url, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch users");

  const users = (await response.json()) as GithubUser[];

  const hasNextPage = users.length === page * PER_PAGE;

  return { data: users, nextPage: hasNextPage ? page + 1 : null };
};

interface UserSearchParams {
  page: string | null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: UserSearchParams;
}) {
  const users = getUsers(Number(searchParams?.page ?? 1));

  return (
    <main className="p-8 flex flex-col items-center gap-8">
      <h1 className="font-bold text-3xl">GitHub Users</h1>
      <div className="w-[400px] max-h-[400px] overflow-y-scroll pr-4">
        <UsersProvider usersPromise={users}>
          <InfiniteList />

          <LoadingSpinner />
        </UsersProvider>
      </div>
    </main>
  );
}
