/**
 * SideShift API Integration Service
 * Handles cryptocurrency swaps and conversions
 */

const SIDESHIFT_API_URL = "https://api.sideshift.ai/v2";
// @ts-ignore - process.env is available at runtime
const SIDESHIFT_SECRET = process.env.SIDESHIFT_SECRET || "";
// @ts-ignore - process.env is available at runtime
const SIDESHIFT_AFFILIATE_ID = process.env.SIDESHIFT_AFFILIATE_ID || "";

export interface SideShiftCoin {
  id: string;
  name: string;
  network: string;
  symbol: string;
  icon?: string;
}

export interface SideShiftQuote {
  id: string;
  depositCoin: string;
  settleCoin: string;
  depositAmount: string;
  settleAmount: string;
  rate: string;
  expiresAt: string;
}

export interface SideShiftShift {
  id: string;
  type: "fixed" | "variable";
  depositCoin: string;
  settleCoin: string;
  depositAmount?: string;
  settleAmount?: string;
  depositAddress: string;
  settleAddress: string;
  status: string;
  createdAt: string;
}

/**
 * Get available coins for swapping
 */
export async function getAvailableCoins(): Promise<SideShiftCoin[]> {
  try {
    const response = await fetch(`${SIDESHIFT_API_URL}/coins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`SideShift API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error("Error fetching available coins:", error);
    // Return popular coins as fallback
    return [
      { id: "USDC", name: "USD Coin", network: "POLYGON", symbol: "USDC" },
      { id: "MATIC", name: "Polygon", network: "POLYGON", symbol: "MATIC" },
      { id: "ETH", name: "Ethereum", network: "ETHEREUM", symbol: "ETH" },
      { id: "BTC", name: "Bitcoin", network: "BITCOIN", symbol: "BTC" },
      { id: "USDT", name: "Tether", network: "POLYGON", symbol: "USDT" },
    ];
  }
}

/**
 * Get a quote for swapping coins
 */
export async function getQuote(
  depositCoin: string,
  settleCoin: string,
  depositAmount?: string,
  settleAmount?: string
): Promise<SideShiftQuote | null> {
  try {
    const params = new URLSearchParams({
      depositCoin,
      settleCoin,
    });

    if (depositAmount) {
      params.append("depositAmount", depositAmount);
    }
    if (settleAmount) {
      params.append("settleAmount", settleAmount);
    }

    const response = await fetch(`${SIDESHIFT_API_URL}/quotes?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(SIDESHIFT_SECRET && { "x-sideshift-secret": SIDESHIFT_SECRET }),
      },
    });

    if (!response.ok) {
      throw new Error(`SideShift API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting quote:", error);
    return null;
  }
}

/**
 * Create a fixed shift (swap)
 */
export async function createFixedShift(
  quoteId: string,
  settleAddress: string,
  affiliateId?: string
): Promise<SideShiftShift | null> {
  try {
    const response = await fetch(`${SIDESHIFT_API_URL}/shifts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SIDESHIFT_SECRET && { "x-sideshift-secret": SIDESHIFT_SECRET }),
      },
      body: JSON.stringify({
        type: "fixed",
        quoteId,
        settleAddress,
        affiliateId: affiliateId || SIDESHIFT_AFFILIATE_ID,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`SideShift API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating shift:", error);
    return null;
  }
}

/**
 * Get shift status
 */
export async function getShiftStatus(shiftId: string): Promise<SideShiftShift | null> {
  try {
    const response = await fetch(`${SIDESHIFT_API_URL}/shifts/${shiftId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(SIDESHIFT_SECRET && { "x-sideshift-secret": SIDESHIFT_SECRET }),
      },
    });

    if (!response.ok) {
      throw new Error(`SideShift API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting shift status:", error);
    return null;
  }
}

/**
 * Convert any coin to a base currency (e.g., USDC)
 * This is the main function used for payment conversion
 */
export async function convertToBaseCurrency(
  fromCoin: string,
  amount: string,
  toCoin: string = "USDC"
): Promise<{ convertedAmount: string; rate: string; quoteId?: string } | null> {
  try {
    const quote = await getQuote(fromCoin, toCoin, amount);
    
    if (!quote) {
      return null;
    }

    return {
      convertedAmount: quote.settleAmount,
      rate: quote.rate,
      quoteId: quote.id,
    };
  } catch (error) {
    console.error("Error converting currency:", error);
    return null;
  }
}

