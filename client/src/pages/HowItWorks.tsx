import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorks() {
  const items = [
    { title: "Smart-Contract Escrow", body: "Funds are locked on Polygon until work is approved." },
    { title: "Proof-of-Work NFTs", body: "Completed jobs mint non-transferable NFTs as on-chain resume." },
    { title: "AI Matching (later)", body: "Recommends jobs based on skills and past NFTs." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-3xl font-heading font-bold">How TaskGrid Works</h1>
        <p className="text-muted-foreground">Decentralized freelancing with escrow, NFTs, and optional AI.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((it) => (
            <Card key={it.title}>
              <CardHeader><CardTitle>{it.title}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{it.body}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


