import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Wallet } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { signOut } from "@/lib/auth";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress] = useState("0x742d...E8f3");
  const role = typeof window !== 'undefined' ? localStorage.getItem("tg_role") : null;

  const isActive = (path: string) => location === path;

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md -ml-2" data-testid="link-home">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-xl">TaskGrid</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {(role === "freelancer" || !role) && (
                <Link href="/find-work">
                  <a className="inline-block">
                    <div 
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 h-9 px-4 py-2 ${
                        isActive("/find-work") 
                          ? "bg-secondary text-secondary-foreground border border-secondary-border"
                          : "hover:bg-accent hover:text-accent-foreground border border-transparent"
                      }`}
                      data-testid="link-find-work"
                    >
                      Find Work
                    </div>
                  </a>
                </Link>
              )}
              {(role === "poster" || !role) && (
                <Link href="/post-job">
                  <a className="inline-block">
                    <div 
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 h-9 px-4 py-2 ${
                        isActive("/post-job")
                          ? "bg-secondary text-secondary-foreground border border-secondary-border"
                          : "hover:bg-accent hover:text-accent-foreground border border-transparent"
                      }`}
                      data-testid="link-post-job"
                    >
                      Post a Job
                    </div>
                  </a>
                </Link>
              )}
              <Link href="/how-it-works">
                <a className="inline-block">
                  <div 
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 h-9 px-4 py-2 ${
                      isActive("/how-it-works")
                        ? "bg-secondary text-secondary-foreground border border-secondary-border"
                        : "hover:bg-accent hover:text-accent-foreground border border-transparent"
                    }`}
                    data-testid="link-how-it-works"
                  >
                    How It Works
                  </div>
                </a>
              </Link>
              <Link href="/converter">
                <a className="inline-block">
                  <div 
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 h-9 px-4 py-2 ${
                      isActive("/converter")
                        ? "bg-secondary text-secondary-foreground border border-secondary-border"
                        : "hover:bg-accent hover:text-accent-foreground border border-transparent"
                    }`}
                    data-testid="link-converter"
                  >
                    Converter
                  </div>
                </a>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {walletConnected ? (
              <Link href="/profile">
                <a className="inline-block">
                  <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 h-9 px-4 py-2 bg-secondary text-secondary-foreground border border-secondary-border" data-testid="button-profile">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">0x</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-mono">{walletAddress}</span>
                  </div>
                </a>
              </Link>
            ) : (
              <Button
                variant="default"
                className="gap-2"
                onClick={handleConnectWallet}
                data-testid="button-connect-wallet"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
              </Button>
            )}

            <Link href="/auth">
              <a className="inline-block">
                <div 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 h-9 px-3 py-2 border"
                >
                  Sign In / Up
                </div>
              </a>
            </Link>
            <Button variant="ghost" onClick={() => { signOut(); }}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
