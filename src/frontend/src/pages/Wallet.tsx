import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Hash,
  Loader2,
  Network,
  Shield,
  Wallet as WalletIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";

const ADDRESSES = [
  {
    currency: "USDT (TRC20)",
    symbol: "USDT",
    address: "THS4eZw4H6Xqdhnkdt3Up52ZSHQTKg6zRH",
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bg: "from-green-500/10 to-teal-500/5",
    network: "Tron Network",
    icon: "🟢",
  },
  {
    currency: "Ethereum (ETH)",
    symbol: "ETH",
    address: "0x95807b190b65c6b6d907527ff9fd4ef657099719",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bg: "from-blue-500/10 to-indigo-500/5",
    network: "Ethereum Network (ERC-20)",
    icon: "🔵",
  },
  {
    currency: "Bitcoin (BTC)",
    symbol: "BTC",
    address: "1EHAG2Ftyae1fUQ9UP5PXp5tjq3Z3MFk9D",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bg: "from-orange-500/10 to-amber-500/5",
    network: "Bitcoin Network",
    icon: "🟠",
  },
  {
    currency: "Solana (SOL)",
    symbol: "SOL",
    address: "87DuKMNo23BNHeH5t1y9gDzmofqAksVpoybqQrZ4QjMz",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bg: "from-purple-500/10 to-pink-500/5",
    network: "Solana Network",
    icon: "🟣",
  },
];

const CURRENCY_NETWORK: Record<string, string> = {
  USDT: "Tron Network (TRC-20)",
  ETH: "Ethereum Network (ERC-20)",
  BTC: "Bitcoin Network",
  SOL: "Solana Network",
};

function generateOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "ORD-";
  for (let i = 0; i < 8; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function CopyButton({
  text,
  size = "md",
}: { text: string; size?: "sm" | "md" }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={copy}
      data-ocid="wallet.button"
      className={`flex items-center gap-1 rounded-lg font-medium transition-all ${
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      } ${
        copied
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20"
      }`}
    >
      {copied ? (
        <>
          <Check className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} /> Copied!
        </>
      ) : (
        <>
          <Copy className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} /> Copy
        </>
      )}
    </button>
  );
}

interface DepositConfirmation {
  orderId: string;
  currency: string;
  amount: string;
  walletAddress: string;
  txHash: string;
  network: string;
}

interface WithdrawConfirmation {
  orderId: string;
  currency: string;
  amount: string;
  walletAddress: string;
  network: string;
  remainingBalance: number;
}

export function Wallet() {
  const { user, isLoggedIn } = useAuth();
  const { actor } = useActor();

  const [depositForm, setDepositForm] = useState({
    currency: "USDT",
    amount: "",
    txHash: "",
  });
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    currency: "USDT",
    walletAddress: "",
  });
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [depositConfirm, setDepositConfirm] =
    useState<DepositConfirmation | null>(null);
  const [withdrawConfirm, setWithdrawConfirm] =
    useState<WithdrawConfirmation | null>(null);

  const balance = user?.balance || 0;

  const selectedAddress = ADDRESSES.find(
    (a) => a.symbol === depositForm.currency,
  );

  const txKey = `sce_tx_${user?.username || "guest"}`;
  function getTxHistory() {
    try {
      return JSON.parse(localStorage.getItem(txKey) || "[]");
    } catch {
      return [];
    }
  }
  function addTx(tx: object) {
    const h = getTxHistory();
    h.unshift({ ...tx, date: new Date().toISOString() });
    localStorage.setItem(txKey, JSON.stringify(h.slice(0, 50)));
  }
  const txHistory = getTxHistory();

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login first.");
      return;
    }
    if (!depositForm.amount || !depositForm.txHash) {
      toast.error("Please fill all required fields.");
      return;
    }
    setDepositLoading(true);
    try {
      if (actor) {
        try {
          await actor.submitDepositRequest(
            user!.username,
            depositForm.currency,
            depositForm.amount,
            depositForm.txHash,
          );
        } catch {
          /* ignore */
        }
      }
      const orderId = generateOrderId();
      addTx({
        type: "deposit",
        orderId,
        currency: depositForm.currency,
        amount: depositForm.amount,
        txHash: depositForm.txHash,
        status: "pending",
      });
      setDepositConfirm({
        orderId,
        currency: depositForm.currency,
        amount: depositForm.amount,
        walletAddress: selectedAddress?.address || "",
        txHash: depositForm.txHash,
        network: selectedAddress?.network || "",
      });
      setDepositForm({ currency: "USDT", amount: "", txHash: "" });
    } finally {
      setDepositLoading(false);
    }
  }

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login first.");
      return;
    }
    const amt = Number.parseFloat(withdrawForm.amount);
    if (!amt || amt < 10) {
      toast.error("Minimum withdrawal is $10.");
      return;
    }
    if (!withdrawForm.walletAddress) {
      toast.error("Please enter your wallet address.");
      return;
    }
    if (balance < amt) {
      toast.error("Insufficient balance.");
      return;
    }
    setWithdrawLoading(true);
    try {
      if (actor) {
        try {
          await actor.submitWithdrawalRequest(
            user!.username,
            BigInt(Math.round(amt * 1000)),
            withdrawForm.currency,
            withdrawForm.walletAddress,
          );
        } catch {
          /* ignore */
        }
      }
      const orderId = generateOrderId();
      addTx({
        type: "withdrawal",
        orderId,
        currency: withdrawForm.currency,
        amount: withdrawForm.amount,
        walletAddress: withdrawForm.walletAddress,
        status: "pending",
      });
      setWithdrawConfirm({
        orderId,
        currency: withdrawForm.currency,
        amount: withdrawForm.amount,
        walletAddress: withdrawForm.walletAddress,
        network: CURRENCY_NETWORK[withdrawForm.currency] || "",
        remainingBalance: balance - amt,
      });
      setWithdrawForm({ amount: "", currency: "USDT", walletAddress: "" });
    } finally {
      setWithdrawLoading(false);
    }
  }

  const withdrawAmt = Number.parseFloat(withdrawForm.amount) || 0;
  const showWithdrawSummary =
    withdrawForm.amount &&
    withdrawForm.walletAddress &&
    withdrawAmt >= 10 &&
    withdrawAmt <= balance;

  return (
    <div className="min-h-screen bg-mesh pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/30 to-orange-brand/20 border border-gold/30 flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-gold" />
            </div>
            <h1 className="font-display text-4xl font-bold gold-gradient">
              Wallet
            </h1>
          </div>
          <p className="text-muted-foreground pl-[52px]">
            Deposit, withdraw and track your transactions
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="relative glass-card rounded-3xl p-6 mb-8 overflow-hidden"
          data-ocid="wallet.card"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-32 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-32 bg-orange-brand/8 rounded-full blur-3xl" />
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1 font-medium tracking-wide uppercase">
                Available Balance
              </div>
              <div className="font-display text-5xl font-bold text-gold mb-1">
                ${balance.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                USDT • Sandeep Karn Crypto Empire
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-orange-brand/10 border border-gold/20 flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-gold/60" />
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="deposit" data-ocid="wallet.tab">
          <TabsList className="bg-background/50 border border-border/50 w-full mb-6 p-1 rounded-xl">
            <TabsTrigger
              value="deposit"
              data-ocid="wallet.tab"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-orange-brand data-[state=active]:text-navy font-semibold rounded-lg"
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" /> Deposit
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              data-ocid="wallet.tab"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-orange-brand data-[state=active]:text-navy font-semibold rounded-lg"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" /> Withdraw
            </TabsTrigger>
            <TabsTrigger
              value="history"
              data-ocid="wallet.tab"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-orange-brand data-[state=active]:text-navy font-semibold rounded-lg"
            >
              History
            </TabsTrigger>
          </TabsList>

          {/* ─── DEPOSIT TAB ─── */}
          <TabsContent value="deposit">
            <AnimatePresence mode="wait">
              <motion.div
                key="deposit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Step 1 – Select currency */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center">
                      1
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground">
                      Select Currency & Amount
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/80">
                        Currency
                      </Label>
                      <Select
                        value={depositForm.currency}
                        onValueChange={(v) =>
                          setDepositForm({ ...depositForm, currency: v })
                        }
                      >
                        <SelectTrigger
                          data-ocid="wallet.select"
                          className="bg-background/50 border-border/60 h-11"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ADDRESSES.map((a) => (
                            <SelectItem key={a.symbol} value={a.symbol}>
                              {a.icon} {a.symbol} — {a.network}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/80">
                        Amount (USD)
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 100"
                        data-ocid="wallet.input"
                        value={depositForm.amount}
                        onChange={(e) =>
                          setDepositForm({
                            ...depositForm,
                            amount: e.target.value,
                          })
                        }
                        className="bg-background/50 border-border/60 focus:border-gold/50 h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 – Send to address */}
                {selectedAddress && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass-card rounded-2xl p-6 border bg-gradient-to-br ${selectedAddress.bg} ${selectedAddress.borderColor}`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center">
                        2
                      </div>
                      <h3 className="font-display font-bold text-lg text-foreground">
                        Send to This Address
                      </h3>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Network className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {selectedAddress.network}
                        </span>
                      </div>
                      <p className="text-xs text-yellow-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Send only {selectedAddress.symbol} on{" "}
                        {selectedAddress.network}. Wrong network = lost funds.
                      </p>
                    </div>
                    <div className="bg-background/60 border border-border/50 rounded-xl p-4">
                      <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                        Wallet Address
                      </div>
                      <div className="flex items-center gap-3">
                        <code
                          className={`text-sm font-mono ${selectedAddress.color} flex-1 break-all leading-relaxed`}
                        >
                          {selectedAddress.address}
                        </code>
                        <CopyButton text={selectedAddress.address} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 – Transaction hash + submit */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center">
                      3
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground">
                      Confirm Your Payment
                    </h3>
                  </div>
                  <form onSubmit={handleDeposit}>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm text-foreground/80 flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5" /> Transaction Hash /
                          TXID *
                        </Label>
                        <Input
                          type="text"
                          placeholder="Paste your blockchain transaction hash"
                          data-ocid="wallet.input"
                          value={depositForm.txHash}
                          onChange={(e) =>
                            setDepositForm({
                              ...depositForm,
                              txHash: e.target.value,
                            })
                          }
                          className="bg-background/50 border-border/60 focus:border-gold/50 h-11 font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          After sending, copy the transaction hash from your
                          wallet/exchange and paste it here.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        data-ocid="wallet.submit_button"
                        disabled={
                          depositLoading ||
                          !depositForm.amount ||
                          !depositForm.txHash
                        }
                        className="w-full bg-gradient-to-r from-gold to-orange-brand text-navy font-bold h-12 text-base rounded-xl"
                      >
                        {depositLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 mr-2" />
                        )}
                        Submit Deposit Request
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Exchange options */}
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-4">
                    Pay via Exchange
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4 opacity-60 relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Coming Soon
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-lg">
                          🟡
                        </div>
                        <span className="font-bold text-yellow-400/60 text-sm">
                          Binance Pay
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Binance Pay integration coming soon.
                      </p>
                    </div>
                    <div className="glass-card rounded-xl p-4 border border-orange-500/30">
                      <div className="absolute top-2 right-2" />
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-lg">
                          🟠
                        </div>
                        <span className="font-bold text-orange-400 text-sm">
                          Bybit Pay
                        </span>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs ml-auto">
                          ✓ Active
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Scan the QR code with your Bybit App to pay directly.
                      </p>
                      <div className="flex justify-center">
                        <img
                          src="/assets/uploads/1773727379409-1.jpg"
                          alt="Bybit Pay QR Code"
                          className="w-44 h-auto rounded-lg border border-orange-500/20"
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Open Bybit App → Scan QR → Pay
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* ─── WITHDRAW TAB ─── */}
          <TabsContent value="withdraw">
            <AnimatePresence mode="wait">
              <motion.div
                key="withdraw"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Minimum withdrawal: <strong>$10</strong>. A 15% platform
                    commission applies. All requests reviewed by admin within 24
                    hours.
                  </span>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-bold text-lg text-foreground mb-5">
                    Withdrawal Details
                  </h3>
                  <form onSubmit={handleWithdraw}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm text-foreground/80">
                            Amount (min $10)
                          </Label>
                          <Input
                            type="number"
                            min="10"
                            max={balance}
                            placeholder="Minimum $10"
                            data-ocid="wallet.input"
                            value={withdrawForm.amount}
                            onChange={(e) =>
                              setWithdrawForm({
                                ...withdrawForm,
                                amount: e.target.value,
                              })
                            }
                            className="bg-background/50 border-border/60 focus:border-gold/50 h-11"
                          />
                          {withdrawForm.amount && withdrawAmt > balance && (
                            <p
                              className="text-xs text-red-400"
                              data-ocid="wallet.error_state"
                            >
                              Exceeds available balance (${balance.toFixed(2)})
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm text-foreground/80">
                            Currency
                          </Label>
                          <Select
                            value={withdrawForm.currency}
                            onValueChange={(v) =>
                              setWithdrawForm({ ...withdrawForm, currency: v })
                            }
                          >
                            <SelectTrigger
                              data-ocid="wallet.select"
                              className="bg-background/50 border-border/60 h-11"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["USDT", "ETH", "BTC", "SOL"].map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm text-foreground/80">
                          Your Receiving Wallet Address *
                        </Label>
                        <Input
                          type="text"
                          placeholder={`Your ${withdrawForm.currency} wallet address`}
                          data-ocid="wallet.input"
                          value={withdrawForm.walletAddress}
                          onChange={(e) =>
                            setWithdrawForm({
                              ...withdrawForm,
                              walletAddress: e.target.value,
                            })
                          }
                          className="bg-background/50 border-border/60 focus:border-gold/50 h-11 font-mono text-sm"
                        />
                        {withdrawForm.currency && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Network className="w-3 h-3" /> Network:{" "}
                            {CURRENCY_NETWORK[withdrawForm.currency]}
                          </p>
                        )}
                      </div>

                      {/* Pre-submission summary */}
                      <AnimatePresence>
                        {showWithdrawSummary && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gold/5 border border-gold/20 rounded-xl p-4 space-y-3"
                            data-ocid="wallet.panel"
                          >
                            <div className="text-sm font-bold text-gold flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" /> Withdrawal
                              Summary
                            </div>
                            <div className="space-y-2 text-sm">
                              {[
                                [
                                  "Amount",
                                  `$${withdrawForm.amount} ${withdrawForm.currency}`,
                                ],
                                [
                                  "Network",
                                  CURRENCY_NETWORK[withdrawForm.currency],
                                ],
                                [
                                  "Receiving Address",
                                  withdrawForm.walletAddress,
                                ],
                                ["Platform Fee", "15% commission"],
                                ["Est. Receive Time", "Within 24 hours"],
                                [
                                  "Balance After",
                                  `$${(balance - withdrawAmt).toFixed(2)} USDT`,
                                ],
                              ].map(([label, value]) => (
                                <div
                                  key={label}
                                  className="flex items-start justify-between gap-4"
                                >
                                  <span className="text-muted-foreground shrink-0">
                                    {label}
                                  </span>
                                  <span className="text-foreground font-medium text-right break-all">
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button
                        type="submit"
                        data-ocid="wallet.submit_button"
                        disabled={
                          withdrawLoading ||
                          !withdrawForm.amount ||
                          !withdrawForm.walletAddress ||
                          withdrawAmt < 10 ||
                          withdrawAmt > balance
                        }
                        className="w-full bg-gradient-to-r from-gold to-orange-brand text-navy font-bold h-12 text-base rounded-xl"
                      >
                        {withdrawLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                        )}
                        Confirm Withdrawal
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="glass-card rounded-xl p-4 border border-blue-500/20 bg-blue-500/5">
                  <div className="flex items-start gap-2 text-sm text-blue-300">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold mb-1">Security Reminder</div>
                      <p className="text-xs text-muted-foreground">
                        Never share your wallet seed phrase or private key with
                        anyone, including Sandeep Karn Crypto Empire support. We
                        will never ask for your seed phrase.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* ─── HISTORY TAB ─── */}
          <TabsContent value="history">
            <div
              className="glass-card rounded-2xl overflow-hidden"
              data-ocid="wallet.table"
            >
              {txHistory.length === 0 ? (
                <div
                  data-ocid="wallet.empty_state"
                  className="text-center py-16"
                >
                  <WalletIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">
                    No transactions yet
                  </p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    Your deposit and withdrawal history will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-background/30">
                        {[
                          "Order ID",
                          "Type",
                          "Amount",
                          "Currency",
                          "Status",
                          "Date",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {txHistory.map((tx: any, i: number) => (
                        <tr
                          key={tx.date + String(i)}
                          data-ocid={`wallet.row.${i + 1}`}
                          className="border-b border-border/20 hover:bg-gold/5 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {tx.orderId || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={
                                tx.type === "deposit"
                                  ? "text-green-400 border-green-500/30 bg-green-500/10"
                                  : "text-orange-400 border-orange-500/30 bg-orange-500/10"
                              }
                            >
                              {tx.type === "deposit" ? (
                                <ArrowDownLeft className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                              )}
                              {tx.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-foreground">
                            ${tx.amount}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {tx.currency}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                tx.status === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : tx.status === "rejected"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {tx.status === "pending"
                                ? "⏳ Pending"
                                : tx.status === "approved"
                                  ? "✅ Approved"
                                  : "❌ Rejected"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString()}{" "}
                            {new Date(tx.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ─── DEPOSIT CONFIRMATION MODAL ─── */}
      <Dialog
        open={!!depositConfirm}
        onOpenChange={(o) => !o && setDepositConfirm(null)}
      >
        <DialogContent
          className="max-w-md glass-card border border-gold/20"
          data-ocid="wallet.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-display">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              Deposit Request Submitted
            </DialogTitle>
          </DialogHeader>
          {depositConfirm && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400">
                ✅ Your deposit request has been received and is pending admin
                approval.
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ["Order ID", depositConfirm.orderId],
                  ["Currency", depositConfirm.currency],
                  ["Amount", `$${depositConfirm.amount} USD`],
                  ["Network", depositConfirm.network],
                  ["Wallet Address Sent To", depositConfirm.walletAddress],
                  ["Transaction Hash", depositConfirm.txHash],
                  ["Status", "⏳ Pending Admin Approval"],
                  ["Est. Processing", "Within 24 hours"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 pb-2 border-b border-border/20 last:border-0"
                  >
                    <span className="text-muted-foreground shrink-0 font-medium">
                      {label}
                    </span>
                    <span className="text-foreground text-right break-all font-mono text-xs">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                data-ocid="wallet.close_button"
                onClick={() => setDepositConfirm(null)}
                className="w-full bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── WITHDRAWAL CONFIRMATION MODAL ─── */}
      <Dialog
        open={!!withdrawConfirm}
        onOpenChange={(o) => !o && setWithdrawConfirm(null)}
      >
        <DialogContent
          className="max-w-md glass-card border border-gold/20"
          data-ocid="wallet.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-display">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              Withdrawal Request Submitted
            </DialogTitle>
          </DialogHeader>
          {withdrawConfirm && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400">
                ✅ Your withdrawal request has been received and is pending
                admin approval.
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ["Order ID", withdrawConfirm.orderId],
                  [
                    "Amount Requested",
                    `$${withdrawConfirm.amount} ${withdrawConfirm.currency}`,
                  ],
                  [
                    "Currency & Network",
                    `${withdrawConfirm.currency} • ${withdrawConfirm.network}`,
                  ],
                  ["Your Wallet Address", withdrawConfirm.walletAddress],
                  [
                    "Remaining Balance",
                    `$${withdrawConfirm.remainingBalance.toFixed(2)} USDT`,
                  ],
                  ["Status", "⏳ Pending Admin Approval"],
                  ["Est. Processing", "Within 24 hours"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 pb-2 border-b border-border/20 last:border-0"
                  >
                    <span className="text-muted-foreground shrink-0 font-medium">
                      {label}
                    </span>
                    <span className="text-foreground text-right break-all font-mono text-xs">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-xs text-red-400 flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> Never share your wallet seed
                    phrase or private key with anyone. Sandeep Karn Crypto
                    Empire will never ask for your seed phrase.
                  </span>
                </p>
              </div>
              <Button
                data-ocid="wallet.close_button"
                onClick={() => setWithdrawConfirm(null)}
                className="w-full bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
