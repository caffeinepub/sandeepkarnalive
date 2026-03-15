import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Copy,
  Loader2,
  Wallet as WalletIcon,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_pending_approved_rejected } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import {
  useSubmitDeposit,
  useSubmitWithdrawal,
  useUserDeposits,
  useUserWithdrawals,
} from "../hooks/useQueries";

const DEPOSIT_ADDRESSES = [
  {
    currency: "USDT",
    network: "TRC20",
    address: "TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  {
    currency: "BTC",
    network: "Bitcoin",
    address: "bc1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  {
    currency: "ETH",
    network: "ERC20",
    address: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  {
    currency: "BINANCE_PAY",
    network: "Binance Pay",
    address: "Binance ID: 123456789",
  },
];

function StatusBadge({
  status,
}: { status: Variant_pending_approved_rejected }) {
  if (status === Variant_pending_approved_rejected.approved)
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </Badge>
    );
  if (status === Variant_pending_approved_rejected.rejected)
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
        <XCircle className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
      <Clock className="w-3 h-3 mr-1" />
      Pending
    </Badge>
  );
}

export function Wallet() {
  const { user, isLoggedIn } = useAuth();
  const { data: deposits = [] } = useUserDeposits();
  const { data: withdrawals = [] } = useUserWithdrawals();
  const submitDeposit = useSubmitDeposit();
  const submitWithdrawal = useSubmitWithdrawal();

  const [depCurrency, setDepCurrency] = useState("USDT");
  const [depAmount, setDepAmount] = useState("");
  const [depTxHash, setDepTxHash] = useState("");

  const [wdAmount, setWdAmount] = useState("");
  const [wdCurrency, setWdCurrency] = useState("USDT");
  const [wdAddress, setWdAddress] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div
          className="glass-card rounded-2xl p-8 text-center max-w-md"
          data-ocid="wallet.card"
        >
          <WalletIcon className="w-12 h-12 text-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">
            Login Required
          </h3>
          <p className="text-foreground/60 mb-4">
            Sign in to access your wallet
          </p>
          <Link to="/login">
            <Button
              data-ocid="wallet.primary_button"
              className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !depAmount || !depTxHash) {
      toast.error("Fill in all fields");
      return;
    }
    try {
      await submitDeposit.mutateAsync({
        username: user.username,
        currency: depCurrency,
        amount: depAmount,
        txHash: depTxHash,
      });
      toast.success("Deposit submitted! Awaiting admin approval.");
      setDepAmount("");
      setDepTxHash("");
    } catch {
      toast.error("Failed to submit deposit.");
    }
  }

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !wdAmount || !wdAddress) {
      toast.error("Fill in all fields");
      return;
    }
    const amountNum = Number.parseFloat(wdAmount);
    if (amountNum < 10) {
      toast.error("Minimum withdrawal is $10 USDT");
      return;
    }
    const amountMillicents = BigInt(Math.floor(amountNum * 1000));
    if (user.balance < amountMillicents) {
      toast.error("Insufficient balance");
      return;
    }
    try {
      await submitWithdrawal.mutateAsync({
        username: user.username,
        amount: amountMillicents,
        currency: wdCurrency,
        walletAddress: wdAddress,
      });
      toast.success("Withdrawal submitted! Awaiting admin approval.");
      setWdAmount("");
      setWdAddress("");
    } catch {
      toast.error("Failed to submit withdrawal.");
    }
  }

  const balanceUSDT = (Number(user?.balance ?? 0n) / 1000).toFixed(2);
  const totalEarnedUSDT = (Number(user?.totalEarned ?? 0n) / 1000).toFixed(2);
  const totalDepositedUSDT = (
    Number(user?.totalDeposited ?? 0n) / 1000
  ).toFixed(2);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold gold-gradient mb-2">
            My Wallet
          </h1>
          <p className="text-foreground/60">
            Manage your balance, deposits, and withdrawals
          </p>
        </motion.div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            data-ocid="wallet.card"
            className="glass-card rounded-xl p-5 border border-gold/30"
          >
            <p className="text-sm text-foreground/60 mb-1">Available Balance</p>
            <p className="font-display text-3xl font-bold text-gold">
              ${balanceUSDT}
            </p>
            <p className="text-xs text-foreground/40 mt-1">USDT</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            data-ocid="wallet.card"
            className="glass-card rounded-xl p-5"
          >
            <p className="text-sm text-foreground/60 mb-1">Total Earned</p>
            <p className="font-display text-3xl font-bold text-green-400">
              ${totalEarnedUSDT}
            </p>
            <p className="text-xs text-foreground/40 mt-1">USDT earned</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            data-ocid="wallet.card"
            className="glass-card rounded-xl p-5"
          >
            <p className="text-sm text-foreground/60 mb-1">Total Deposited</p>
            <p className="font-display text-3xl font-bold text-blue-400">
              ${totalDepositedUSDT}
            </p>
            <p className="text-xs text-foreground/40 mt-1">USDT deposited</p>
          </motion.div>
        </div>

        <Tabs defaultValue="deposit" className="space-y-6">
          <TabsList className="glass-card border border-gold/20 p-1">
            <TabsTrigger
              data-ocid="wallet.tab"
              value="deposit"
              className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" /> Deposit
            </TabsTrigger>
            <TabsTrigger
              data-ocid="wallet.tab"
              value="withdraw"
              className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" /> Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-6">
            {/* Wallet addresses */}
            <div className="glass-card rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-gold mb-3">
                Our Deposit Addresses
              </h3>
              {DEPOSIT_ADDRESSES.map((addr) => (
                <div
                  key={addr.currency}
                  className="flex items-start justify-between gap-3 py-2 border-b border-border/30 last:border-0"
                >
                  <div>
                    <span className="text-xs font-bold bg-gold/20 text-gold px-2 py-0.5 rounded">
                      {addr.currency}
                    </span>
                    <span className="text-xs text-foreground/50 ml-2">
                      {addr.network}
                    </span>
                    <p className="font-mono text-sm text-foreground/80 mt-1 break-all">
                      {addr.address}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    data-ocid="wallet.secondary_button"
                    onClick={() => {
                      navigator.clipboard.writeText(addr.address);
                      toast.success("Copied!");
                    }}
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Deposit form */}
            <form
              onSubmit={handleDeposit}
              className="glass-card rounded-xl p-5 space-y-4"
            >
              <h3 className="font-semibold">Submit Deposit Proof</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={depCurrency} onValueChange={setDepCurrency}>
                    <SelectTrigger data-ocid="wallet.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="BINANCE_PAY">Binance Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    data-ocid="wallet.input"
                    placeholder="e.g. 50"
                    value={depAmount}
                    onChange={(e) => setDepAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Transaction Hash / Reference</Label>
                <Input
                  data-ocid="wallet.input"
                  placeholder="Paste your transaction hash here"
                  value={depTxHash}
                  onChange={(e) => setDepTxHash(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                data-ocid="wallet.submit_button"
                disabled={submitDeposit.isPending}
                className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
              >
                {submitDeposit.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                )}
                Submit Deposit
              </Button>
            </form>

            {/* Deposit history */}
            {deposits.length > 0 && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold mb-3">Deposit History</h3>
                <div className="space-y-2">
                  {deposits.map((d, i) => (
                    <div
                      key={String(d.id)}
                      data-ocid={`wallet.row.${i + 1}`}
                      className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0"
                    >
                      <div>
                        <span className="font-medium">{d.currency}</span>
                        <span className="text-foreground/50 ml-2">
                          {d.amount}
                        </span>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <div className="glass-card rounded-xl p-4 border border-yellow-500/20">
              <p className="text-sm text-yellow-400">
                ⚠️ Minimum withdrawal: <strong>$10 USDT</strong>. Withdrawals are
                processed after admin approval.
              </p>
            </div>

            <form
              onSubmit={handleWithdraw}
              className="glass-card rounded-xl p-5 space-y-4"
            >
              <h3 className="font-semibold">Request Withdrawal</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <Input
                    data-ocid="wallet.input"
                    type="number"
                    min="10"
                    step="0.01"
                    placeholder="Min $10"
                    value={wdAmount}
                    onChange={(e) => setWdAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={wdCurrency} onValueChange={setWdCurrency}>
                    <SelectTrigger data-ocid="wallet.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="BINANCE_PAY">Binance Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <Input
                  data-ocid="wallet.input"
                  placeholder="Your wallet address / Binance ID"
                  value={wdAddress}
                  onChange={(e) => setWdAddress(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                data-ocid="wallet.submit_button"
                disabled={submitWithdrawal.isPending}
                className="bg-gradient-to-r from-gold to-orange-brand text-navy font-bold"
              >
                {submitWithdrawal.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                )}
                Request Withdrawal
              </Button>
            </form>

            {withdrawals.length > 0 && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold mb-3">Withdrawal History</h3>
                <div className="space-y-2">
                  {withdrawals.map((w, i) => (
                    <div
                      key={String(w.id)}
                      data-ocid={`wallet.row.${i + 1}`}
                      className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0"
                    >
                      <div>
                        <span className="font-medium">{w.currency}</span>
                        <span className="text-foreground/50 ml-2">
                          ${(Number(w.amount) / 1000).toFixed(2)}
                        </span>
                      </div>
                      <StatusBadge status={w.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
