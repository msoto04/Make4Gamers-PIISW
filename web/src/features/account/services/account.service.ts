import {
  getAccountFriends as getAccountFriendsFromApi,
  getAccountProfile as getAccountProfileFromApi,
  getAccountRecentGames as getAccountRecentGamesFromApi,
  updateAccountProfile as updateAccountProfileFromApi,
  type AccountFriend,
  type AccountProfile,
  type AccountRecentGame,
} from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export type { AccountProfile, AccountRecentGame, AccountFriend };

export function getAccountProfile(userId: string): Promise<AccountProfile> {
  return getAccountProfileFromApi(supabase, userId);
}

export function updateAccountProfile(
  userId: string,
  patch: Partial<Omit<AccountProfile, "id">>,
): Promise<void> {
  return updateAccountProfileFromApi(supabase, userId, patch);
}

export function getAccountRecentGames(userId: string, limit = 5): Promise<AccountRecentGame[]> {
  return getAccountRecentGamesFromApi(supabase, userId, limit);
}

export function getAccountFriends(userId: string): Promise<AccountFriend[]> {
  return getAccountFriendsFromApi(supabase, userId);
}
