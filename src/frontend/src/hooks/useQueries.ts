import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VlogCategory } from "../backend.d";
import { useActor } from "./useActor";

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  total_volume: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string };
}

const SAMPLE_CRYPTO: CoinData[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    current_price: 67420,
    price_change_percentage_24h: 2.34,
    market_cap: 1324000000000,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    total_volume: 28500000000,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    current_price: 3512,
    price_change_percentage_24h: -1.12,
    market_cap: 421000000000,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    total_volume: 15200000000,
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    current_price: 598,
    price_change_percentage_24h: 0.87,
    market_cap: 91000000000,
    image:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    total_volume: 2100000000,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    current_price: 185,
    price_change_percentage_24h: 5.21,
    market_cap: 82000000000,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    total_volume: 4800000000,
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    current_price: 0.62,
    price_change_percentage_24h: -0.45,
    market_cap: 34000000000,
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    total_volume: 1900000000,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    current_price: 0.58,
    price_change_percentage_24h: 3.15,
    market_cap: 20000000000,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    total_volume: 680000000,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    current_price: 0.165,
    price_change_percentage_24h: -2.3,
    market_cap: 23000000000,
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    total_volume: 1200000000,
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    current_price: 9.2,
    price_change_percentage_24h: 1.8,
    market_cap: 13000000000,
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    total_volume: 420000000,
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    current_price: 42,
    price_change_percentage_24h: 4.5,
    market_cap: 17000000000,
    image:
      "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    total_volume: 890000000,
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    current_price: 18.5,
    price_change_percentage_24h: 2.1,
    market_cap: 11000000000,
    image:
      "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    total_volume: 560000000,
  },
];

const SAMPLE_NEWS: NewsArticle[] = [
  {
    title: "Bitcoin Surges Past $67K as Institutional Demand Grows",
    description:
      "Major financial institutions continue to pour money into Bitcoin ETFs, pushing the price to new monthly highs amid growing mainstream adoption.",
    url: "#",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "CryptoNews" },
  },
  {
    title: "Federal Reserve Hints at Rate Cuts in 2025 Amid Economic Slowdown",
    description:
      "Fed officials signal potential interest rate reductions as inflation moderates, boosting risk assets including cryptocurrencies and tech stocks.",
    url: "#",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "Reuters" },
  },
  {
    title: "Ethereum ETF Trading Volume Hits Record High",
    description:
      "Spot Ethereum ETFs recorded their highest single-day trading volume since launch, attracting over $1.2 billion in transactions across major exchanges.",
    url: "#",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: { name: "Bloomberg" },
  },
  {
    title: "Solana DeFi Ecosystem Expands with New Protocol Launch",
    description:
      "A new decentralized finance protocol on Solana claims to offer 10x faster transaction speeds with minimal fees, attracting early liquidity of $500M.",
    url: "#",
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: { name: "CoinDesk" },
  },
  {
    title: "Global Crypto Regulation Framework Takes Shape at G20 Summit",
    description:
      "G20 nations reach preliminary agreement on unified crypto regulation standards, aiming to prevent money laundering while fostering innovation.",
    url: "#",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400",
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    source: { name: "Financial Times" },
  },
  {
    title: "NFT Market Shows Signs of Recovery with New Collections",
    description:
      "After a prolonged bear market, NFT trading volumes are bouncing back as celebrity-backed collections and gaming NFTs gain renewed interest.",
    url: "#",
    image: "https://images.unsplash.com/photo-1646953281231-1f2f5b70bcc4?w=400",
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    source: { name: "The Block" },
  },
];

export function useCryptoPrices() {
  const { actor, isFetching } = useActor();
  return useQuery<CoinData[]>({
    queryKey: ["crypto-prices"],
    queryFn: async () => {
      if (!actor) return SAMPLE_CRYPTO;
      try {
        const json = await actor.fetchCryptoPrices();
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return SAMPLE_CRYPTO;
      } catch {
        return SAMPLE_CRYPTO;
      }
    },
    enabled: !isFetching,
    refetchInterval: 60000,
    placeholderData: SAMPLE_CRYPTO,
  });
}

export function useWorldNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle[]>({
    queryKey: ["world-news"],
    queryFn: async () => {
      if (!actor) return SAMPLE_NEWS;
      try {
        const json = await actor.fetchWorldNews();
        const parsed = JSON.parse(json);
        const articles = parsed?.articles || parsed;
        if (Array.isArray(articles) && articles.length > 0) return articles;
        return SAMPLE_NEWS;
      } catch {
        return SAMPLE_NEWS;
      }
    },
    enabled: !isFetching,
    refetchInterval: 300000,
    placeholderData: SAMPLE_NEWS,
  });
}

export function useVlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["vlog-posts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getVlogPosts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVlogPostsByCategory(category: VlogCategory) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["vlog-posts", category],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getVlogPostsByCategory(category);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAnnouncements();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      videoUrl: string;
      thumbnailUrl: string;
      category: VlogCategory;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createVlogPost(
        data.title,
        data.description,
        data.videoUrl,
        data.thumbnailUrl,
        data.category,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vlog-posts"] }),
  });
}

export function useUpdateVlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      videoUrl: string;
      thumbnailUrl: string;
      category: VlogCategory;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVlogPost(
        data.id,
        data.title,
        data.description,
        data.videoUrl,
        data.thumbnailUrl,
        data.category,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vlog-posts"] }),
  });
}

export function useDeleteVlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVlogPost(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vlog-posts"] }),
  });
}

export function useCreateAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAnnouncement(data.title, data.content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAnnouncement(data.id, data.title, data.content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}
