import { TrendingUp } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer
      className="border-t border-gold/10 mt-20 py-10"
      style={{ background: "rgba(8,12,24,0.95)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-navy" />
            </div>
            <span className="font-display font-bold gold-gradient">
              SandeepKarnaLive
            </span>
          </div>
          <div className="flex gap-6 text-sm text-foreground/50">
            <span>Trading</span>
            <span>Crypto</span>
            <span>Daily Vlogs</span>
          </div>
          <p className="text-sm text-foreground/40">
            © {year}. Built with ❤️ using{" "}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/60 hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
