import { createSupabaseServer } from "./server/server";

export async function saveSearchLog(data: {
  character_name: string;
  server_name?: string;
  class?: string | null;
  item_level?: string;
}) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("search_logs").insert({
    character_name: data.character_name,
    server_name: data.server_name || null,
    class: data.class || null,
    item_level: data.item_level || null,
  });

  if (error) console.error("Error saving search log:", error);
}

export async function upsertCharacterRankings(data: {
  character_name: string;
  server_name: string;
  class: string;
  item_level: string;
  combat_level?: string;
  guild?: string | null;
  engraving?: string;
}) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("character_rankings").upsert(
    {
      character_name: data.character_name,
      server_name: data.server_name,
      class: data.class,
      item_level: data.item_level,
      combat_level: data.combat_level || null,
      guild: data.guild || null,
      engraving: data.engraving || null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "character_name,server_name",
    }
  );

  if (error) console.error("Error upserting character rankings:", error);
}

export async function getRankings(limit = 100) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("character_rankings")
    .select("*")
    .order("item_level", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching rankings:", error);
    return [];
  }
  return data;
}

export async function getRankingsByClass(className: string, limit = 100) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("character_rankings")
    .select("*")
    .eq("class", className)
    .order("item_level", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching rankings:", error);
    return [];
  }
  return data;
}

export async function updateFavoritesByCharacter(data: {
  character_name: string;
  server_name: string;
  class: string;
  item_level: string;
}) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("favorites")
    .update({
      server_name: data.server_name,
      class: data.class,
      item_level: data.item_level,
    })
    .eq("character_name", data.character_name);

  if (error) console.error("Error updating favorites:", error);
}

export async function getPopularSearches(limit = 10) {
  const supabase = await createSupabaseServer();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("search_logs")
    .select("character_name, server_name, class, item_level")
    .gte("searched_at", sevenDaysAgo.toISOString())
    .order("searched_at", { ascending: false });

  if (error) {
    console.error("Error fetching popular searches:", error);
    return [];
  }

  const counts = data.reduce(
    (acc, item) => {
      const key = item.character_name;
      if (!acc[key]) {
        acc[key] = { ...item, count: 0 };
      }
      acc[key].count++;
      return acc;
    },
    {} as Record<string, any>
  );

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
